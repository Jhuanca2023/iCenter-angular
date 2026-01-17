import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { BrandsService } from '../../../../../core/services/brands.service';
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
    private router: Router
  ) {
    this.marcaForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      visible: [true]
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
