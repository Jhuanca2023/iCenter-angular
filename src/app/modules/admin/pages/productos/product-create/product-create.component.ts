import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { ProductsService, Product, ProductColor } from '../../../../../core/services/products.service';
import { StorageService } from '../../../../../core/services/storage.service';
import { CategoriesService } from '../../../../../core/services/categories.service';
import { BrandsService } from '../../../../../core/services/brands.service';
import { forkJoin, Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

interface ImageFile {
  file: File | null;
  preview: string;
}

interface ColorWithFiles extends ProductColor {
  imageFiles: File[];
}

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BreadcrumbsComponent
  ],
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.css'
})
export default class ProductCreateComponent {
  productForm!: FormGroup;
  colors: ColorWithFiles[] = [];
  selectedCategories: string[] = [];
  activeTab: 'precios' | 'inventario' = 'precios';
  imageType: 'unique' | 'withColor' | null = null;
  uniqueImages: ImageFile[] = [];
  isLoading = false;
  error: string | null = null;

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Productos', route: '/admin/productos' },
    { label: 'Nuevo producto' }
  ];

  categories: Array<{ id: string; name: string }> = [];
  brands: Array<{ id: string; name: string }> = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productsService: ProductsService,
    private storageService: StorageService,
    private categoriesService: CategoriesService,
    private brandsService: BrandsService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      brand_id: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      weight: ['', [Validators.required]],
      status: ['Activo', [Validators.required]],
      visible: [true],
      on_sale: [false],
      sale_price: [0, [Validators.min(0)]],
      featured: [false],
      recommended: [false],
      specifications: this.fb.array([])
    });

    this.loadCategories();
    this.loadBrands();

    // Validar visibilidad vs estado borrador
    this.productForm.get('visible')?.valueChanges.subscribe(visible => {
      const status = this.productForm.get('status')?.value;
      if (visible && status === 'Borrador') {
        setTimeout(() => {
          this.productForm.patchValue({ visible: false }, { emitEvent: false });
          this.error = 'Un producto en estado "Borrador" no puede ser visible en el catálogo. Cambia el estado a "Activo" primero.';
        });
      }
    });

    this.productForm.get('status')?.valueChanges.subscribe(status => {
      const visible = this.productForm.get('visible')?.value;
      if (status === 'Borrador' && visible) {
        this.productForm.patchValue({ visible: false }, { emitEvent: false });
        this.error = 'El estado se cambió a "Borrador", por lo que la visibilidad se ha desactivado automáticamente.';
      }
    });
  }

  get specifications(): FormArray {
    return this.productForm.get('specifications') as FormArray;
  }

  addSpecification(): void {
    this.specifications.push(this.fb.group({
      key: ['', Validators.required],
      value: ['', Validators.required]
    }));
  }

  removeSpecification(index: number): void {
    this.specifications.removeAt(index);
  }

  loadCategories(): void {
    this.categoriesService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Error cargando categorías:', err);
      }
    });
  }

  loadBrands(): void {
    this.brandsService.getAll().subscribe({
      next: (brands) => {
        this.brands = brands;
      },
      error: (err) => {
        console.error('Error cargando marcas:', err);
      }
    });
  }

  toggleCategory(categoryId: string): void {
    const index = this.selectedCategories.indexOf(categoryId);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(categoryId);
    }
  }

  isCategorySelected(categoryId: string): boolean {
    return this.selectedCategories.includes(categoryId);
  }

  setImageType(type: 'unique' | 'withColor'): void {
    this.imageType = type;
    if (type === 'unique') {
      this.colors = [];
      if (this.uniqueImages.length === 0) {
        this.uniqueImages = [{ file: null, preview: '' }];
      }
    } else {
      this.uniqueImages = [];
      if (this.colors.length === 0) {
        this.addColor();
      }
    }
  }

  addColor(): void {
    const newColor: ColorWithFiles = {
      name: '',
      hex: '#000000',
      images: [],
      imageFiles: []
    };
    this.colors.push(newColor);
  }

  removeColor(index: number): void {
    this.colors.splice(index, 1);
  }

  onColorImageChange(event: Event, color: ColorWithFiles, imageIndex?: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const preview = e.target.result;
        if (imageIndex !== undefined) {
          color.images[imageIndex] = preview;
          color.imageFiles[imageIndex] = file;
        } else if (color.images.length < 10) {
          color.images.push(preview);
          color.imageFiles.push(file);
        }
      };
      reader.readAsDataURL(file);
    }
    input.value = '';
  }

  removeColorImage(color: ColorWithFiles, index: number): void {
    color.images.splice(index, 1);
    color.imageFiles.splice(index, 1);
  }

  onUniqueImageChange(event: Event, imageIndex: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (imageIndex < this.uniqueImages.length) {
          this.uniqueImages[imageIndex] = { file, preview: e.target.result };
        }
        if (this.uniqueImages.length < 11 && imageIndex === this.uniqueImages.length - 1 && this.uniqueImages[imageIndex].file) {
          this.uniqueImages.push({ file: null, preview: '' });
        }
      };
      reader.readAsDataURL(file);
    }
    input.value = '';
  }

  removeUniqueImage(index: number): void {
    this.uniqueImages.splice(index, 1);
    if (this.uniqueImages.length === 0) {
      this.uniqueImages = [{ file: null, preview: '' }];
    }
  }

  setActiveTab(tab: 'precios' | 'inventario'): void {
    this.activeTab = tab;
  }

  triggerFileInput(inputId: string): void {
    const input = document.getElementById(inputId);
    if (input) {
      input.click();
    }
  }


  onColorChange(color: ColorWithFiles, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input) {
      color.hex = input.value;
    }
  }

  onPromotionToggle(): void {
    const onSale = this.productForm.get('on_sale')?.value;
    if (!onSale) {
      this.productForm.patchValue({ sale_price: 0 });
    }
  }

  private uploadImages(): Observable<{ uniqueImages?: string[]; colors?: ProductColor[] }> {
    const timestamp = Date.now();

    if (this.imageType === 'unique') {
      const imageFiles = this.uniqueImages.filter(img => img.file !== null).map(img => img.file!);
      if (imageFiles.length === 0) {
        return of({ uniqueImages: [] });
      }

      const uploadPromises = imageFiles.map((file, index) => {
        const fileName = `${timestamp}-${index}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const path = `products/${fileName}`;
        return this.storageService.uploadImage('product-images', file, path);
      });

      return forkJoin(uploadPromises).pipe(
        map(urls => ({ uniqueImages: urls }))
      );
    } else {
      const colorUploadPromises = this.colors.map((color, colorIndex) => {
        const imageFiles = color.imageFiles.filter(file => file !== null && file !== undefined);

        if (imageFiles.length === 0) {
          return of({ name: color.name, hex: color.hex, images: [] });
        }

        const uploadPromises = imageFiles.map((file, imgIndex) => {
          const fileName = `${timestamp}-color-${colorIndex}-${imgIndex}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          const path = `products/${fileName}`;
          return this.storageService.uploadImage('product-images', file, path);
        });

        return forkJoin(uploadPromises).pipe(
          map(urls => ({ name: color.name, hex: color.hex, images: urls }))
        );
      });

      return forkJoin(colorUploadPromises).pipe(
        map(colors => ({ colors }))
      );
    }
  }

  onSubmit(): void {
    if (this.productForm.valid && this.selectedCategories.length > 0 && this.imageType) {
      this.isLoading = true;
      this.error = null;

      const formValue = this.productForm.value;

      this.uploadImages().pipe(
        switchMap(({ uniqueImages, colors }) => {
          const productData: Partial<Product> = {
            name: formValue.name,
            description: formValue.description,
            brand_id: formValue.brand_id,
            price: formValue.price,
            sale_price: formValue.on_sale ? formValue.sale_price : null,
            on_sale: formValue.on_sale || false,
            stock: formValue.stock,
            weight: formValue.weight,
            status: formValue.status,
            visible: formValue.visible ?? true,
            featured: formValue.featured || false,
            recommended: formValue.recommended || false,
            categories: this.selectedCategories,
            image: uniqueImages && uniqueImages.length > 0 ? uniqueImages[0] : undefined,
            colors: colors || undefined,
            specifications: formValue.specifications
          };

          return this.productsService.create(productData);
        })
      ).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/admin/productos']);
        },
        error: (err) => {
          console.error('Error creando producto:', err);
          this.error = 'Error al crear el producto. Por favor, intenta nuevamente.';
          this.isLoading = false;
        }
      });
    }
  }

  saveAsDraft(): void {
    const name = this.productForm.get('name')?.value;
    if (!name) {
      this.error = 'El nombre del producto es obligatorio incluso para borradores.';
      return;
    }

    this.isLoading = true;
    this.error = null;

    const formValue = this.productForm.value;

    this.uploadImages().pipe(
      switchMap(({ uniqueImages, colors }) => {
        const productData: Partial<Product> = {
          name: formValue.name,
          description: formValue.description || '',
          brand_id: formValue.brand_id || null,
          price: formValue.price || 0,
          sale_price: formValue.on_sale ? (formValue.sale_price || 0) : null,
          on_sale: formValue.on_sale || false,
          stock: formValue.stock || 0,
          weight: formValue.weight || '',
          status: 'Borrador',
          visible: false,
          featured: formValue.featured || false,
          recommended: formValue.recommended || false,
          categories: this.selectedCategories,
          image: uniqueImages && uniqueImages.length > 0 ? uniqueImages[0] : undefined,
          colors: (colors && colors.length > 0) ? colors : undefined,
          specifications: formValue.specifications
        };

        return this.productsService.create(productData);
      })
    ).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/admin/productos']);
      },
      error: (err) => {
        console.error('Error guardando borrador:', err);
        this.error = 'Error al guardar el borrador. Por favor, intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }
}
