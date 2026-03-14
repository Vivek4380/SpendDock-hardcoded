package com.invoice.backend.controller;

import com.invoice.backend.dto.VendorStatsDTO;
import com.invoice.backend.entity.Invoice;
import com.invoice.backend.repository.InvoiceRepository;
import com.invoice.backend.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/vendor")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class VendorController {

    private final InvoiceRepository invoiceRepository;
    private final InvoiceService invoiceService;

    // 🔎 Get invoices uploaded by vendor (Company B)
    @GetMapping("/invoices")
    public ResponseEntity<List<Invoice>> getInvoicesByUploader(
            @RequestParam UUID companyId
    ) {
        List<Invoice> invoices = invoiceRepository.findByUploaderCompanyId(companyId);
        return ResponseEntity.ok(invoices);
    }

    // 📤 Upload invoice (Simulated AI extraction for review demo)
    @PostMapping("/upload")
    public ResponseEntity<Invoice> uploadInvoice(
            @RequestParam("file") MultipartFile file
    ) {

        Invoice savedInvoice = invoiceService.uploadAndExtract(file);

        return ResponseEntity.ok(savedInvoice);
    }
    @GetMapping("/stats")
    public VendorStatsDTO getVendorStats(@RequestParam UUID companyId) {
        return invoiceService.getVendorStats(companyId);
    }
}