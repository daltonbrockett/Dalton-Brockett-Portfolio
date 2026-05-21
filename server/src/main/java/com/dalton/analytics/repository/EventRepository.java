package com.dalton.analytics.repository;

import com.dalton.analytics.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * JPA repository for Event entities.
 *
 * Provides standard CRUD operations via Spring Data JPA.
 * Complex analytics queries live in {@link DashboardRepository}.
 */
@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {
}
