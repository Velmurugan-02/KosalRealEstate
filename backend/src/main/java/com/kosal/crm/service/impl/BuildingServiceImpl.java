package com.kosal.crm.service.impl;

import com.kosal.crm.entity.Building;
import com.kosal.crm.entity.Project;
import com.kosal.crm.repository.BuildingRepository;
import com.kosal.crm.repository.ProjectRepository;
import com.kosal.crm.service.BuildingService;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BuildingServiceImpl implements BuildingService {

    private final BuildingRepository buildingRepository;
    private final ProjectRepository projectRepository;

    public BuildingServiceImpl(
            BuildingRepository buildingRepository,
            ProjectRepository projectRepository) {

        this.buildingRepository = buildingRepository;
        this.projectRepository = projectRepository;
    }

    @Override
    public Building createBuilding(
            Long projectId,
            Building building) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException(
                        "Project not found with id: "
                                + projectId));

        building.setProject(project);

        return buildingRepository.save(building);
    }

    @Override
    public List<Building> getBuildingsByProject(
            Long projectId) {

        if (!projectRepository.existsById(projectId)) {
            throw new RuntimeException(
                    "Project not found with id: " + projectId);
        }

        return buildingRepository.findByProjectId(projectId);
    }

    @Override
    public Building getBuildingById(Long id) {

        return buildingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Building not found with id: " + id));
    }

    @Override
    public Building updateBuilding(
            Long id,
            Building building) {

        Building existing = getBuildingById(id);

        existing.setName(building.getName());
        existing.setDescription(
                building.getDescription());

        return buildingRepository.save(existing);
    }

    @Override
    public void deleteBuilding(Long id) {

        if (!buildingRepository.existsById(id)) {
            throw new RuntimeException(
                    "Building not found with id: " + id);
        }

        buildingRepository.deleteById(id);
    }
}