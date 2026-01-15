import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';

interface ProductColor {
  name: string;
  hex: string;
  images: string[];
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
export default class ProductEditComponent implements OnInit {
  productForm: FormGroup;
  colors: ProductColor[] = [];
  selectedCategories: string[] = [];
  productImages: string[] = [];
  activeTab: 'precios' | 'inventario' = 'precios';
  productId: string | null = null;
  
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Productos', route: '/admin/productos' },
    { label: 'Editar producto' }
  ];
  
  categories = [
    'Laptops',
    'Audio',
    'Cámaras',
    'Gaming',
    'Smartphones',
    'Wearables',
    'Televisores',
    'Impresoras'
  ];

  brands = [
    'Apple',
    'Samsung',
    'Sony',
    'HP',
    'Lenovo',
    'Dell',
    'Asus',
    'Xiaomi',
    'Huawei',
    'LG',
    'Microsoft',
    'Logitech'
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      weight: ['', [Validators.required]],
      status: ['Activo', [Validators.required]],
      visible: [true]
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.loadProductData();
  }

  loadProductData(): void {
    // Mock data
    this.productForm.patchValue({
      name: 'AUDÍFONOS BLUETOOTH PARA CASCO MOTO AURICULARES INALÁMBRICOS',
      description: 'string',
      brand: 'Sony',
      price: 89.99,
      stock: 15,
      weight: '0.2',
      status: 'Activo',
      visible: true
    });

    this.selectedCategories = ['Audio'];
    this.productImages = [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=200&h=200&fit=crop'
    ];

    this.colors = [
      {
        name: 'Negro',
        hex: '#000000',
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=200&h=200&fit=crop'
        ]
      }
    ];
  }

  toggleCategory(category: string): void {
    const index = this.selectedCategories.indexOf(category);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(category);
    }
  }

  isCategorySelected(category: string): boolean {
    return this.selectedCategories.includes(category);
  }

  addColor(): void {
    const newColor: ProductColor = {
      name: '',
      hex: '#000000',
      images: []
    };
    this.colors.push(newColor);
  }

  removeColor(index: number): void {
    this.colors.splice(index, 1);
  }

  onColorImageChange(event: Event, color: ProductColor, imageIndex?: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (imageIndex !== undefined) {
          color.images[imageIndex] = e.target.result;
        } else if (color.images.length < 5) {
          color.images.push(e.target.result);
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  removeColorImage(color: ProductColor, index: number): void {
    color.images.splice(index, 1);
  }

  onProductImageChange(event: Event, index?: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (index !== undefined) {
          this.productImages[index] = e.target.result;
        } else if (this.productImages.length < 5) {
          this.productImages.push(e.target.result);
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  removeProductImage(index: number): void {
    this.productImages.splice(index, 1);
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

  onSubmit(): void {
    if (this.productForm.valid && this.selectedCategories.length > 0) {
      const productData = {
        id: this.productId,
        ...this.productForm.value,
        categories: this.selectedCategories,
        colors: this.colors,
        images: this.productImages
      };
      console.log('Producto actualizado:', productData);
    }
  }

  getProductInfo(): any {
    return {
      id: this.productId,
      createdAt: '19/04/2025 15:33',
      category: this.selectedCategories[0] || 'N/A',
      imagesActive: this.productImages.length,
      imagesNew: 0,
      imagesToDelete: 0
    };
  }
}
