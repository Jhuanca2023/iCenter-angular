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
    email: 'admin@sphere.com',
    role: 'Administrador'
  };
}
