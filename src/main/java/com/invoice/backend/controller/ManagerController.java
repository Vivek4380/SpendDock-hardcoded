package com.invoice.backend.controller;

import com.invoice.backend.dto.InviteRequest;
import com.invoice.backend.service.InviteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/manager")
@CrossOrigin(origins = "http://localhost:5173")
public class ManagerController {

    private final InviteService inviteService;

    public ManagerController(InviteService inviteService) {
        this.inviteService = inviteService;
    }

    @PostMapping("/invite")
    public ResponseEntity<Map<String, String>> inviteAccountant(
            @RequestBody InviteRequest request) {

        inviteService.inviteAccountant(request);
        return ResponseEntity.ok(Map.of("message", "Invitation sent"));
    }
}