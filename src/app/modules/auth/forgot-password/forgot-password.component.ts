import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isLoading = false;
  isEmailSent = false;

  constructor(private fb: FormBuilder) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.isEmailSent = true;
      }, 1500);
    } else {
      this.forgotPasswordForm.markAllAsTouched();
    }
  }

  get email() {
    return this.forgotPasswordForm.get('email');
  }
}
