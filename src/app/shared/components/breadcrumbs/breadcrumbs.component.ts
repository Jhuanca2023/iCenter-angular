import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  route?: string;
}

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.css'
})
export class BreadcrumbsComponent implements OnInit {
  @Input() items: BreadcrumbItem[] = [];
  homeRoute = '/';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Si estamos en la sección de admin, el home del breadcrumb debe ir a /admin
    this.homeRoute = this.router.url.startsWith('/admin') ? '/admin' : '/';
  }
}
