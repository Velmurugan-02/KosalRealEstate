package com.kosal.crm.service.impl;

import com.kosal.crm.dto.DashboardResponse;
import com.kosal.crm.entity.LeadStage;
import com.kosal.crm.entity.UnitStatus;
import com.kosal.crm.repository.BookingRepository;
import com.kosal.crm.repository.LeadRepository;
import com.kosal.crm.repository.ProjectRepository;
import com.kosal.crm.repository.UnitRepository;
import com.kosal.crm.service.DashboardService;
import org.springframework.stereotype.Service;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final LeadRepository leadRepository;
    private final ProjectRepository projectRepository;
    private final UnitRepository unitRepository;
    private final BookingRepository bookingRepository;

    public DashboardServiceImpl(
            LeadRepository leadRepository,
            ProjectRepository projectRepository,
            UnitRepository unitRepository,
            BookingRepository bookingRepository) {

        this.leadRepository = leadRepository;
        this.projectRepository = projectRepository;
        this.unitRepository = unitRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public DashboardResponse getDashboard() {

        DashboardResponse response = new DashboardResponse();

        // Lead statistics
        response.setTotalLeads(leadRepository.count());

        response.setNewLeads(
                leadRepository.findByStage(LeadStage.NEW).size());

        response.setContactedLeads(
                leadRepository.findByStage(LeadStage.CONTACTED).size());

        response.setSiteVisitLeads(
                leadRepository.findByStage(LeadStage.SITE_VISIT).size());

        response.setInterestedLeads(
                leadRepository.findByStage(LeadStage.INTERESTED).size());

        response.setNegotiationLeads(
                leadRepository.findByStage(LeadStage.NEGOTIATION).size());

        response.setBookedLeads(
                leadRepository.findByStage(LeadStage.BOOKED).size());

        response.setLostLeads(
                leadRepository.findByStage(LeadStage.LOST).size());

        // Project statistics
        response.setTotalProjects(
                projectRepository.count());

        // Unit statistics
        response.setTotalUnits(
                unitRepository.count());

        response.setAvailableUnits(
                unitRepository.findByStatus(UnitStatus.AVAILABLE).size());

        response.setBookedUnits(
                unitRepository.findByStatus(UnitStatus.BOOKED).size());

        // Booking statistics
        response.setTotalBookings(
                bookingRepository.count());

        return response;
    }
}