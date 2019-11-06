package com.example.CitizensAppeals.repository;

import com.example.CitizensAppeals.domain.Appeal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppealRepository extends JpaRepository<Appeal, Long> {
}
