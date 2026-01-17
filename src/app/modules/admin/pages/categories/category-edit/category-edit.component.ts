import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { CategoriesService } from '../../../../../core/services/categories.service';
import { BrandsService } from '../../../../../core/services/brands.service';
import { StorageService } from '../../../../../core/services/storage.service';
import { Marca } from '../../../interfaces/marca.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-category-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, BreadcrumbsComponent],
  templateUrl: './category-edit.component.html',
  styleUrl: './category-edit.component.css'
})
export default class CategoryEditComponent implements OnInit, OnDestroy {
  categoryForm: FormGroup;
  categoryImage: string = '';
  categoryId: string | null = null;
  brands: Marca[] = [];
  isLoading = false;
  error: string | null = null;
  private subscription?: Subscription;

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Categorías', route: '/admin/categories' },
    { label: 'Editar categoría' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private categoriesService: CategoriesService,
    private brandsService: BrandsService,
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
    this.categoryId = this.route.snapshot.paramMap.get('id');
    this.loadBrands();
    if (this.categoryId) {
      this.loadCategoryData();
    }
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
      }
    });
  }

  loadCategoryData(): void {
    if (!this.categoryId) return;
    
    this.isLoading = true;
    this.isLoading = true;
    this.subscription = this.categoriesService.getById(this.categoryId).subscribe({
      next: (category) => {
        if (category) {
          this.categoryForm.patchValue({
            name: category.name,
            description: category.description || '',
            brand_id: category.brand_id || '',
            visible: category.visible
          });
          this.categoryImage = category.image_url || '';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando categoría:', err);
        this.error = 'Error al cargar la categoría.';
        this.isLoading = false;
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
    if (this.categoryForm.valid && this.categoryId) {
      this.isLoading = true;
      this.error = null;

      const formData = this.categoryForm.value;
      let imageUrl = this.categoryImage;

      if (this.categoryImage && this.categoryImage.startsWith('data:')) {
        const file = this.extractFileFromDataUrl(this.categoryImage);
        if (file) {
          const timestamp = Date.now();
          const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          const path = `categories/${fileName}`;
          
          this.storageService.uploadImage('category-images', file, path).subscribe({
            next: (url) => {
              imageUrl = url;
              this.updateCategory(formData, imageUrl);
            },
            error: (err) => {
              console.error('Error subiendo imagen:', err);
              this.error = 'Error al subir la imagen.';
              this.isLoading = false;
            }
          });
        } else {
          this.updateCategory(formData, imageUrl);
        }
      } else {
        this.updateCategory(formData, imageUrl);
      }
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }

  private updateCategory(formData: any, imageUrl: string): void {
    const categoryData: any = {
      name: formData.name,
      description: formData.description || undefined,
      brand_id: formData.brand_id,
      visible: formData.visible ?? true
    };
    
    if (imageUrl) {
      categoryData.image_url = imageUrl;
    }

    this.categoriesService.update(this.categoryId!, categoryData).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/admin/categories']);
      },
      error: (err) => {
        console.error('Error actualizando categoría:', err);
        this.error = err.message || 'Error al actualizar la categoría.';
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
