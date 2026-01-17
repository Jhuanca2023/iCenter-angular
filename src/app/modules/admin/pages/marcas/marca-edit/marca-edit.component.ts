import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { BrandsService } from '../../../../../core/services/brands.service';
import { CategoriesService } from '../../../../../core/services/categories.service';
import { Marca } from '../../../interfaces/marca.interface';
import { Subscription } from 'rxjs';

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
export default class MarcaEditComponent implements OnInit, OnDestroy {
  marcaForm: FormGroup;
  marcaId: string | null = null;
  selectedCategories: string[] = [];
  availableCategories: any[] = [];
  isLoading = false;
  isLoadingData = false;
  error: string | null = null;
  private routeSubscription?: Subscription;
  private dataSubscription?: Subscription;

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Marcas', route: '/admin/marcas' },
    { label: 'Editar marca' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private brandsService: BrandsService,
    private categoriesService: CategoriesService
  ) {
    this.marcaForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      visible: [true]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.marcaId = params.get('id');
      if (this.marcaId) {
        this.loadMarcaData();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  loadCategories(): void {
    this.categoriesService.getAll().subscribe({
      next: (categories) => {
        this.availableCategories = categories;
      },
      error: (err) => {
        console.error('Error cargando categorías:', err);
      }
    });
  }

  loadMarcaData(): void {
    if (!this.marcaId) return;
    
    this.isLoadingData = true;
    this.error = null;

    this.dataSubscription = this.brandsService.getById(this.marcaId).subscribe({
      next: (marca) => {
        if (marca) {
          this.marcaForm.patchValue({
            name: marca.name,
            description: marca.description || '',
            visible: marca.visible
          });
          this.selectedCategories = marca.categories || [];
        }
        this.isLoadingData = false;
      },
      error: (err) => {
        console.error('Error cargando marca:', err);
        this.error = 'Error al cargar la marca. Por favor, intenta nuevamente.';
        this.isLoadingData = false;
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
    if (this.marcaForm.valid && this.marcaId) {
      this.isLoading = true;
      this.error = null;

      const marcaData = {
        name: this.marcaForm.value.name,
        description: this.marcaForm.value.description || undefined,
        visible: this.marcaForm.value.visible ?? true
      };

      this.brandsService.update(this.marcaId, marcaData).subscribe({
        next: (marca) => {
          this.isLoading = false;
          // TODO: Actualizar categorías asociadas si se implementa en el servicio
          this.router.navigate(['/admin/marcas']);
        },
        error: (err) => {
          console.error('Error actualizando marca:', err);
          this.error = err.message || 'Error al actualizar la marca. Por favor, intenta nuevamente.';
          this.isLoading = false;
        }
      });
    } else {
      this.marcaForm.markAllAsTouched();
    }
  }
}
