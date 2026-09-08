package com.kosal.crm.service;

import com.kosal.crm.dto.LeadRequest;
import com.kosal.crm.dto.LeadResponse;
import com.kosal.crm.entity.LeadStage;

import java.util.List;

public interface LeadService {

    LeadResponse createLead(LeadRequest request);

    LeadResponse getLeadById(Long id);

    List<LeadResponse> getAllLeads();

    LeadResponse updateLead(Long id, LeadRequest request);

    void deleteLead(Long id);

    List<LeadResponse> searchLeads(String keyword);

    List<LeadResponse> getLeadsByStage(LeadStage stage);

    List<LeadResponse> getLeadsByEmployee(Long userId);
}