package com.kosal.crm.service;

import com.kosal.crm.entity.Building;

import java.util.List;

public interface BuildingService {

    Building createBuilding(Long projectId, Building building);

    List<Building> getBuildingsByProject(Long projectId);

    Building getBuildingById(Long id);

    Building updateBuilding(Long id, Building building);

    void deleteBuilding(Long id);
}