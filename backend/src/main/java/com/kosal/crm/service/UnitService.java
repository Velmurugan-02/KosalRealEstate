package com.kosal.crm.service;

import com.kosal.crm.entity.Unit;

import java.util.List;

public interface UnitService {

    Unit createUnit(Long buildingId, Unit unit);

    List<Unit> getUnitsByBuilding(Long buildingId);

    List<Unit> getAvailableUnits(Long buildingId);

    Unit getUnitById(Long id);

    Unit updateUnit(Long id, Unit unit);

    void deleteUnit(Long id);
}