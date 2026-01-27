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
    currentEventIndex = 0;

    events = [
        {
            title: 'Masterclass: Edición Pro con iPad',
            description: 'Aprende a exprimir DaVinci Resolve en el nuevo iPad Pro con chip M4.',
            image: 'https://img.freepik.com/foto-gratis/auriculares-inalambricos-iluminacion-neon-al-estilo-cyberpunk_23-2151074303.jpg?semt=ais_hybrid&w=740&q=80',
            tag: 'Workshop',
            subTag: 'Virtual & Presencial',
            color: 'bg-purple-600',
            buttonBorder: 'border-purple-500',
            textAccent: 'text-purple-400',
            msgHighlight: 'Gratis para Miembros',
            btnText: 'Más información'
        },
        {
            title: 'Startup Night iCenter',
            description: 'Conecta con los líderes tecnológicos del ecosistema local en el Perú.',
            image: 'https://img.freepik.com/foto-gratis/escuchas-realidad-virtual-juegos-futuristas-alta-tecnologia_23-2151133167.jpg?semt=ais_hybrid&w=740&q=80',
            tag: 'Networking',
            subTag: 'Sede Miraflores',
            color: 'bg-indigo-600',
            buttonBorder: 'border-indigo-600',
            textAccent: 'text-indigo-400',
            msgHighlight: 'Capacidad Limitada',
            btnText: 'Registro VIP'
        },
        {
            title: 'iCenter: Sound Experience',
            description: 'Acompáñanos a recibir el dispositivo más esperado del año con sorpresas.',
            image: 'https://img.freepik.com/foto-gratis/vida-muerta-auriculares-ciberneticos-inalambricos_23-2151072201.jpg?t=st=1769383787~exp=1769387387~hmac=cea1250dddf0e30d4307a1d9a70cb587e6acc31d731e31d381dc6a443c824d47&w=1060',
            tag: 'Launch',
            subTag: 'C.C. Jockey Plaza',
            color: 'bg-fuchsia-600',
            buttonBorder: 'border-fuchsia-600',
            textAccent: 'text-fuchsia-400',
            msgHighlight: 'Sorteos exclusivos',
            btnText: 'Pre-Registro'
        }
    ];

    constructor(private router: Router) { }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
    }

    nextEvent() {
        this.currentEventIndex = (this.currentEventIndex + 1) % this.events.length;
    }

    prevEvent() {
        this.currentEventIndex = (this.currentEventIndex - 1 + this.events.length) % this.events.length;
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
