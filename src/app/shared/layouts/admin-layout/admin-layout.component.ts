import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  sidebarLinks = [
    { name: 'Dashboard', path: '/admin', icon: 'dashboard' },
    { name: 'Productos', path: '/admin/productos', icon: 'products' },
    { name: 'Categorías', path: '/admin/categories', icon: 'categories' },
    { name: 'Marcas', path: '/admin/marcas', icon: 'brands' },
    { name: 'Usuarios', path: '/admin/users', icon: 'users' },
    { name: 'Pedidos', path: '/admin/orders', icon: 'orders' },
    { name: 'Perfiles', path: '/admin/profiles', icon: 'profiles' }
  ];

  activeLink = this.sidebarLinks[0].path;
}
