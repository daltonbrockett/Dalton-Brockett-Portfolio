package com.dalton.analytics.repository;

import com.dalton.analytics.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

/**
 * JPA repository for Session entities.
 *
 * Provides standard CRUD operations (save, findById, findAll, delete, count)
 * via Spring Data JPA with no implementation code required.
 *
 * Complex analytics queries live in {@link DashboardRepository}.
 */
@Repository
public interface SessionRepository extends JpaRepository<Session, UUID> {
}
