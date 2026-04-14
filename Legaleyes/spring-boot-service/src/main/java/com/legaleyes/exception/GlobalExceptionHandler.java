package com.legaleyes.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.time.Instant;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DocumentNotFoundException.class)
    public ResponseEntity<Map<String,Object>> notFound(DocumentNotFoundException ex, HttpServletRequest req) {
        return error(HttpStatus.NOT_FOUND, ex.getMessage(), req.getRequestURI());
    }

    @ExceptionHandler(AiServiceException.class)
    public ResponseEntity<Map<String,Object>> ai(AiServiceException ex, HttpServletRequest req) {
        log.error("AI error: {}", ex.getMessage());
        return error(HttpStatus.BAD_GATEWAY, ex.getMessage(), req.getRequestURI());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String,Object>> illegal(IllegalArgumentException ex, HttpServletRequest req) {
        return error(HttpStatus.BAD_REQUEST, ex.getMessage(), req.getRequestURI());
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String,Object>> size(MaxUploadSizeExceededException ex, HttpServletRequest req) {
        return error(HttpStatus.PAYLOAD_TOO_LARGE, "File exceeds 20 MB limit", req.getRequestURI());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String,Object>> generic(Exception ex, HttpServletRequest req) {
        log.error("Unhandled: {}", ex.getMessage(), ex);
        return error(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred", req.getRequestURI());
    }

    private ResponseEntity<Map<String,Object>> error(HttpStatus status, String message, String path) {
        return ResponseEntity.status(status).body(Map.of(
            "status", status.value(), "error", message,
            "path", path, "timestamp", Instant.now().toString()));
    }
}
