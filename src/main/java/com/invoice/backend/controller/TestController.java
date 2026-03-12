package com.invoice.backend.controller;

import com.invoice.backend.entity.Invoice;
import com.invoice.backend.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/test")
@RequiredArgsConstructor
public class TestController {

    private final InvoiceRepository invoiceRepository;

    @PostMapping("/create")
    public ResponseEntity<Invoice> createTestInvoice() {
        Invoice invoice = Invoice.builder()
                .uploaderCompanyId(
                        UUID.fromString("a919b2cb-5110-45aa-931b-6b896e9f7f5a")
                )
                .receiverCompanyId(UUID.fromString("19556fc8-855c-46a2-9764-8ebb7721d8c5"))
                .invoiceNumber("INV-001")
                .vendorName("Test Vendor")
                .invoiceDate(LocalDate.now())
                .grandTotal(new BigDecimal("1000.00"))
                .build();

        Invoice saved = invoiceRepository.save(invoice);

        return ResponseEntity.ok(saved);
    }
}