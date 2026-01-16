import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  ngOnInit(): void {
    // Cargar email guardado si existe
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      this.loginForm.patchValue({
        email: savedEmail,
        rememberMe: true
      });
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.error = null;

      const rememberMe = this.loginForm.value.rememberMe;

      // Guardar o eliminar email según rememberMe
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', this.loginForm.value.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      this.authService.login(
        this.loginForm.value.email,
        this.loginForm.value.password,
        rememberMe
      ).subscribe({
        next: (user) => {
          this.isLoading = false;
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
          this.router.navigateByUrl(returnUrl);
        },
        error: (err) => {
          console.error('Error en login:', err);
          this.error = err.message || 'Email o contraseña incorrectos';
          this.isLoading = false;
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  signInWithGoogle(): void {
    this.isLoading = true;
    this.error = null;
    
    this.authService.signInWithGoogle().subscribe({
      next: () => {
        // La redirección será manejada por Supabase
      },
      error: (err) => {
        console.error('Error en login con Google:', err);
        this.error = err.message || 'Error al iniciar sesión con Google';
        this.isLoading = false;
      }
    });
  }
}
