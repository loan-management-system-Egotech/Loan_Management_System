package com.loanpro.controller;

import com.loanpro.dto.response.DocumentResponse;
import com.loanpro.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping(value = "/applications/{appId}/documents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentResponse> uploadDocument(
            @PathVariable String appId,
            @RequestParam("documentType") String documentType,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        return ResponseEntity.ok(documentService.uploadDocument(appId, documentType, file));
    }

    @GetMapping("/applications/{appId}/documents")
    public ResponseEntity<List<DocumentResponse>> getApplicationDocuments(@PathVariable String appId) {
        return ResponseEntity.ok(documentService.getDocumentsByApplicationId(appId));
    }

    @GetMapping("/documents/{id}/download")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id) {
        Resource resource = documentService.loadDocumentAsResource(id);
        String contentType = documentService.getDocumentEntity(id).getContentType();
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
