import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ClaimsService } from '../../../../core/services/claims.service';
import { Claim } from '../../../../core/models/claim.model';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { Subscription } from 'rxjs';
import { AuthService, AuthUser } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-complaint-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, BreadcrumbsComponent],
  templateUrl: './complaint-book-form.component.html',
  styleUrl: './complaint-book-form.component.css'
})
export class ComplaintBookFormComponent implements OnInit, OnDestroy {
  complaintForm!: FormGroup;
  isLoading = false;
  currentStep = 1;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  private subscription = new Subscription();
  currentUser: any;

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Inicio', route: '/' },
    { label: 'Libro de Reclamaciones' }
  ];

  constructor(
    private fb: FormBuilder,
    private claimsService: ClaimsService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user: AuthUser | null) => {
      this.currentUser = user;
      this.initForm();
    });
  }

  initForm(): void {
    const nameParts = this.currentUser?.name?.split(' ') || [];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    this.complaintForm = this.fb.group({
      // Step 1: Información del Cliente
      first_name: [firstName, Validators.required],
      last_name: [lastName, Validators.required],
      document_type: ['', Validators.required],
      document_number: ['', [Validators.required, Validators.pattern(/^[0-9]{8,12}$/)]],
      email: [this.currentUser?.email || '', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      address: ['', Validators.required],
      claimant_type: ['ADULT', Validators.required],
      is_minor: [false],
      guardian_name: [''],
      guardian_lastname: [''],
      guardian_document_type: [''],
      guardian_document_number: [''],
      guardian_phone: [''],
      guardian_email: [''],

      // Step 2: Detalle del Reclamo
      record_type: ['', Validators.required],
      motive: ['', Validators.required],
      incident_date: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      customer_request: ['', Validators.required],
      order_number: [''],
      receipt_number: [''],
    });

    this.complaintForm.get('is_minor')?.valueChanges.subscribe(isMinor => {
      this.toggleGuardianFields(isMinor);
    });
  }

  toggleGuardianFields(isMinor: boolean): void {
    const guardianFields = [
      'guardian_name',
      'guardian_lastname',
      'guardian_document_type',
      'guardian_document_number',
      'guardian_phone',
      'guardian_email'
    ];

    guardianFields.forEach(field => {
      const control = this.complaintForm.get(field);
      if (isMinor) {
        control?.setValidators(Validators.required);
        this.complaintForm.patchValue({ claimant_type: 'MINOR' });
      } else {
        control?.clearValidators();
        this.complaintForm.patchValue({ claimant_type: 'ADULT' });
      }
      control?.updateValueAndValidity();
    });
  }

  nextStep(): void {
    if (this.currentStep === 1) {
      const step1Fields = ['first_name', 'last_name', 'document_type', 'document_number', 'email', 'phone', 'address'];
      if (this.complaintForm.get('is_minor')?.value) {
        step1Fields.push('guardian_name', 'guardian_lastname', 'guardian_document_type', 'guardian_document_number', 'guardian_phone', 'guardian_email');
      }

      let stepValid = true;
      step1Fields.forEach(f => {
        const ctrl = this.complaintForm.get(f);
        if (ctrl?.invalid) {
          ctrl.markAsTouched();
          stepValid = false;
        }
      });
      if (!stepValid) return;
    }
    this.currentStep++;
  }

  prevStep(): void {
    this.currentStep--;
  }

  onSubmit(): void {
    if (this.complaintForm.invalid) {
      this.complaintForm.markAllAsTouched();
      this.errorMessage = 'Por favor, complete todos los campos obligatorios.';
      return;
    }

    this.isLoading = true;
    const formValue = this.complaintForm.value;

    const newClaim: Omit<Claim, 'id' | 'claim_code' | 'status' | 'response_deadline' | 'created_at' | 'updated_at'> = {
      consumer_name: formValue.first_name,
      consumer_lastname: formValue.last_name,
      document_type: formValue.document_type,
      document_number: formValue.document_number,
      email: formValue.email,
      phone: formValue.phone,
      address: formValue.address,
      claimant_type: formValue.claimant_type,
      is_minor: formValue.is_minor,
      guardian_name: formValue.guardian_name,
      guardian_lastname: formValue.guardian_lastname,
      guardian_document_type: formValue.guardian_document_type,
      guardian_document_number: formValue.guardian_document_number,
      guardian_phone: formValue.guardian_phone,
      guardian_email: formValue.guardian_email,
      record_type: formValue.record_type,
      motive: formValue.motive,
      incident_date: formValue.incident_date,
      detailed_description: formValue.description,
      customer_request: formValue.customer_request,
      order_number: formValue.order_number,
      receipt_number: formValue.receipt_number,
      user_id: this.currentUser?.id
    };

    this.subscription.add(
      this.claimsService.createClaim(newClaim).subscribe({
        next: (claim) => {
          this.successMessage = `Registrado con éxito. Código: ${claim.claim_code}`;
          this.currentStep = 3; // Mostrar resumen/confirmación
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error:', err);
          this.errorMessage = 'Error al registrar. Verifique su conexión y reintente.';
          this.isLoading = false;
        }
      })
    );
  }

  finish(): void {
    this.router.navigate(['/complaint-book']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
