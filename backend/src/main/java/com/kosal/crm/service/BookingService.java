package com.kosal.crm.service;

import com.kosal.crm.dto.BookingRequest;
import com.kosal.crm.dto.BookingResponse;

import java.util.List;

public interface BookingService {

    BookingResponse createBooking(BookingRequest request);

    List<BookingResponse> getAllBookings();

    BookingResponse getBookingById(Long id);

    List<BookingResponse> getBookingsByLead(Long leadId);

    List<BookingResponse> getMyBookings();
}