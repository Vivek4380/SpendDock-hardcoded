package com.invoice.backend.dto;

import java.math.BigDecimal;

public class VendorStatsDTO {

    private long totalInvoices;
    private long pendingInvoices;
    private long acceptedInvoices;
    private long paidInvoices;
    private BigDecimal totalValue;

    public VendorStatsDTO(long totalInvoices,
                          long pendingInvoices,
                          long acceptedInvoices,
                          long paidInvoices,
                          BigDecimal totalValue) {
        this.totalInvoices = totalInvoices;
        this.pendingInvoices = pendingInvoices;
        this.acceptedInvoices = acceptedInvoices;
        this.paidInvoices = paidInvoices;
        this.totalValue = totalValue;
    }

    public long getTotalInvoices() {
        return totalInvoices;
    }

    public long getPendingInvoices() {
        return pendingInvoices;
    }

    public long getAcceptedInvoices() {
        return acceptedInvoices;
    }

    public long getPaidInvoices() {
        return paidInvoices;
    }

    public BigDecimal getTotalValue() {
        return totalValue;
    }
}