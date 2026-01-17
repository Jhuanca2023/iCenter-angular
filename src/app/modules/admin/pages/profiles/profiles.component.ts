import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-profiles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profiles.component.html',
  styleUrl: './profiles.component.css'
})
export default class AdminProfilesComponent {
  profile = {
    name: 'Admin',
    email: 'admin@icenter.com',
    role: 'Administrador'
  };

  onSubmit(): void {
    console.log('Perfil actualizado:', this.profile);
  }
}
