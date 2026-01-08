package com.pdfprocessor.repository;

import com.pdfprocessor.model.Subscription;
import com.pdfprocessor.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    Optional<Subscription> findByUser(User user);
    Optional<Subscription> findByStripeCustomerId(String stripeCustomerId);
}