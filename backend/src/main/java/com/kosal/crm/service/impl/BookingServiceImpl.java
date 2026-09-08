package com.kosal.crm.service.impl;

import com.kosal.crm.dto.BookingRequest;
import com.kosal.crm.dto.BookingResponse;
import com.kosal.crm.entity.Booking;
import com.kosal.crm.entity.BookingHistory;
import com.kosal.crm.entity.BookingStatus;
import com.kosal.crm.entity.Lead;
import com.kosal.crm.entity.LeadStage;
import com.kosal.crm.entity.Unit;
import com.kosal.crm.entity.UnitStatus;
import com.kosal.crm.entity.User;
import com.kosal.crm.exception.ConflictException;
import com.kosal.crm.repository.BookingHistoryRepository;
import com.kosal.crm.repository.BookingRepository;
import com.kosal.crm.repository.LeadRepository;
import com.kosal.crm.repository.UnitRepository;
import com.kosal.crm.repository.UserRepository;
import com.kosal.crm.service.BookingService;

import jakarta.transaction.Transactional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final BookingHistoryRepository bookingHistoryRepository;
    private final LeadRepository leadRepository;
    private final UnitRepository unitRepository;
    private final UserRepository userRepository;

    public BookingServiceImpl(
            BookingRepository bookingRepository,
            BookingHistoryRepository bookingHistoryRepository,
            LeadRepository leadRepository,
            UnitRepository unitRepository,
            UserRepository userRepository) {

        this.bookingRepository = bookingRepository;
        this.bookingHistoryRepository = bookingHistoryRepository;
        this.leadRepository = leadRepository;
        this.unitRepository = unitRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public BookingResponse createBooking(BookingRequest request) {

        // 1. Find lead
        Lead lead = leadRepository.findById(request.getLeadId())
                .orElseThrow(() -> new RuntimeException(
                        "Lead not found with id: "
                                + request.getLeadId()));

        // 2. Lock the unit row
        Unit unit = unitRepository.findUnitForUpdate(request.getUnitId())
                .orElseThrow(() -> new RuntimeException(
                        "Unit not found with id: "
                                + request.getUnitId()));

        // 3. Check unit availability
        if (unit.getStatus() != UnitStatus.AVAILABLE) {

            throw new ConflictException(
                    "Unit " + unit.getUnitNumber()
                            + " is already "
                            + unit.getStatus().name().toLowerCase());
        }

        // 4. Get logged-in user
        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String email = authentication.getName();

        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException(
                        "Logged-in user not found"));

        // 5. Create booking
        Booking booking = new Booking();

        booking.setLead(lead);
        booking.setUnit(unit);
        booking.setBookedBy(currentUser);
        booking.setBookingAmount(request.getBookingAmount());
        booking.setStatus(BookingStatus.CONFIRMED);

        Booking savedBooking = bookingRepository.save(booking);

        // 6. Mark unit as BOOKED
        unit.setStatus(UnitStatus.BOOKED);

        unitRepository.save(unit);

        // 7. Update lead stage
        lead.setStage(LeadStage.BOOKED);

        leadRepository.save(lead);

        // 8. Create booking history
        BookingHistory history = new BookingHistory();

        history.setBooking(savedBooking);
        history.setChangedBy(currentUser);
        history.setAction("BOOKED");
        history.setDescription(
                "Unit " + unit.getUnitNumber()
                        + " booked for lead "
                        + lead.getFirstName()
                        + " " + lead.getLastName());

        bookingHistoryRepository.save(history);

        return mapToResponse(savedBooking);
    }

    @Override
    public List<BookingResponse> getAllBookings() {

        return bookingRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BookingResponse getBookingById(Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Booking not found with id: " + id));

        return mapToResponse(booking);
    }

    @Override
    public List<BookingResponse> getBookingsByLead(Long leadId) {

        return bookingRepository.findByLeadId(leadId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponse> getMyBookings() {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String email = authentication.getName();

        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException(
                        "Logged-in user not found"));

        return bookingRepository
                .findByBookedById(currentUser.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private BookingResponse mapToResponse(Booking booking) {

        BookingResponse response = new BookingResponse();

        response.setId(booking.getId());

        Lead lead = booking.getLead();

        response.setLeadId(lead.getId());

        response.setLeadName(
                lead.getFirstName()
                        + " "
                        + lead.getLastName());

        Unit unit = booking.getUnit();

        response.setUnitId(unit.getId());
        response.setUnitNumber(unit.getUnitNumber());

        response.setBuildingName(
                unit.getBuilding().getName());

        response.setProjectName(
                unit.getBuilding()
                        .getProject()
                        .getName());

        User bookedBy = booking.getBookedBy();

        response.setBookedById(bookedBy.getId());

        response.setBookedByName(
                bookedBy.getFirstName()
                        + " "
                        + bookedBy.getLastName());

        response.setBookingAmount(
                booking.getBookingAmount());

        response.setStatus(
                booking.getStatus());

        response.setBookingDate(
                booking.getBookingDate());

        return response;
    }
}