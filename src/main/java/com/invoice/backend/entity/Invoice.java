package com.invoice.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "invoices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "uploader_company_id")
    private UUID uploaderCompanyId;

    @Column(name = "receiver_company_id")
    private UUID receiverCompanyId;

    @Column(name = "invoice_number")
    private String invoiceNumber;

    @Column(name = "vendor_name")
    private String vendorName;

    @Column(name = "invoice_date")
    private LocalDate invoiceDate;

    @Column(name = "grand_total", precision = 19, scale = 4)
    private BigDecimal grandTotal;

    @Builder.Default
    @Column(name = "review_status", nullable = false)
    private String reviewStatus = "PENDING";

    @Column(name = "review_comment", columnDefinition = "TEXT")
    private String reviewComment;

    @Builder.Default
    @Column(name = "payment_status", nullable = false)
    private String paymentStatus = "PENDING";

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void prePersist() {
        this.createdAt = Instant.now();
        if (this.reviewStatus == null) {
            this.reviewStatus = "PENDING";
        }
        if (this.paymentStatus == null) {
            this.paymentStatus = "PENDING";
        }
    }
}