package com.kosal.crm.service.impl;

import com.kosal.crm.entity.Building;
import com.kosal.crm.entity.Unit;
import com.kosal.crm.entity.UnitStatus;
import com.kosal.crm.repository.BuildingRepository;
import com.kosal.crm.repository.UnitRepository;
import com.kosal.crm.service.UnitService;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UnitServiceImpl implements UnitService {

    private final UnitRepository unitRepository;
    private final BuildingRepository buildingRepository;

    public UnitServiceImpl(
            UnitRepository unitRepository,
            BuildingRepository buildingRepository) {

        this.unitRepository = unitRepository;
        this.buildingRepository = buildingRepository;
    }

    @Override
    public Unit createUnit(
            Long buildingId,
            Unit unit) {

        Building building = buildingRepository
                .findById(buildingId)
                .orElseThrow(() -> new RuntimeException(
                        "Building not found with id: "
                                + buildingId));

        unit.setBuilding(building);
        unit.setStatus(UnitStatus.AVAILABLE);

        return unitRepository.save(unit);
    }

    @Override
    public List<Unit> getUnitsByBuilding(
            Long buildingId) {

        if (!buildingRepository.existsById(buildingId)) {
            throw new RuntimeException(
                    "Building not found with id: "
                            + buildingId);
        }

        return unitRepository.findByBuildingId(
                buildingId);
    }

    @Override
    public List<Unit> getAvailableUnits(
            Long buildingId) {

        if (!buildingRepository.existsById(buildingId)) {
            throw new RuntimeException(
                    "Building not found with id: "
                            + buildingId);
        }

        return unitRepository
                .findByBuildingIdAndStatus(
                        buildingId,
                        UnitStatus.AVAILABLE);
    }

    @Override
    public Unit getUnitById(Long id) {

        return unitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Unit not found with id: " + id));
    }

    @Override
    public Unit updateUnit(
            Long id,
            Unit unit) {

        Unit existing = getUnitById(id);

        existing.setUnitNumber(
                unit.getUnitNumber());

        existing.setType(unit.getType());
        existing.setPrice(unit.getPrice());
        existing.setArea(unit.getArea());
        existing.setFloor(unit.getFloor());

        if (unit.getStatus() != null) {
            existing.setStatus(unit.getStatus());
        }

        return unitRepository.save(existing);
    }

    @Override
    public void deleteUnit(Long id) {

        if (!unitRepository.existsById(id)) {
            throw new RuntimeException(
                    "Unit not found with id: " + id);
        }

        unitRepository.deleteById(id);
    }
}