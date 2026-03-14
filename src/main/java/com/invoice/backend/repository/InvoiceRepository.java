package com.invoice.backend.repository;

import com.invoice.backend.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {
    @Query(value = """
    SELECT
        COUNT(*) AS totalInvoices,
        SUM(CASE WHEN review_status = 'PENDING' THEN 1 ELSE 0 END) AS pendingInvoices,
        SUM(CASE WHEN review_status = 'ACCEPTED' THEN 1 ELSE 0 END) AS acceptedInvoices,
        SUM(CASE WHEN payment_status = 'PAID' THEN 1 ELSE 0 END) AS paidInvoices,
        COALESCE(SUM(CASE WHEN review_status != 'REJECTED' THEN grand_total ELSE 0 END),0) AS totalValue
    FROM invoices
    WHERE uploader_company_id = :companyId
    """, nativeQuery = true)
    List<Object[]> getVendorStats(@Param("companyId") UUID companyId);

    List<Invoice> findByUploaderCompanyId(UUID uploaderCompanyId);

    List<Invoice> findByReceiverCompanyId(UUID receiverCompanyId);
}