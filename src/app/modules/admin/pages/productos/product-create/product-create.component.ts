import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { Marca } from '../../../interfaces/marca.interface';

interface ProductColor {
  name: string;
  hex: string;
  images: string[];
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
  productForm: FormGroup;
  colors: ProductColor[] = [];
  selectedCategories: string[] = [];
  productImages: string[] = [];
  activeTab: 'precios' | 'inventario' = 'precios';
  
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Productos', route: '/admin/productos' },
    { label: 'Nuevo producto' }
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

  brands: Marca[] = [
    { 
      id: 1, 
      name: 'Apple', 
      description: 'Marca líder en tecnología',
      categories: ['Smartphones', 'Laptops', 'Wearables'],
      logo: '',
      visible: true
    },
    { 
      id: 2, 
      name: 'Samsung', 
      description: 'Innovación tecnológica coreana',
      categories: ['Smartphones', 'Televisores', 'Audio'],
      logo: '',
      visible: true
    },
    { 
      id: 3, 
      name: 'Sony', 
      description: 'Calidad premium en audio y tecnología',
      categories: ['Audio', 'Cámaras', 'Gaming'],
      logo: '',
      visible: true
    },
    { 
      id: 4, 
      name: 'HP', 
      description: 'Soluciones empresariales y personales',
      categories: ['Laptops', 'Impresoras'],
      logo: '',
      visible: true
    },
    { 
      id: 5, 
      name: 'Lenovo', 
      description: 'Computadoras y dispositivos inteligentes',
      categories: ['Laptops', 'Gaming'],
      logo: '',
      visible: true
    },
    { 
      id: 6, 
      name: 'Dell', 
      description: 'Tecnología confiable para todos',
      categories: ['Laptops', 'Gaming'],
      logo: '',
      visible: true
    },
    { 
      id: 7, 
      name: 'Asus', 
      description: 'Innovación en gaming y tecnología',
      categories: ['Laptops', 'Gaming'],
      logo: '',
      visible: true
    },
    { 
      id: 8, 
      name: 'Xiaomi', 
      description: 'Tecnología accesible e innovadora',
      categories: ['Smartphones', 'Wearables'],
      logo: '',
      visible: true
    },
    { 
      id: 9, 
      name: 'Huawei', 
      description: 'Tecnología avanzada en comunicaciones',
      categories: ['Smartphones', 'Wearables'],
      logo: '',
      visible: true
    },
    { 
      id: 10, 
      name: 'LG', 
      description: 'Innovación en electrodomésticos y tecnología',
      categories: ['Televisores', 'Audio'],
      logo: '',
      visible: true
    },
    { 
      id: 11, 
      name: 'Microsoft', 
      description: 'Soluciones de software y hardware',
      categories: ['Laptops', 'Gaming'],
      logo: '',
      visible: true
    },
    { 
      id: 12, 
      name: 'Logitech', 
      description: 'Periféricos y accesorios tecnológicos',
      categories: ['Gaming', 'Audio'],
      logo: '',
      visible: true
    }
  ];

  get availableBrands(): Marca[] {
    return this.brands.filter(brand => brand.visible);
  }

  constructor(private fb: FormBuilder) {
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
      const selectedBrand = this.brands.find(b => b.id.toString() === this.productForm.value.brand);
      const productData = {
        ...this.productForm.value,
        brand: selectedBrand ? {
          id: selectedBrand.id,
          name: selectedBrand.name
        } : this.productForm.value.brand,
        categories: this.selectedCategories,
        colors: this.colors,
        images: this.productImages
      };
      console.log('Producto creado:', productData);
    }
  }

  saveAsDraft(): void {
    const productData = {
      ...this.productForm.value,
      categories: this.selectedCategories,
      colors: this.colors,
      images: this.productImages,
      status: 'Borrador'
    };
    console.log('Producto guardado como borrador:', productData);
  }
}
