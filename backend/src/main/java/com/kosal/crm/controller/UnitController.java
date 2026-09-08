package com.kosal.crm.controller;

import com.kosal.crm.entity.Unit;
import com.kosal.crm.service.UnitService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class UnitController {

    private final UnitService unitService;

    public UnitController(UnitService unitService) {
        this.unitService = unitService;
    }

    @PostMapping("/buildings/{buildingId}/units")
    public ResponseEntity<Unit> createUnit(
            @PathVariable Long buildingId,
            @RequestBody Unit unit) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        unitService.createUnit(
                                buildingId,
                                unit));
    }

    @GetMapping("/buildings/{buildingId}/units")
    public ResponseEntity<List<Unit>> getUnitsByBuilding(
            @PathVariable Long buildingId) {

        return ResponseEntity.ok(
                unitService.getUnitsByBuilding(buildingId));
    }

    @GetMapping("/buildings/{buildingId}/units/available")
    public ResponseEntity<List<Unit>> getAvailableUnits(
            @PathVariable Long buildingId) {

        return ResponseEntity.ok(
                unitService.getUnitsByBuilding(buildingId));
    }

    @GetMapping("/units/{id}")
    public ResponseEntity<Unit> getUnitById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                unitService.getUnitById(id));
    }

    @PutMapping("/units/{id}")
    public ResponseEntity<Unit> updateUnit(
            @PathVariable Long id,
            @RequestBody Unit unit) {

        return ResponseEntity.ok(
                unitService.updateUnit(id, unit));
    }

    @DeleteMapping("/units/{id}")
    public ResponseEntity<Void> deleteUnit(
            @PathVariable Long id) {

        unitService.deleteUnit(id);

        return ResponseEntity.noContent().build();
    }
}