import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService, AuthUser } from '../../../../core/services/auth.service';
import { UsersService } from '../../../../core/services/users.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.css'
})
export class ProfileEditComponent implements OnInit, OnDestroy {
  profileForm: FormGroup;
  currentUser: AuthUser | null = null;
  isGoogleAccount = false;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  googleData: { name?: string; email?: string; avatar?: string } = {};
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private usersService: UsersService
  ) {
    this.profileForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [{ value: '', disabled: true }],
      phone: [''],
      address: [''],
      city: [''],
      country: ['Perú'],
      postalCode: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUserProfile(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.currentUser = user;
          this.loadUserDetails(user.id);
        }
      });
  }

  loadUserDetails(userId: string): void {
    // Primero obtener datos de Google desde AuthService
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(authUser => {
        if (authUser) {
          this.googleData = {
            name: authUser.name,
            email: authUser.email,
            avatar: authUser.avatar
          };
        }
      });

    // Luego obtener datos de la base de datos
    this.usersService.getById(userId).subscribe({
      next: (user) => {
        if (user) {
          // Detectar si es cuenta de Google por authProvider o avatar
          this.isGoogleAccount = user.authProvider === 'google' || 
                                 user.avatar?.includes('googleusercontent.com') || false;
          
          // Si es cuenta de Google, usar datos de Google primero
          let firstName = '';
          let lastName = '';
          
          if (this.isGoogleAccount && this.googleData.name) {
            // Dividir nombre de Google
            const nameParts = this.googleData.name.split(' ');
            firstName = nameParts[0] || '';
            lastName = nameParts.slice(1).join(' ') || '';
          }
          
          // Si hay datos guardados en BD, usarlos (pueden ser más completos)
          if ((user as any).first_name) {
            firstName = (user as any).first_name;
          } else if (!firstName && user.name) {
            firstName = user.name.split(' ')[0] || '';
          }
          
          if ((user as any).last_name) {
            lastName = (user as any).last_name;
          } else if (!lastName && user.name) {
            lastName = user.name.split(' ').slice(1).join(' ') || '';
          }

          this.profileForm.patchValue({
            firstName: firstName,
            lastName: lastName,
            email: user.email || this.googleData.email || '',
            phone: (user as any).phone || '',
            address: (user as any).address || '',
            city: (user as any).city || '',
            country: (user as any).country || 'Perú',
            postalCode: (user as any).postal_code || ''
          });

          // Si es cuenta de Google y tiene nombre completo, hacer campos opcionales
          if (this.isGoogleAccount && this.googleData.name) {
            this.profileForm.get('firstName')?.clearValidators();
            this.profileForm.get('lastName')?.clearValidators();
            this.profileForm.get('firstName')?.updateValueAndValidity();
            this.profileForm.get('lastName')?.updateValueAndValidity();
          } else {
            // Si no es Google o no tiene nombre, hacer campos requeridos
            this.profileForm.get('firstName')?.setValidators([Validators.required]);
            this.profileForm.get('lastName')?.setValidators([Validators.required]);
            this.profileForm.get('firstName')?.updateValueAndValidity();
            this.profileForm.get('lastName')?.updateValueAndValidity();
          }
        }
      },
      error: (err) => {
        console.error('Error al cargar perfil:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.currentUser) {
      this.isLoading = true;
      this.errorMessage = null;
      this.successMessage = null;

      const formValue = this.profileForm.value;
      
      // Si es cuenta de Google y tiene nombre completo, usar ese nombre
      let fullName = '';
      let firstName = formValue.firstName || '';
      let lastName = formValue.lastName || '';
      
      if (this.isGoogleAccount && this.googleData.name) {
        fullName = this.googleData.name;
        // Si el usuario editó los campos, usar esos valores
        if (firstName || lastName) {
          fullName = `${firstName} ${lastName}`.trim() || this.googleData.name;
        }
      } else {
        fullName = `${firstName} ${lastName}`.trim();
      }

      const updateData: any = {
        name: fullName,
        first_name: firstName || (this.isGoogleAccount && this.googleData.name ? this.googleData.name.split(' ')[0] : null),
        last_name: lastName || (this.isGoogleAccount && this.googleData.name ? this.googleData.name.split(' ').slice(1).join(' ') : null),
        phone: formValue.phone || null,
        address: formValue.address || null,
        city: formValue.city || null,
        country: formValue.country || 'Perú',
        postal_code: formValue.postalCode || null
      };

      this.usersService.update(this.currentUser.id, updateData).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Perfil actualizado correctamente';
          
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.message || 'Error al actualizar el perfil';
          console.error('Error al actualizar perfil:', err);
        }
      });
    } else {
      this.profileForm.markAllAsTouched();
    }
  }
}
