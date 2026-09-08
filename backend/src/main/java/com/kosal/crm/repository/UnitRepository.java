package com.kosal.crm.repository;

import com.kosal.crm.entity.Unit;
import com.kosal.crm.entity.UnitStatus;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UnitRepository extends JpaRepository<Unit, Long> {

    List<Unit> findByBuildingId(Long buildingId);

    List<Unit> findByStatus(UnitStatus status);

    List<Unit> findByBuildingIdAndStatus(
            Long buildingId,
            UnitStatus status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT u FROM Unit u WHERE u.id = :id")
    Optional<Unit> findUnitForUpdate(@Param("id") Long id);
}