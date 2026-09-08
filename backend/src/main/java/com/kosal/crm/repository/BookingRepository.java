package com.kosal.crm.repository;

import com.kosal.crm.entity.Booking;
import com.kosal.crm.entity.BookingStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByUnitId(Long unitId);

    List<Booking> findByStatus(BookingStatus status);

    List<Booking> findByLeadId(Long leadId);

    List<Booking> findByBookedById(Long userId);
}