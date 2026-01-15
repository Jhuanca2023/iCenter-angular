import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';
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
  private routeSubscription?: Subscription;

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
      description: [''],
      visible: [true]
    });
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.marcaId = params.get('id');
      this.loadMarcaData();
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  loadMarcaData(): void {
    // Mock data
    this.marcaForm.patchValue({
      name: 'Apple',
      description: 'Marca líder en tecnología y dispositivos electrónicos',
      visible: true
    });
    this.selectedCategories = ['Smartphones', 'Laptops', 'Wearables'];
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

  onSubmit(): void {
    if (this.marcaForm.valid && this.selectedCategories.length > 0) {
      const marcaData = {
        id: this.marcaId,
        ...this.marcaForm.value,
        description: this.marcaForm.value.description || undefined,
        categories: this.selectedCategories
      };
      console.log('Marca actualizada:', marcaData);
    }
  }
}
