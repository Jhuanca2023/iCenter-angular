import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CheckoutTotals } from '@core/interfaces/checkout.interface';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-review-step',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './review-step.component.html'
})
export class ReviewStepComponent implements OnInit {
  @Input() orderId = '';
  @Input() totals: CheckoutTotals | null = null;
  @Input() status: 'idle' | 'processing' | 'succeeded' | 'failed' = 'idle';

  @Output() restart = new EventEmitter<void>();

  ngOnInit(): void {
    if (this.status === 'succeeded') {
      this.triggerConfetti();
    }
  }

  private triggerConfetti(): void {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }
}
