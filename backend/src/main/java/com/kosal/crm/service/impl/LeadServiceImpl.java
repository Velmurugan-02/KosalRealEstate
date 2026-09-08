package com.kosal.crm.service.impl;

import com.kosal.crm.dto.LeadRequest;
import com.kosal.crm.dto.LeadResponse;
import com.kosal.crm.entity.Lead;
import com.kosal.crm.entity.LeadStage;
import com.kosal.crm.entity.User;
import com.kosal.crm.repository.LeadRepository;
import com.kosal.crm.repository.UserRepository;
import com.kosal.crm.service.LeadService;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeadServiceImpl implements LeadService {

    private final LeadRepository leadRepository;
    private final UserRepository userRepository;

    public LeadServiceImpl(
            LeadRepository leadRepository,
            UserRepository userRepository) {

        this.leadRepository = leadRepository;
        this.userRepository = userRepository;
    }

    @Override
    public LeadResponse createLead(LeadRequest request) {

        Lead lead = new Lead();

        mapRequestToEntity(request, lead);

        Lead savedLead = leadRepository.save(lead);

        return mapToResponse(savedLead);
    }

    @Override
    public LeadResponse getLeadById(Long id) {

        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found with id: " + id));

        return mapToResponse(lead);
    }

    @Override
    public List<LeadResponse> getAllLeads() {

        return leadRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public LeadResponse updateLead(
            Long id,
            LeadRequest request) {

        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found with id: " + id));

        mapRequestToEntity(request, lead);

        Lead updatedLead = leadRepository.save(lead);

        return mapToResponse(updatedLead);
    }

    @Override
    public void deleteLead(Long id) {

        if (!leadRepository.existsById(id)) {
            throw new RuntimeException(
                    "Lead not found with id: " + id);
        }

        leadRepository.deleteById(id);
    }

    @Override
    public List<LeadResponse> searchLeads(String keyword) {

        return leadRepository
                .findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                        keyword,
                        keyword,
                        keyword)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<LeadResponse> getLeadsByStage(
            LeadStage stage) {

        return leadRepository.findByStage(stage)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<LeadResponse> getLeadsByEmployee(
            Long userId) {

        return leadRepository.findByAssignedToId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private void mapRequestToEntity(
            LeadRequest request,
            Lead lead) {

        lead.setFirstName(request.getFirstName());
        lead.setLastName(request.getLastName());
        lead.setPhone(request.getPhone());
        lead.setEmail(request.getEmail());
        lead.setSource(request.getSource());

        if (request.getStage() != null) {
            lead.setStage(request.getStage());
        }

        lead.setFollowUpDate(
                request.getFollowUpDate());

        if (request.getAssignedToId() != null) {

            User user = userRepository.findById(
                    request.getAssignedToId()).orElseThrow(
                            () -> new RuntimeException(
                                    "Assigned user not found"));

            lead.setAssignedTo(user);
        } else {
            lead.setAssignedTo(null);
        }
    }

    private LeadResponse mapToResponse(Lead lead) {

        LeadResponse response = new LeadResponse();

        response.setId(lead.getId());
        response.setFirstName(lead.getFirstName());
        response.setLastName(lead.getLastName());
        response.setPhone(lead.getPhone());
        response.setEmail(lead.getEmail());
        response.setSource(lead.getSource());
        response.setStage(lead.getStage());
        response.setFollowUpDate(
                lead.getFollowUpDate());

        if (lead.getAssignedTo() != null) {

            response.setAssignedToId(
                    lead.getAssignedTo().getId());

            response.setAssignedToName(
                    lead.getAssignedTo().getFirstName()
                            + " "
                            + lead.getAssignedTo().getLastName());
        }

        response.setCreatedAt(lead.getCreatedAt());
        response.setUpdatedAt(lead.getUpdatedAt());

        return response;
    }
}