import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit {
  sidebarLinks = [
    { name: 'Dashboard', path: '/admin', icon: 'dashboard' },
    { name: 'Productos', path: '/admin/productos', icon: 'products' },
    { name: 'Categorías', path: '/admin/categories', icon: 'categories' },
    { name: 'Marcas', path: '/admin/marcas', icon: 'brands' },
    { name: 'Usuarios', path: '/admin/users', icon: 'users' },
    { name: 'Pedidos', path: '/admin/orders', icon: 'orders' },
    {
      name: 'Reclamos',
      path: '/admin/reclamos',
      icon: 'claims',
      isOpen: true,
      children: [
        { name: 'Pendientes', path: '/admin/reclamos/pendientes' },
        { name: 'En Proceso', path: '/admin/reclamos/en-proceso' },
        { name: 'Completados', path: '/admin/reclamos/completados' },
        { name: 'Archivados', path: '/admin/reclamos/archivados' }
      ]
    }
  ];

  activeLink = this.sidebarLinks[0].path;
  isUserMenuOpen = false;
  isSidebarOpen = false;

  adminInfo = {
    name: 'Admin',
    email: 'admin@icenter.com',
    avatar: undefined as string | undefined
  };

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user: any) => {
      if (user) {
        this.adminInfo = {
          name: user.name || 'Admin',
          email: user.email || 'admin@icenter.com',
          avatar: user.avatar
        };
      }
    });
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  getInitials(name: string): string {
    return name.substring(0, 2).toUpperCase();
  }

  getAvatarColor(name: string): string {
    const colors = [
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-yellow-500',
      'bg-green-500',
      'bg-blue-500',
      'bg-indigo-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.closeUserMenu();
      },
      error: (err: any) => {
        console.error('Error al cerrar sesión:', err);
        this.closeUserMenu();
        this.router.navigate(['/auth']);
      }
    });
  }

  goToStore(): void {
    this.router.navigate(['/']);
    this.closeUserMenu();
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  toggleSubmenu(item: any, event: Event): void {
    if (item.children) {
      event.preventDefault();
      event.stopPropagation();
      item.isOpen = !item.isOpen;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-container')) {
      this.closeUserMenu();
    }
    if (!target.closest('.sidebar-container') && !target.closest('.sidebar-toggle')) {
      if (window.innerWidth < 768) {
        this.closeSidebar();
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (window.innerWidth >= 768) {
      this.isSidebarOpen = false;
    }
  }
}
