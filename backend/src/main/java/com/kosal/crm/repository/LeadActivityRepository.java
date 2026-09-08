package com.kosal.crm.repository;

import com.kosal.crm.entity.LeadActivity;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeadActivityRepository
        extends JpaRepository<LeadActivity, Long> {

    List<LeadActivity> findByLeadIdOrderByActivityDateDesc(Long leadId);
}