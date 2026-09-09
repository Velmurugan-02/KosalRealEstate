package com.kosal.crm.controller;

import com.kosal.crm.dto.ActivityRequest;
import com.kosal.crm.entity.LeadActivity;
import com.kosal.crm.service.LeadActivityService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leads")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://kosal-real-estate.vercel.app"
})
public class LeadActivityController {

    private final LeadActivityService activityService;

    public LeadActivityController(
            LeadActivityService activityService) {

        this.activityService = activityService;
    }

    @PostMapping("/{leadId}/activities")
    public ResponseEntity<LeadActivity> addActivity(
            @PathVariable Long leadId,
            @RequestBody ActivityRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        activityService.addActivity(
                                leadId,
                                request));
    }

    @GetMapping("/{leadId}/activities")
    public ResponseEntity<List<LeadActivity>> getActivities(@PathVariable Long leadId) {

        return ResponseEntity.ok(
                activityService.getLeadActivities(leadId));
    }
}