import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { Marca } from '../../../interfaces/marca.interface';

@Component({
  selector: 'app-marca-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BreadcrumbsComponent
  ],
  templateUrl: './marca-create.component.html',
  styleUrl: './marca-create.component.css'
})
export default class MarcaCreateComponent {
  marcaForm: FormGroup;
  marcaLogo: string = '';
  selectedCategories: string[] = [];

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Marcas', route: '/admin/marcas' },
    { label: 'Nueva marca' }
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

  constructor(private fb: FormBuilder) {
    this.marcaForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
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

  onLogoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.marcaLogo = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onSubmit(): void {
    if (this.marcaForm.valid && this.selectedCategories.length > 0 && this.marcaLogo) {
      const marcaData: Marca = {
        id: Date.now(),
        name: this.marcaForm.value.name,
        description: this.marcaForm.value.description,
        logo: this.marcaLogo,
        categories: this.selectedCategories,
        visible: this.marcaForm.value.visible ?? true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      console.log('Marca creada:', marcaData);
    }
  }
}
