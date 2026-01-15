import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { User } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BreadcrumbsComponent
  ],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css'
})
export default class UserCreateComponent {
  userForm: FormGroup;

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Usuarios', route: '/admin/users' },
    { label: 'Nuevo usuario' }
  ];

  roles = ['Usuario', 'Administrador'];
  statuses = ['Activo', 'Inactivo'];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: ['Usuario', [Validators.required]],
      status: ['Activo', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData: User = {
        id: Date.now(),
        name: this.userForm.value.name,
        email: this.userForm.value.email,
        role: this.userForm.value.role,
        status: this.userForm.value.status,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      console.log('Usuario creado:', userData);
      this.router.navigate(['/admin/users']);
    }
  }
}