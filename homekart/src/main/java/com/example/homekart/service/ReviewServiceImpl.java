package com.example.homekart.service;

import com.example.homekart.entity.Product;
import com.example.homekart.entity.Review;
import com.example.homekart.repository.ProductRepository;
import com.example.homekart.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired private ReviewRepository reviewRepo;
    @Autowired private ProductRepository productRepo;

    @Override
    @Transactional
    public Review addReview(Long productId, Review review) {
        Product product = productRepo.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        review.setProduct(product);
        Review saved = reviewRepo.save(review);

        // update aggregates (if you have averageRating & reviewCount on Product)
        product.setReviewCount(product.getReviewCount() + 1);
        double total = product.getAverageRating() * (product.getReviewCount() - 1)
                       + review.getRating();
        product.setAverageRating(total / product.getReviewCount());
        productRepo.save(product);

        return saved;
    }

    @Override
    @Transactional
    public void deleteReview(Long reviewId) {
        Review rev = reviewRepo.findById(reviewId)
            .orElseThrow(() -> new RuntimeException("Review not found"));
        Product product = rev.getProduct();

        reviewRepo.delete(rev);

        int newCount = product.getReviewCount() - 1;
        product.setReviewCount(newCount);
        if (newCount > 0) {
            double total = product.getAverageRating() * (newCount + 1) - rev.getRating();
            product.setAverageRating(total / newCount);
        } else {
            product.setAverageRating(0.0);
        }
        productRepo.save(product);
    }

    @Override
    public List<Review> getReviewsForProduct(Long productId) {
        return reviewRepo.findByProductId(productId);
    }
}
