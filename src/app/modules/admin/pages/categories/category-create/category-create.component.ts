import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { Marca } from '../../../interfaces/marca.interface';

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

  brands: Marca[] = [
    { 
      id: 1, 
      name: 'Apple', 
      categories: ['Smartphones', 'Laptops', 'Wearables'],
      visible: true
    },
    { 
      id: 2, 
      name: 'Samsung', 
      categories: ['Smartphones', 'Televisores', 'Audio'],
      visible: true
    },
    { 
      id: 3, 
      name: 'Sony', 
      categories: ['Audio', 'Cámaras', 'Gaming'],
      visible: true
    },
    { 
      id: 4, 
      name: 'HP', 
      categories: ['Laptops', 'Impresoras'],
      visible: true
    },
    { 
      id: 5, 
      name: 'Lenovo', 
      categories: ['Laptops', 'Gaming'],
      visible: true
    },
    { 
      id: 6, 
      name: 'Dell', 
      categories: ['Laptops', 'Gaming'],
      visible: true
    }
  ];

  get availableBrands(): Marca[] {
    return this.brands.filter(brand => brand.visible);
  }

  constructor(private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      brand: ['', [Validators.required]],
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
    if (this.categoryForm.valid && this.categoryForm.value.brand) {
      const selectedBrand = this.brands.find(b => b.id.toString() === this.categoryForm.value.brand);
      const categoryData = {
        ...this.categoryForm.value,
        brand: selectedBrand ? {
          id: selectedBrand.id,
          name: selectedBrand.name
        } : this.categoryForm.value.brand,
        image: this.categoryImage
      };
      console.log('Categoría creada:', categoryData);
    }
  }
}
