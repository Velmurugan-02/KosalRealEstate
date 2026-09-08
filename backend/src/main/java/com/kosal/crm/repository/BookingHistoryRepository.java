package com.kosal.crm.repository;

import com.kosal.crm.entity.BookingHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingHistoryRepository
        extends JpaRepository<BookingHistory, Long> {

    List<BookingHistory> findByBookingIdOrderByCreatedAtDesc(Long bookingId);
}