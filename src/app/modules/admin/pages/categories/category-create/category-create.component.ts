import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-category-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, BreadcrumbsComponent],
  templateUrl: './category-create.component.html',
  styleUrl: './category-create.component.css'
})
export default class CategoryCreateComponent {
  categoryForm: FormGroup;
  categoryImage: string = '';

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Categorías', route: '/admin/categories' },
    { label: 'Nueva categoría' }
  ];

  constructor(private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      visible: [true]
    });
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.categoryImage = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const categoryData = {
        ...this.categoryForm.value,
        image: this.categoryImage
      };
      console.log('Categoría creada:', categoryData);
    }
  }
}
