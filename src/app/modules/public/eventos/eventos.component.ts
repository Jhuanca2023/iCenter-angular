import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-eventos',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './eventos.component.html',
    styleUrls: ['./eventos.component.css']
})
export default class EventosComponent {
    isMenuOpen = false;

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
    }
}
