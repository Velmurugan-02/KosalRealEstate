package com.kosal.crm.service.impl;

import com.kosal.crm.dto.ActivityRequest;
import com.kosal.crm.entity.Lead;
import com.kosal.crm.entity.LeadActivity;
import com.kosal.crm.entity.User;
import com.kosal.crm.repository.LeadActivityRepository;
import com.kosal.crm.repository.LeadRepository;
import com.kosal.crm.repository.UserRepository;
import com.kosal.crm.service.LeadActivityService;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeadActivityServiceImpl
        implements LeadActivityService {

    private final LeadActivityRepository activityRepository;
    private final LeadRepository leadRepository;
    private final UserRepository userRepository;

    public LeadActivityServiceImpl(
            LeadActivityRepository activityRepository,
            LeadRepository leadRepository,
            UserRepository userRepository) {

        this.activityRepository = activityRepository;
        this.leadRepository = leadRepository;
        this.userRepository = userRepository;
    }

    @Override
    public LeadActivity addActivity(
            Long leadId,
            ActivityRequest request) {

        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new RuntimeException(
                        "Lead not found with id: " + leadId));

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElse(null);

        LeadActivity activity = new LeadActivity();

        activity.setLead(lead);
        activity.setCreatedBy(user);
        activity.setType(request.getType());
        activity.setDescription(
                request.getDescription());
        activity.setActivityDate(
                request.getActivityDate());

        return activityRepository.save(activity);
    }

    @Override
    public List<LeadActivity> getLeadActivities(
            Long leadId) {

        if (!leadRepository.existsById(leadId)) {
            throw new RuntimeException(
                    "Lead not found with id: " + leadId);
        }

        return activityRepository
                .findByLeadIdOrderByActivityDateDesc(leadId);
    }
}