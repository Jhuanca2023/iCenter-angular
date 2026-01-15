import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-marca-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BreadcrumbsComponent
  ],
  templateUrl: './marca-edit.component.html',
  styleUrl: './marca-edit.component.css'
})
export default class MarcaEditComponent implements OnInit {
  marcaForm: FormGroup;
  marcaLogo: string = '';
  marcaId: string | null = null;
  selectedCategories: string[] = [];

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Marcas', route: '/admin/marcas' },
    { label: 'Editar marca' }
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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.marcaForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      visible: [true]
    });
  }

  ngOnInit(): void {
    this.marcaId = this.route.snapshot.paramMap.get('id');
    this.loadMarcaData();
  }

  loadMarcaData(): void {
    // Mock data
    this.marcaForm.patchValue({
      name: 'Apple',
      description: 'Marca líder en tecnología y dispositivos electrónicos',
      visible: true
    });
    this.selectedCategories = ['Smartphones', 'Laptops', 'Wearables'];
    this.marcaLogo = 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200&h=200&fit=crop';
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
    if (this.marcaForm.valid && this.selectedCategories.length > 0) {
      const marcaData = {
        id: this.marcaId,
        ...this.marcaForm.value,
        categories: this.selectedCategories,
        logo: this.marcaLogo
      };
      console.log('Marca actualizada:', marcaData);
    }
  }
}
