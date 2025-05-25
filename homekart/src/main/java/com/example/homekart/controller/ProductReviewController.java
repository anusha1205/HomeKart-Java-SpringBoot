package com.example.homekart.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.homekart.entity.Review;
import com.example.homekart.repository.ReviewRepository;
import com.example.homekart.service.ReviewService;

@RestController
@RequestMapping("/api/products") // public product endpoints
public class ProductReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private ReviewRepository reviewRepo;

    @PostMapping("/{id}/reviews")
    public ResponseEntity<Review> createReview(
            @PathVariable Long id,
            @RequestBody Review review) {

        Review saved = reviewService.addReview(id, review);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<Review>> listReviews(@PathVariable Long id) {
        return ResponseEntity.ok(reviewRepo.findByProductId(id));
    }

    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.noContent().build();
    }
}
