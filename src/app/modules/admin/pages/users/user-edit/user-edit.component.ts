import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { User } from '../../../../../core/interfaces/user.interface';
import { UsersService } from '../../../../../core/services/users.service';
import { AuthService } from '../../../../../core/services/auth.service';
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
  isLoading = false;
  error: string | null = null;
  private routeSubscription?: Subscription;
  private dataSubscription?: Subscription;

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
    private router: Router,
    private usersService: UsersService,
    private authService: AuthService
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
      if (this.userId) {
        this.loadUserData();
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

  loadUserData(): void {
    if (!this.userId) return;

    this.isLoading = true;
    this.error = null;

    this.dataSubscription = this.usersService.getById(this.userId).subscribe({
      next: (user) => {
        if (user) {
          console.log('Usuario cargado para edición:', user);
          this.userForm.patchValue({
            name: user.name || '',
            email: user.email || '',
            role: user.role || 'Usuario',
            status: user.status || 'Activo'
          });
          // Guardar UUID original si existe
          if (user.uuid) {
            this.userId = user.uuid;
          }
        } else {
          this.error = 'Usuario no encontrado';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando usuario:', err);
        this.error = 'Error al cargar el usuario. Por favor, intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  onSubmit(): void {
    if (this.userForm.valid && this.userId) {
      this.isLoading = true;
      this.error = null;

      // Solo permitir cambiar rol si es administrador
      const formData = { ...this.userForm.value };
      if (!this.isAdmin) {
        // Si no es admin, no permitir cambiar el rol
        delete formData.role;
      }

      this.usersService.update(this.userId, formData).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/admin/users']);
        },
        error: (err) => {
          console.error('Error actualizando usuario:', err);
          this.error = 'Error al actualizar el usuario. Por favor, intenta nuevamente.';
          this.isLoading = false;
        }
      });
    }
  }
}