package com.kosal.crm.repository;

import com.kosal.crm.entity.Lead;
import com.kosal.crm.entity.LeadStage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeadRepository extends JpaRepository<Lead, Long> {

    List<Lead> findByStage(LeadStage stage);

    List<Lead> findByAssignedToId(Long userId);

    List<Lead> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String firstName,
            String lastName,
            String email);
}