package com.kosal.crm.service;

import com.kosal.crm.dto.ActivityRequest;
import com.kosal.crm.entity.LeadActivity;

import java.util.List;

public interface LeadActivityService {

    LeadActivity addActivity(
            Long leadId,
            ActivityRequest request);

    List<LeadActivity> getLeadActivities(
            Long leadId);
}