package com.kosal.crm.repository;

import com.kosal.crm.entity.Unit;
import com.kosal.crm.entity.UnitStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UnitRepository extends JpaRepository<Unit, Long> {

    List<Unit> findByBuildingId(Long buildingId);

    List<Unit> findByStatus(UnitStatus status);

    List<Unit> findByBuildingIdAndStatus(
            Long buildingId,
            UnitStatus status);
}