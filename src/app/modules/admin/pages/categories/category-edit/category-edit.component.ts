import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-category-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, BreadcrumbsComponent],
  templateUrl: './category-edit.component.html',
  styleUrl: './category-edit.component.css'
})
export default class CategoryEditComponent implements OnInit {
  categoryForm: FormGroup;
  categoryImage: string = '';
  categoryId: string | null = null;

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Categorías', route: '/admin/categories' },
    { label: 'Editar categoría' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      visible: [true]
    });
  }

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('id');
    this.loadCategoryData();
  }

  loadCategoryData(): void {
    // Mock data
    this.categoryForm.patchValue({
      name: 'Gaming',
      description: 'Dispositivos de gaming',
      visible: true
    });
    this.categoryImage = 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=200&h=200&fit=crop';
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
        id: this.categoryId,
        ...this.categoryForm.value,
        image: this.categoryImage
      };
      console.log('Categoría actualizada:', categoryData);
    }
  }
}
