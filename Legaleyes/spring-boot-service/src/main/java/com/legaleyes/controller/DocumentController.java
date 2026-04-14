package com.legaleyes.controller;

import com.legaleyes.service.DocumentService;
import com.legaleyes.service.DocumentService.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @GetMapping("/health")
    public ResponseEntity<Map<String,String>> health() {
        return ResponseEntity.ok(Map.of("status","ok","service","LegalEyes"));
    }

    @PostMapping(value="/documents/upload", consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UploadResponse> upload(
            @RequestParam("file") MultipartFile file,
            Authentication auth) {
        String userId = auth.getName();
        log.info("Upload: user={} file={}", userId, file.getOriginalFilename());
        return ResponseEntity.ok(documentService.uploadDocument(file, userId));
    }

    @GetMapping("/documents")
    public ResponseEntity<List<UploadResponse>> list(Authentication auth) {
        return ResponseEntity.ok(documentService.listDocuments(auth.getName()));
    }

    @DeleteMapping("/documents/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id, Authentication auth) {
        documentService.deleteDocument(id, auth.getName());
        return ResponseEntity.noContent().build();
    }

    public record MsgDTO(@NotBlank String role, @NotBlank String content) {}
    public record ChatReqDTO(@NotEmpty List<MsgDTO> messages, String documentId, String action) {}

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(
            @Valid @RequestBody ChatReqDTO req,
            Authentication auth) {
        String userId = auth.getName();
        log.info("Chat: user={} docId={}", userId, req.documentId());
        var result = documentService.chat(
            new ChatRequest(
                req.messages().stream().map(m -> new ChatMessageDTO(m.role(), m.content())).toList(),
                req.documentId(), req.action()),
            userId);
        return ResponseEntity.ok(result);
    }
}
