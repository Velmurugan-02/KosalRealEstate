package com.kosal.crm.repository;

import com.kosal.crm.entity.Building;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BuildingRepository extends JpaRepository<Building, Long> {

    List<Building> findByProjectId(Long projectId);
}