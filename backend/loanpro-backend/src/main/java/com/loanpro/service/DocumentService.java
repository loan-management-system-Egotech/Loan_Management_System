package com.loanpro.service;

import com.loanpro.dto.response.DocumentResponse;
import com.loanpro.entity.Document;
import com.loanpro.entity.LoanApplication;
import com.loanpro.repository.DocumentRepository;
import com.loanpro.repository.LoanApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final LoanApplicationRepository applicationRepository;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Transactional
    public DocumentResponse uploadDocument(String appId, String documentType, MultipartFile file) throws IOException {
        LoanApplication application = applicationRepository.findByApplicationId(appId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));

        Path uploadPath = Paths.get(uploadDir, appId);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        Document document = Document.builder()
                .application(application)
                .documentType(documentType)
                .fileName(file.getOriginalFilename())
                .filePath(filePath.toString())
                .contentType(file.getContentType())
                .fileSize(file.getSize())
                .verified(false)
                .uploadedAt(LocalDateTime.now())
                .build();

        document = documentRepository.save(document);
        return mapToResponse(document);
    }

    public List<DocumentResponse> getDocumentsByApplicationId(String appId) {
        LoanApplication application = applicationRepository.findByApplicationId(appId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));

        return documentRepository.findByApplication(application).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Resource loadDocumentAsResource(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));

        try {
            Path filePath = Paths.get(document.getFilePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new IllegalArgumentException("File not found");
            }
        } catch (MalformedURLException ex) {
            throw new IllegalArgumentException("File not found", ex);
        }
    }
    
    public Document getDocumentEntity(Long documentId) {
        return documentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));
    }

    private DocumentResponse mapToResponse(Document document) {
        return DocumentResponse.builder()
                .id(document.getId())
                .documentType(document.getDocumentType())
                .fileName(document.getFileName())
                .fileSize(document.getFileSize())
                .verified(document.getVerified())
                .uploadedAt(document.getUploadedAt())
                .build();
    }
}
