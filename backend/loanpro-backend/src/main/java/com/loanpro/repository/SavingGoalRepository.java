package com.loanpro.repository;

import com.loanpro.entity.SavingGoal;
import com.loanpro.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SavingGoalRepository extends JpaRepository<SavingGoal, Long> {
    List<SavingGoal> findByUser(User user);
}
