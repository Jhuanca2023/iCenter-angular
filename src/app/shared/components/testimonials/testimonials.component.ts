import { Component, ViewEncapsulation, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TestimonialCard {
  image: string;
  name: string;
  handle: string;
  date: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestimonialsComponent implements OnInit {
  cardsData: TestimonialCard[] = [
    {
      image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
      name: 'Briar Martin',
      handle: '@neilstellar',
      date: 'April 20, 2025'
    },
    {
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
      name: 'Avery Johnson',
      handle: '@averywrites',
      date: 'May 10, 2025'
    },
    {
      image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60',
      name: 'Jordan Lee',
      handle: '@jordantalks',
      date: 'June 5, 2025'
    },
    {
      image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60',
      name: 'Avery Johnson',
      handle: '@averywrites',
      date: 'May 10, 2025'
    }
  ];

  row1Cards: TestimonialCard[] = [];
  row2Cards: TestimonialCard[] = [];

  ngOnInit(): void {
    const doubled = [...this.cardsData, ...this.cardsData];
    this.row1Cards = doubled;
    this.row2Cards = doubled;
  }
}
