import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-eventos',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './eventos.component.html',
    styleUrls: ['./eventos.component.css']
})
export default class EventosComponent {
    isMenuOpen = false;

    constructor(private router: Router) { }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
    }

    navigateToContact() {
        this.router.navigate(['/'], { fragment: 'contacto' }).then(() => {
            setTimeout(() => {
                const element = document.getElementById('contacto');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        });
    }
}
