package com.invoice.backend.controller;

import com.invoice.backend.dto.PaymentUpdateRequest;
import com.invoice.backend.dto.ReviewRequest;
import com.invoice.backend.entity.Invoice;
import com.invoice.backend.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/client")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ClientController {

    private static final UUID RECEIVER_COMPANY_ID =
            UUID.fromString("19556fc8-855c-46a2-9764-8ebb7721d8c5");

    private final InvoiceRepository invoiceRepository;

    @GetMapping("/invoices")
    public ResponseEntity<List<Invoice>> getInvoicesByReceiver() {
        List<Invoice> invoices = invoiceRepository.findByReceiverCompanyId(RECEIVER_COMPANY_ID);
        return ResponseEntity.ok(invoices);
    }

    @PatchMapping("/payment")
    public ResponseEntity<Invoice> updatePaymentStatus(@RequestBody PaymentUpdateRequest request) {
        Invoice invoice = invoiceRepository.findById(request.getInvoiceId())
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        invoice.setPaymentStatus(request.getPaymentStatus());

        Invoice saved = invoiceRepository.save(invoice);

        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/review")
    public ResponseEntity<Invoice> reviewInvoice(@RequestBody ReviewRequest request) {
        Invoice invoice = invoiceRepository.findById(request.getInvoiceId())
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        invoice.setReviewStatus(request.getStatus());
        invoice.setReviewComment(request.getComment());

        Invoice saved = invoiceRepository.save(invoice);

        return ResponseEntity.ok(saved);
    }
}