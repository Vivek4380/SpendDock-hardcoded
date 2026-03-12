package com.invoice.backend.dto;

import java.util.UUID;

public class InviteRequest {

    private String email;
    private UUID companyId;

    public InviteRequest() {}

    public InviteRequest(String email, UUID companyId) {
        this.email = email;
        this.companyId = companyId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public UUID getCompanyId() {
        return companyId;
    }

    public void setCompanyId(UUID companyId) {
        this.companyId = companyId;
    }
}