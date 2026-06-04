package com.loanpro.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Document entity — stores metadata for uploaded files (NIC, salary slips, bank statements, etc.)
 * linked to a loan application. The actual file is stored on the filesystem.
 */
@Entity
@Table(name = "documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private LoanApplication application;

    /**
     * Document type identifier, e.g. "NIC_PASSPORT", "PROOF_OF_INCOME", "BANK_STATEMENT", "TAX_RETURN".
     */
    @Column(name = "document_type", nullable = false)
    private String documentType;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    /**
     * Relative path on the filesystem under the uploads directory.
     * e.g. "uploads/APP-0001/nic_passport.pdf"
     */
    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Column(name = "content_type")
    private String contentType;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "verified")
    @Builder.Default
    private Boolean verified = false;

    @Column(name = "uploaded_at", updatable = false)
    private LocalDateTime uploadedAt;

    @PrePersist
    protected void onCreate() {
        uploadedAt = LocalDateTime.now();
    }
}
