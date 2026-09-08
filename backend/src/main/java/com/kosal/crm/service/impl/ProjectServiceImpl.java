package com.kosal.crm.service.impl;

import com.kosal.crm.entity.Project;
import com.kosal.crm.repository.ProjectRepository;
import com.kosal.crm.service.ProjectService;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectServiceImpl(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Override
    public Project createProject(Project project) {
        project.setActive(true);
        return projectRepository.save(project);
    }

    @Override
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @Override
    public Project getProjectById(Long id) {

        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Project not found with id: " + id));
    }

    @Override
    public Project updateProject(
            Long id,
            Project project) {

        Project existing = getProjectById(id);

        existing.setName(project.getName());
        existing.setLocation(project.getLocation());
        existing.setDescription(project.getDescription());
        existing.setActive(project.isActive());
        return projectRepository.save(existing);
    }

    @Override
    public void deleteProject(Long id) {

        if (!projectRepository.existsById(id)) {
            throw new RuntimeException(
                    "Project not found with id: " + id);
        }

        projectRepository.deleteById(id);
    }
}