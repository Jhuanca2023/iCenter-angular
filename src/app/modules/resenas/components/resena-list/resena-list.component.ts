import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductReviewsService, Review, ProductRatingSummary } from '../../../../core/services/product-reviews.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ResenaEditComponent } from '../resena-edit/resena-edit.component';
import { ResenaDeleteComponent } from '../resena-delete/resena-delete.component';

@Component({
    selector: 'app-resena-list',
    standalone: true,
    imports: [CommonModule, RouterModule, ResenaEditComponent, ResenaDeleteComponent],
    templateUrl: './resena-list.component.html',
    styles: [`
    .progress-bar { transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
  `]
})
export class ResenaListComponent implements OnInit, OnChanges {
    @Input() productId!: string;
    @Input() ratingSummary?: ProductRatingSummary;
    @Output() reviewUpdated = new EventEmitter<void>();

    reviews: Review[] = [];
    currentUser: any;

    // State for Create/Edit
    formRating = 5;
    formComment = '';
    isSubmitting = false;
    editingReviewId: string | null = null;

    // State for Delete Modal
    showDeleteModal = false;
    reviewToDeleteId: string | null = null;

    ratingCounts: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    protected Math = Math;

    constructor(
        private reviewsService: ProductReviewsService,
        private authService: AuthService
    ) { }

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

    // Form methods
    submitReview() {
        if (!this.currentUser) return;
        this.isSubmitting = true;
        this.reviewsService.saveReview(this.productId, this.currentUser.id, this.formRating, this.formComment)
            .subscribe({
                next: () => {
                    this.isSubmitting = false;
                    this.formComment = '';
                    this.formRating = 5;
                    this.editingReviewId = null;
                    this.loadReviews();
                    this.reviewUpdated.emit();
                },
                error: (err) => {
                    console.error(err);
                    this.isSubmitting = false;
                }
            });
    }

    startEdit(review: Review) {
        this.editingReviewId = review.id;
        this.formRating = review.rating;
        this.formComment = review.comment || '';
        const formElement = document.querySelector('#review-form');
        if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
    }

    cancelEdit() {
        this.editingReviewId = null;
        this.formRating = 5;
        this.formComment = '';
    }

    // Delete methods
    openDeleteModal(reviewId: string) {
        this.reviewToDeleteId = reviewId;
        this.showDeleteModal = true;
    }

    closeDeleteModal() {
        this.showDeleteModal = false;
        this.reviewToDeleteId = null;
    }

    confirmDelete() {
        if (this.reviewToDeleteId) {
            this.reviewsService.deleteReview(this.reviewToDeleteId).subscribe(() => {
                this.loadReviews();
                this.reviewUpdated.emit();
                this.closeDeleteModal();
            });
        }
    }
}
