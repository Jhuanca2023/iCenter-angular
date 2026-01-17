import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../../core/services/auth.service';
import { UsersService } from '../../../../../core/services/users.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-admin-profile-security',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-security.component.html',
  styleUrl: './profile-security.component.css'
})
export class AdminProfileSecurityComponent implements OnInit, OnDestroy {
  passwordForm: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isGoogleAccount = false;
  currentUser: any = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private usersService: UsersService
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.currentUser = user;
          this.loadUserDetails(user.id);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUserDetails(userId: string): void {
    this.usersService.getById(userId).subscribe({
      next: (user) => {
        if (user) {
          this.isGoogleAccount = user.authProvider === 'google' || 
                                user.avatar?.includes('googleusercontent.com') || false;
        }
      },
      error: (err) => {
        console.error('Error al cargar detalles del usuario:', err);
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else if (confirmPassword) {
      confirmPassword.setErrors(null);
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.passwordForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;
      this.successMessage = null;

      setTimeout(() => {
        this.isLoading = false;
        this.successMessage = 'Contraseña actualizada correctamente';
        this.passwordForm.reset();
        
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      }, 1000);
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }
}

export default AdminProfileSecurityComponent;
