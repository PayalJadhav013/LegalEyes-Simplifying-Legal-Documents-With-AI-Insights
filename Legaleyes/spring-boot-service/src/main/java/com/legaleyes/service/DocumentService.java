package com.legaleyes.service;

import com.legaleyes.exception.AiServiceException;
import com.legaleyes.exception.DocumentNotFoundException;
import com.legaleyes.model.Document;
import com.legaleyes.model.Document.DocumentStatus;
import com.legaleyes.repository.DocumentRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.metadata.TikaCoreProperties;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.sax.BodyContentHandler;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final WebClient aiWebClient;

    public DocumentService(DocumentRepository documentRepository, WebClient aiWebClient) {
        this.documentRepository = documentRepository;
        this.aiWebClient = aiWebClient;
    }

    public record UploadResponse(String documentId, String fileName, long fileSize,
                                 int chunksStored, String status) {}
    public record ChatMessageDTO(String role, String content) {}
    public record ChatRequest(List<ChatMessageDTO> messages, String documentId, String action) {}
    public record ChatResponse(String reply, int sourcesUsed) {}

    public UploadResponse uploadDocument(MultipartFile file, String userId) {
        if (file.isEmpty()) throw new IllegalArgumentException("File is empty");

        String docId    = UUID.randomUUID().toString();
        String fileName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "unknown";
        String mime     = file.getContentType()      != null ? file.getContentType()      : "application/octet-stream";

        Document doc = Document.builder()
                .id(docId).fileName(fileName).mimeType(mime)
                .fileSize(file.getSize()).userId(userId)
                .status(DocumentStatus.PROCESSING).build();
        documentRepository.save(doc);

        String text;
        try { text = extractText(file); }
        catch (Exception e) {
            doc.setStatus(DocumentStatus.FAILED); documentRepository.save(doc);
            throw new AiServiceException("Text extraction failed: " + e.getMessage(), e);
        }

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> resp = aiWebClient.post()
                    .uri("/api/ai/ingest")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(Map.of("documentId", docId, "fileName", fileName,
                                      "content", text, "userId", userId))
                    .retrieve().bodyToMono(Map.class).block();

            int chunks = resp != null && resp.get("chunksStored") instanceof Number n ? n.intValue() : 0;
            doc.setChunksStored(chunks); doc.setStatus(DocumentStatus.READY);
            documentRepository.save(doc);
            return new UploadResponse(docId, fileName, file.getSize(), chunks, "READY");

        } catch (Exception e) {
            doc.setStatus(DocumentStatus.FAILED); documentRepository.save(doc);
            throw new AiServiceException("AI service unavailable: " + e.getMessage(), e);
        }
    }

    public ChatResponse chat(ChatRequest req, String userId) {
        if (req.documentId() != null && !req.documentId().isBlank()) {
            documentRepository.findByIdAndUserId(req.documentId(), userId)
                    .orElseThrow(() -> new DocumentNotFoundException(req.documentId()));
        }
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> resp = aiWebClient.post()
                    .uri("/api/ai/chat")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(Map.of("messages", req.messages(),
                                      "documentId", req.documentId() != null ? req.documentId() : "",
                                      "action",     req.action()     != null ? req.action()     : "",
                                      "userId", userId))
                    .retrieve().bodyToMono(Map.class).block();

            if (resp == null) throw new AiServiceException("Empty response from AI");
            String reply   = resp.get("reply")       instanceof String s ? s : "";
            int    sources = resp.get("sourcesUsed") instanceof Number n ? n.intValue() : 0;
            return new ChatResponse(reply, sources);
        } catch (AiServiceException e) { throw e; }
        catch (Exception e) { throw new AiServiceException("Chat failed: " + e.getMessage(), e); }
    }

    public List<UploadResponse> listDocuments(String userId) {
        return documentRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(d -> new UploadResponse(d.getId(), d.getFileName(), d.getFileSize(),
                        d.getChunksStored() != null ? d.getChunksStored() : 0, d.getStatus().name()))
                .collect(Collectors.toList());
    }

    public void deleteDocument(String docId, String userId) {
        Document doc = documentRepository.findByIdAndUserId(docId, userId)
                .orElseThrow(() -> new DocumentNotFoundException(docId));
        aiWebClient.delete().uri("/api/ai/document/" + docId)
                .retrieve().toBodilessEntity()
                .doOnError(e -> log.warn("Chroma delete failed: {}", e.getMessage()))
                .subscribe();
        documentRepository.delete(doc);
    }

    private String extractText(MultipartFile file) throws Exception {
        BodyContentHandler handler  = new BodyContentHandler(-1);
        AutoDetectParser   parser   = new AutoDetectParser();
        Metadata           metadata = new Metadata();
        if (file.getOriginalFilename() != null)
            metadata.set(TikaCoreProperties.RESOURCE_NAME_KEY, file.getOriginalFilename());
        try (InputStream is = file.getInputStream()) {
            parser.parse(is, handler, metadata, new ParseContext());
        } catch (Exception e) { log.warn("Tika warning: {}", e.getMessage()); }
        String text = handler.toString().trim();
        if (text.isEmpty()) text = new String(file.getBytes(), StandardCharsets.UTF_8).trim();
        int MAX = 500_000;
        return text.length() > MAX ? text.substring(0, MAX) : text;
    }
}
