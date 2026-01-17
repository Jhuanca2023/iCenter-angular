import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { ProductsService, Product, ProductColor } from '../../../../../core/services/products.service';
import { CategoriesService } from '../../../../../core/services/categories.service';
import { BrandsService } from '../../../../../core/services/brands.service';
import { forkJoin, Subscription, of, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { StorageService } from '../../../../../core/services/storage.service';

interface ColorWithFiles extends ProductColor {
  imageFiles: File[];
}

interface ImageFile {
  file: File | null;
  preview: string;
}

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BreadcrumbsComponent
  ],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css'
})
export default class ProductEditComponent implements OnInit, OnDestroy {
  productForm: FormGroup;
  colors: ColorWithFiles[] = [];
  selectedCategories: string[] = [];
  activeTab: 'precios' | 'inventario' = 'precios';
  productId: string | null = null;
  imageType: 'unique' | 'withColor' | null = null;
  uniqueImages: ImageFile[] = [];
  isLoading = false;
  error: string | null = null;
  
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Productos', route: '/admin/productos' },
    { label: 'Editar producto' }
  ];
  
  categories: Array<{ id: string; name: string }> = [];
  brands: Array<{ id: string; name: string }> = [];
  private subscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private brandsService: BrandsService,
    private storageService: StorageService
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
      recommended: [false]
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadInitialData(): void {
    this.isLoading = true;
    this.error = null;
    
    this.subscription = forkJoin({
      categories: this.categoriesService.getAll(),
      brands: this.brandsService.getAll()
    }).subscribe({
      next: ({ categories, brands }) => {
        this.categories = categories.map(cat => ({ id: cat.id, name: cat.name }));
        this.brands = brands.map(brand => ({ id: brand.id, name: brand.name }));
        
        if (this.productId) {
          this.loadProductData();
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error cargando datos iniciales:', err);
        this.error = 'Error al cargar los datos. Por favor, intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  loadProductData(): void {
    if (!this.productId) return;
    
    this.subscription = this.productsService.getById(this.productId).subscribe({
      next: (product) => {
        if (product) {
          this.productForm.patchValue({
            name: product.name,
            description: product.description,
            brand_id: product.brand_id,
            price: product.price,
            stock: product.stock,
            weight: product.weight,
            status: product.status,
            visible: product.visible,
            on_sale: product.on_sale || false,
            sale_price: product.sale_price || 0,
            featured: product.featured || false,
            recommended: product.recommended || false
          });

          this.selectedCategories = product.categories || [];
          this.colors = (product.colors || []).map(color => ({
            ...color,
            imageFiles: []
          }));
          
          if (this.colors.length > 0) {
            this.imageType = 'withColor';
          } else {
            this.imageType = 'unique';
            this.uniqueImages = product.image ? [{ file: null, preview: product.image }] : [{ file: null, preview: '' }];
          }
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando producto:', err);
        this.error = 'Error al cargar el producto. Por favor, intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  toggleCategory(category: { id: string; name: string } | string): void {
    const categoryId = typeof category === 'string' ? category : category.id;
    const index = this.selectedCategories.indexOf(categoryId);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(categoryId);
    }
  }

  isCategorySelected(category: { id: string; name: string } | string): boolean {
    const categoryId = typeof category === 'string' ? category : category.id;
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
        } else if (color.images.length < 5) {
          color.images.push(preview);
          color.imageFiles.push(file);
        }
      };
      reader.readAsDataURL(file);
      input.value = '';
    }
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
        if (this.uniqueImages.length < 6 && imageIndex === this.uniqueImages.length - 1 && this.uniqueImages[imageIndex].file) {
          this.uniqueImages.push({ file: null, preview: '' });
        }
      };
      reader.readAsDataURL(file);
      input.value = '';
    }
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

  onPromotionToggle(): void {
    const onSale = this.productForm.get('on_sale')?.value;
    if (!onSale) {
      this.productForm.patchValue({ sale_price: 0 });
    }
  }


  onColorChange(color: ColorWithFiles, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input) {
      color.hex = input.value;
    }
  }

  private extractFileFromDataUrl(dataUrl: string): File | null {
    try {
      const arr = dataUrl.split(',');
      if (arr.length < 2) return null;
      const mime = arr[0].match(/:(.*?);/)?.[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], `image-${Date.now()}.png`, { type: mime || 'image/png' });
    } catch {
      return null;
    }
  }

  private uploadImages(): Observable<{ uniqueImages?: string[]; colors?: ProductColor[] }> {
    const timestamp = Date.now();
    
    if (this.imageType === 'unique') {
      const imageFiles = this.uniqueImages.filter(img => img.file !== null).map(img => img.file!);
      if (imageFiles.length === 0) {
        // Si no hay archivos nuevos, usar las URLs existentes
        const existingUrls = this.uniqueImages.filter(img => img.preview && !img.file && img.preview.startsWith('http')).map(img => img.preview);
        return of({ uniqueImages: existingUrls.length > 0 ? existingUrls : [] });
      }
      
      const uploadPromises = imageFiles.map((file, index) => {
        const fileName = `${timestamp}-${index}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const path = `products/${fileName}`;
        return this.storageService.uploadImage('product-images', file, path);
      });
      
      return forkJoin(uploadPromises).pipe(
        map(urls => {
          // Combinar URLs nuevas con existentes
          const existingUrls = this.uniqueImages.filter(img => img.preview && !img.file && img.preview.startsWith('http')).map(img => img.preview);
          return { uniqueImages: [...existingUrls, ...urls] };
        })
      );
    } else {
      const colorUploadPromises = this.colors.map((color, colorIndex) => {
        const imageFiles = color.imageFiles.filter(file => file !== null && file !== undefined);
        
        if (imageFiles.length === 0) {
          // Si no hay archivos nuevos, usar las URLs existentes
          const existingUrls = color.images.filter(img => img.startsWith('http'));
          return of({ name: color.name, hex: color.hex, images: existingUrls });
        }
        
        const uploadPromises = imageFiles.map((file, imgIndex) => {
          const fileName = `${timestamp}-color-${colorIndex}-${imgIndex}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          const path = `products/${fileName}`;
          return this.storageService.uploadImage('product-images', file, path);
        });
        
        return forkJoin(uploadPromises).pipe(
          map(urls => {
            // Combinar URLs nuevas con existentes
            const existingUrls = color.images.filter(img => img.startsWith('http'));
            return { name: color.name, hex: color.hex, images: [...existingUrls, ...urls] };
          })
        );
      });
      
      return forkJoin(colorUploadPromises).pipe(
        map(colors => ({ colors }))
      );
    }
  }

  onSubmit(): void {
    if (this.productForm.valid && this.selectedCategories.length > 0 && this.imageType && this.productId) {
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
            colors: colors || (this.imageType === 'withColor' ? this.colors : undefined),
            image: uniqueImages && uniqueImages.length > 0 ? uniqueImages[0] : undefined
          };
          
          return this.productsService.update(this.productId!, productData);
        })
      ).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/admin/productos']);
        },
        error: (err) => {
          console.error('Error actualizando producto:', err);
          this.error = 'Error al actualizar el producto. Por favor, intenta nuevamente.';
          this.isLoading = false;
        }
      });
    }
  }

  getProductInfo(): any {
    const totalImages = this.colors.reduce((sum, color) => sum + color.images.length, 0);
    return {
      id: this.productId,
      createdAt: '19/04/2025 15:33',
      category: this.selectedCategories[0] || 'N/A',
      imagesActive: totalImages,
      imagesNew: 0,
      imagesToDelete: 0
    };
  }
}
