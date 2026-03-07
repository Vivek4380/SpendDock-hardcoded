package com.invoice.backend.service;

import com.invoice.backend.entity.Invoice;
import com.invoice.backend.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    // Hardcoded for review demo
    private static final UUID UPLOADER_COMPANY_ID =
            UUID.fromString("a919b2cb-5110-45aa-931b-6b896e9f7f5a"); // Vendor
    private static final UUID RECEIVER_COMPANY_ID =
            UUID.fromString("19556fc8-855c-46a2-9764-8ebb7721d8c5"); // Company A

    public Invoice uploadAndExtract(MultipartFile file) {

        // 🔥 Simulated AI extraction (for review demo)
        String extractedInvoiceNumber = "INV-" + System.currentTimeMillis();
        String extractedVendorName = "Tech Solutions Inc";
        LocalDate extractedDate = LocalDate.now();
        BigDecimal extractedAmount = new BigDecimal("12500.00");

        Invoice invoice = Invoice.builder()
                .uploaderCompanyId(UPLOADER_COMPANY_ID)
                .receiverCompanyId(RECEIVER_COMPANY_ID)
                .invoiceNumber(extractedInvoiceNumber)
                .vendorName(extractedVendorName)
                .invoiceDate(extractedDate)
                .grandTotal(extractedAmount)
                .build();

        return invoiceRepository.save(invoice);
    }
}