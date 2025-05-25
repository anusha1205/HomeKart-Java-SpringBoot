package com.example.homekart.service;

import com.example.homekart.entity.Review;
import java.util.List;

public interface ReviewService {
    Review addReview(Long productId, Review review);
    void deleteReview(Long reviewId);
    List<Review> getReviewsForProduct(Long productId);
}
