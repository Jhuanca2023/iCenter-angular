import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { User } from '../../../interfaces/user.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BreadcrumbsComponent
  ],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export default class UserEditComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  userId: string | null = null;
  private routeSubscription?: Subscription;

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Usuarios', route: '/admin/users' },
    { label: 'Editar usuario' }
  ];

  roles = ['Usuario', 'Administrador'];
  statuses = ['Activo', 'Inactivo'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
      this.loadUserData();
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  loadUserData(): void {
    // Mock data
    this.userForm.patchValue({
      name: 'Juan Pérez',
      email: 'juan@example.com',
      role: 'Usuario',
      status: 'Activo'
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData = {
        id: this.userId,
        ...this.userForm.value
      };
      console.log('Usuario actualizado:', userData);
      this.router.navigate(['/admin/users']);
    }
  }
}