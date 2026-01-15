import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-google-callback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './google-callback.component.html',
  styleUrl: './google-callback.component.css',
  encapsulation: ViewEncapsulation.None
})
export class GoogleCallbackComponent implements OnInit {
  isLoading = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const error = params['error'];

      if (error) {
        setTimeout(() => {
          this.router.navigate(['/auth/login'], { queryParams: { error } });
        }, 2000);
      } else if (token) {
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      } else {
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      }
    });
  }
}
