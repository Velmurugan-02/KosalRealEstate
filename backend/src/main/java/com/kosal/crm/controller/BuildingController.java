package com.kosal.crm.controller;

import com.kosal.crm.entity.Building;
import com.kosal.crm.service.BuildingService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class BuildingController {

    private final BuildingService buildingService;

    public BuildingController(
            BuildingService buildingService) {

        this.buildingService = buildingService;
    }

    @PostMapping("/projects/{projectId}/buildings")
    public ResponseEntity<Building> createBuilding(
            @PathVariable Long projectId,
            @RequestBody Building building) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        buildingService.createBuilding(
                                projectId,
                                building));
    }

    @GetMapping("/projects/{projectId}/buildings")
    public ResponseEntity<List<Building>> getBuildingsByProject(
            @PathVariable Long projectId) {

        return ResponseEntity.ok(
                buildingService.getBuildingsByProject(
                        projectId));
    }

    @GetMapping("/buildings/{id}")
    public ResponseEntity<Building> getBuildingById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                buildingService.getBuildingById(id));
    }

    @PutMapping("/buildings/{id}")
    public ResponseEntity<Building> updateBuilding(
            @PathVariable Long id,
            @RequestBody Building building) {

        return ResponseEntity.ok(
                buildingService.updateBuilding(
                        id,
                        building));
    }

    @DeleteMapping("/buildings/{id}")
    public ResponseEntity<Void> deleteBuilding(
            @PathVariable Long id) {

        buildingService.deleteBuilding(id);

        return ResponseEntity.noContent().build();
    }
}