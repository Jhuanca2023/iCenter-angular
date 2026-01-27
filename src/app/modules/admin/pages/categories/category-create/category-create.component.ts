import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { BrandsService } from '../../../../../core/services/brands.service';
import { CategoriesService } from '../../../../../core/services/categories.service';
import { StorageService } from '../../../../../core/services/storage.service';
import { Marca } from '../../../../../core/interfaces/marca.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-category-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, BreadcrumbsComponent],
  templateUrl: './category-create.component.html',
  styleUrl: './category-create.component.css'
})
export default class CategoryCreateComponent implements OnInit, OnDestroy {
  categoryForm: FormGroup;
  categoryImage: string = '';
  brands: Marca[] = [];
  isLoading = false;
  error: string | null = null;
  private subscription?: Subscription;

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Categorías', route: '/admin/categories' },
    { label: 'Nueva categoría' }
  ];

  get availableBrands(): Marca[] {
    return this.brands.filter(brand => brand.visible);
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private brandsService: BrandsService,
    private categoriesService: CategoriesService,
    private storageService: StorageService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      brand_id: ['', [Validators.required]],
      visible: [true]
    });
  }

  ngOnInit(): void {
    this.loadBrands();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadBrands(): void {
    this.subscription = this.brandsService.getAll().subscribe({
      next: (brands) => {
        this.brands = brands;
      },
      error: (err) => {
        console.error('Error cargando marcas:', err);
        this.error = 'Error al cargar las marcas. Por favor, intenta nuevamente.';
      }
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
    if (this.categoryForm.valid && this.categoryForm.value.brand_id) {
      this.isLoading = true;
      this.error = null;

      const formData = this.categoryForm.value;
      let imageUrl = '';

      if (this.categoryImage && this.categoryImage.startsWith('data:')) {
        const file = this.extractFileFromDataUrl(this.categoryImage);
        if (file) {
          const timestamp = Date.now();
          const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          const path = `categories/${fileName}`;

          this.storageService.uploadImage('category-images', file, path).subscribe({
            next: (url) => {
              imageUrl = url;
              this.createCategory(formData, imageUrl);
            },
            error: (err) => {
              console.error('Error subiendo imagen:', err);
              this.error = 'Error al subir la imagen. Intenta nuevamente.';
              this.isLoading = false;
            }
          });
        } else {
          this.createCategory(formData, imageUrl);
        }
      } else {
        this.createCategory(formData, imageUrl);
      }
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }

  private createCategory(formData: any, imageUrl: string): void {
    const categoryData: any = {
      name: formData.name,
      description: formData.description || undefined,
      brand_id: formData.brand_id,
      visible: formData.visible ?? true
    };

    if (imageUrl) {
      categoryData.image_url = imageUrl;
    }

    this.categoriesService.create(categoryData).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/admin/categories']);
      },
      error: (err) => {
        console.error('Error creando categoría:', err);
        this.error = err.message || 'Error al crear la categoría. Por favor, intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  private extractFileFromDataUrl(dataUrl: string): File | null {
    try {
      const arr = dataUrl.split(',');
      const mimeMatch = arr[0].match(/:(.*?);/);
      if (!mimeMatch) return null;

      const mime = mimeMatch[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const extension = mime.split('/')[1] || 'jpg';
      return new File([u8arr], `category-image.${extension}`, { type: mime });
    } catch (e) {
      console.error('Error extrayendo archivo de data URL:', e);
      return null;
    }
  }
}
