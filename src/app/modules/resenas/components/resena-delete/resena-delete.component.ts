import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-resena-delete',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './resena-delete.component.html'
})
export class ResenaDeleteComponent {
    @Input() show = false;
    @Output() confirm = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();

    onConfirm() {
        this.confirm.emit();
    }

    onCancel() {
        this.cancel.emit();
    }
}
