import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { BrandsService } from '../../../../../core/services/brands.service';
import { CategoriesService } from '../../../../../core/services/categories.service';
import { Subscription } from 'rxjs';

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
export default class MarcaCreateComponent implements OnInit, OnDestroy {
  marcaForm: FormGroup;
  selectedCategories: string[] = [];
  availableCategories: any[] = [];
  isLoading = false;
  error: string | null = null;
  private subscription?: Subscription;

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Marcas', route: '/admin/marcas' },
    { label: 'Nueva marca' }
  ];

  constructor(
    private fb: FormBuilder,
    private brandsService: BrandsService,
    private categoriesService: CategoriesService,
    private router: Router
  ) {
    this.marcaForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      visible: [true]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadCategories(): void {
    this.subscription = this.categoriesService.getAll().subscribe({
      next: (categories) => {
        this.availableCategories = categories;
      },
      error: (err) => {
        console.error('Error cargando categorías:', err);
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

  onSubmit(): void {
    if (this.marcaForm.valid) {
      this.isLoading = true;
      this.error = null;

      const marcaData = {
        name: this.marcaForm.value.name,
        description: this.marcaForm.value.description || undefined,
        visible: this.marcaForm.value.visible ?? true
      };

      this.brandsService.create(marcaData).subscribe({
        next: (marca) => {
          this.isLoading = false;
          // TODO: Asociar categorías si se implementa en el servicio
          this.router.navigate(['/admin/marcas']);
        },
        error: (err) => {
          console.error('Error creando marca:', err);
          this.error = err.message || 'Error al crear la marca. Por favor, intenta nuevamente.';
          this.isLoading = false;
        }
      });
    } else {
      this.marcaForm.markAllAsTouched();
    }
  }
}
