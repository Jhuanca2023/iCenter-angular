import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-nosotros',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './nosotros.component.html',
    styleUrls: ['./nosotros.component.css']
})
export default class NosotrosComponent {
    activeSection: string = 'esencia';

    setActiveSection(sectionId: string): void {
        this.activeSection = sectionId;
    }
}
