package com.invoice.backend.service;

import com.invoice.backend.dto.InviteRequest;
import com.invoice.backend.entity.UserProfile;
import com.invoice.backend.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.UUID;

@Service
public class InviteService {

    private final UserProfileRepository userProfileRepository;
    private final RestTemplate restTemplate;

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service.key}")
    private String supabaseServiceKey;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    // ─────────────────────────────────────────────
    // Toggle this in application.properties:
    //   app.invite.use-real-email=true   → sends real invite email via /auth/v1/invite
    //   app.invite.use-real-email=false  → creates user instantly via /auth/v1/admin/users (no email, no rate limit)
    // ─────────────────────────────────────────────
    @Value("${app.invite.use-real-email:true}")
    private boolean useRealEmail;

    public InviteService(UserProfileRepository userProfileRepository,
                         RestTemplate restTemplate) {
        this.userProfileRepository = userProfileRepository;
        this.restTemplate = restTemplate;
    }

    public void inviteAccountant(InviteRequest request) {

        UUID authUserId;

        if (useRealEmail) {
            authUserId = inviteViaEmail(request.getEmail());
        } else {
            authUserId = inviteViaAdminCreate(request.getEmail());
        }

        // Avoid duplicate profiles if same email is invited twice
        boolean exists = userProfileRepository.existsByAuthUserId(authUserId);
        if (!exists) {
            UserProfile profile = new UserProfile();
            profile.setAuthUserId(authUserId);
            profile.setCompanyId(request.getCompanyId());
            profile.setRole("accountant");
            profile.setProfileComplete(false);
            userProfileRepository.save(profile);
        }
    }

    // ─────────────────────────────────────────────
    // REAL EMAIL MODE
    // Uses: POST /auth/v1/invite
    // Supabase sends an invite email to the accountant.
    // The link in the email redirects to /set-password where they set their password.
    // ⚠️ Risk: Free Supabase plan has rate limiting (typically 3 emails/hour).
    //          If you hit 429, switch useRealEmail=false for the demo.
    // ─────────────────────────────────────────────
    private UUID inviteViaEmail(String email) {
        String redirectTo = frontendUrl + "/set-password";
        String url = supabaseUrl + "/auth/v1/invite?redirect_to=" + redirectTo;

        HttpHeaders headers = buildHeaders();

        Map<String, Object> body = Map.of(
                "email", email,
                "redirect_to", redirectTo
        );

        return callSupabaseAndExtractId(url, headers, body);
    }

    // ─────────────────────────────────────────────
    // DEMO / FAKE MODE
    // Uses: POST /auth/v1/admin/users
    // Creates user instantly with a temp password — no email sent, no rate limiting.
    // Accountant logs in with: email + "Temp12345!" then changes password manually.
    // ✅ Safe to use for project demo or when rate limited.
    // ─────────────────────────────────────────────
    private UUID inviteViaAdminCreate(String email) {
        String url = supabaseUrl + "/auth/v1/admin/users";

        HttpHeaders headers = buildHeaders();

        Map<String, Object> body = Map.of(
                "email", email,
                "password", "Temp12345!",
                "email_confirm", true
        );

        return callSupabaseAndExtractId(url, headers, body);
    }

    // ─────────────────────────────────────────────
    // Shared helper: builds Supabase auth headers
    // ─────────────────────────────────────────────
    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("apikey", supabaseServiceKey);
        headers.set("Authorization", "Bearer " + supabaseServiceKey);
        return headers;
    }

    // ─────────────────────────────────────────────
    // Shared helper: fires the POST request and extracts the user UUID
    // ─────────────────────────────────────────────
    private UUID callSupabaseAndExtractId(String url, HttpHeaders headers, Map<String, Object> body) {
        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                httpEntity,
                Map.class
        );

        Map<?, ?> responseBody = response.getBody();
        System.out.println("Supabase response: " + responseBody);

        if (responseBody == null) {
            throw new RuntimeException("Supabase returned empty response");
        }

        Object idObj = responseBody.get("id");
        if (idObj == null) {
            throw new RuntimeException("Supabase did not return user id");
        }

        return UUID.fromString(idObj.toString());
    }
}