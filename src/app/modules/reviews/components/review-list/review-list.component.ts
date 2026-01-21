import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductReviewsService, Review, ProductRatingSummary } from '../../../../core/services/product-reviews.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review-list.component.html',
  styles: [`
    .progress-bar {
      transition: width 0.5s ease-in-out;
    }
  `]
})
export class ReviewListComponent implements OnInit, OnChanges {
  @Input() productId!: string;
  @Input() ratingSummary?: ProductRatingSummary;
  @Output() reviewUpdated = new EventEmitter<void>();
  
  reviews: Review[] = [];
  currentUser: any;
  
  newReviewRating = 5;
  newReviewComment = '';
  isSubmitting = false;
  
  ratingCounts: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  
  protected Math = Math;

  constructor(
    private reviewsService: ProductReviewsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.productId) {
      this.loadReviews();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['productId'] && !changes['productId'].firstChange) {
      this.loadReviews();
    }
  }

  loadReviews() {
    this.reviewsService.getReviews(this.productId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.calculateRatingCounts();
      },
      error: (err) => console.error(err)
    });
  }

  calculateRatingCounts() {
    this.ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    this.reviews.forEach(r => {
      const rating = Math.round(r.rating);
      if (this.ratingCounts[rating] !== undefined) {
        this.ratingCounts[rating]++;
      }
    });
  }

  getPercentage(stars: number): number {
    if (!this.reviews.length) return 0;
    return (this.ratingCounts[stars] / this.reviews.length) * 100;
  }

  getStarsArray(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i < rating ? 1 : 0);
  }

  setNewRating(rating: number) {
    this.newReviewRating = rating;
  }

  submitReview() {
    if (!this.currentUser) return;
    
    this.isSubmitting = true;
    this.reviewsService.saveReview(this.productId, this.currentUser.id, this.newReviewRating, this.newReviewComment)
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.newReviewComment = '';
          this.loadReviews();
          this.reviewUpdated.emit();
        },
        error: (err) => {
          console.error(err);
          this.isSubmitting = false;
        }
      });
  }
  
  deleteReview(reviewId: string) {
    if(confirm('¿Estás seguro de eliminar tu reseña?')) {
        this.reviewsService.deleteReview(reviewId).subscribe(() => {
            this.loadReviews();
            this.reviewUpdated.emit();
        });
    }
  }
}
