import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  description?: string;
}

interface ProductColor {
  name: string;
  hex: string;
  images: string[];
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ProductCardComponent
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})

export default class ProductDetailComponent {
  selectedColor: ProductColor;
  selectedImage = '';
  
  colors: ProductColor[] = [
    {
      name: 'Azul Claro',
      hex: '#60A5FA',
      images: [
        'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage.png',
        'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage2.png',
        'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage3.png',
        'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage4.png'
      ]
    },
    {
      name: 'Blanco',
      hex: '#FFFFFF',
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop'
      ]
    },
    {
      name: 'Rosa',
      hex: '#F9A8D4',
      images: [
        'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1607522372795-0195141a0b5b?w=500&h=500&fit=crop'
      ]
    },
    {
      name: 'Negro',
      hex: '#000000',
      images: [
        'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500&h=500&fit=crop'
      ]
    },
    {
      name: 'Verde',
      hex: '#10B981',
      images: [
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&h=500&fit=crop'
      ]
    }
  ];

  get images(): string[] {
    return this.selectedColor?.images || [];
  }

  constructor() {
    this.selectedColor = this.colors[0];
    this.selectedImage = this.selectedColor.images[0];
  }

  relatedProducts: Product[] = [
    {
      id: 1,
      name: 'AirPods Pro Ultra 2',
      category: 'Audífonos',
      price: 149,
      originalPrice: 249,
      rating: 4,
      reviews: 125,
      image: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImageWithoutBg.png',
      description: 'Audífonos inalámbricos avanzados diseñados para ofrecer una experiencia de audio excepcional'
    },
    {
      id: 2,
      name: 'Sony WH-1000XM5',
      category: 'Audífonos',
      price: 299,
      originalPrice: 399,
      rating: 5,
      reviews: 89,
      image: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImageWithoutBg.png',
      description: 'Cancelación de ruido líder en la industria con calidad de sonido premium'
    },
    {
      id: 3,
      name: 'Bose QuietComfort 45',
      category: 'Audífonos',
      price: 279,
      originalPrice: 329,
      rating: 4,
      reviews: 156,
      image: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImageWithoutBg.png',
      description: 'Comodidad excepcional con cancelación de ruido activa'
    },
    {
      id: 4,
      name: 'Samsung Galaxy Buds2 Pro',
      category: 'Audífonos',
      price: 199,
      originalPrice: 229,
      rating: 4,
      reviews: 203,
      image: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImageWithoutBg.png',
      description: 'Audífonos true wireless con calidad de audio 360'
    }
  ];

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  selectColor(color: ProductColor): void {
    this.selectedColor = color;
    this.selectedImage = color.images[0];
  }

  getStarsArray(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i < rating ? 1 : 0);
  }
}
