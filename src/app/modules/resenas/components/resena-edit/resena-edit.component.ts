import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-resena-edit',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './resena-edit.component.html'
})
export class ResenaEditComponent {
    @Input() rating = 5;
    @Input() comment = '';
    @Input() isSubmitting = false;
    @Input() isEditing = false;

    @Output() ratingChange = new EventEmitter<number>();
    @Output() commentChange = new EventEmitter<string>();
    @Output() submitForm = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();

    setRating(val: number) {
        this.ratingChange.emit(val);
    }

    onSubmit() {
        this.submitForm.emit();
    }

    onCancel() {
        this.cancel.emit();
    }
}
