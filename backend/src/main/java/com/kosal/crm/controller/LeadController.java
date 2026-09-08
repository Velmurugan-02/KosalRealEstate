package com.kosal.crm.controller;

import com.kosal.crm.dto.LeadRequest;
import com.kosal.crm.dto.LeadResponse;
import com.kosal.crm.entity.LeadStage;
import com.kosal.crm.service.LeadService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leads")
@CrossOrigin(origins = "http://localhost:5173")
public class LeadController {

    private final LeadService leadService;

    public LeadController(LeadService leadService) {
        this.leadService = leadService;
    }

    @PostMapping
    public ResponseEntity<LeadResponse> createLead(
            @RequestBody LeadRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(leadService.createLead(request));
    }

    @GetMapping
    public ResponseEntity<List<LeadResponse>> getAllLeads() {

        return ResponseEntity.ok(
                leadService.getAllLeads());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeadResponse> getLeadById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                leadService.getLeadById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeadResponse> updateLead(
            @PathVariable Long id,
            @RequestBody LeadRequest request) {

        return ResponseEntity.ok(
                leadService.updateLead(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLead(
            @PathVariable Long id) {

        leadService.deleteLead(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<LeadResponse>> searchLeads(
            @RequestParam String keyword) {

        return ResponseEntity.ok(
                leadService.searchLeads(keyword));
    }

    @GetMapping("/stage/{stage}")
    public ResponseEntity<List<LeadResponse>> getByStage(
            @PathVariable LeadStage stage) {

        return ResponseEntity.ok(
                leadService.getLeadsByStage(stage));
    }

    @GetMapping("/employee/{userId}")
    public ResponseEntity<List<LeadResponse>> getByEmployee(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                leadService.getLeadsByEmployee(userId));
    }
}