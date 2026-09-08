package com.kosal.crm.dto;

import com.kosal.crm.entity.ActivityType;

import java.time.LocalDateTime;

public class ActivityRequest {

    private ActivityType type;
    private String description;
    private LocalDateTime activityDate;

    public ActivityRequest() {
    }

    public ActivityType getType() {
        return type;
    }

    public void setType(ActivityType type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getActivityDate() {
        return activityDate;
    }

    public void setActivityDate(LocalDateTime activityDate) {
        this.activityDate = activityDate;
    }
}