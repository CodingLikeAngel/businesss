import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UICardComponent, UIChipComponent, UITooltipComponent, CardVariant } from '@negocio/ui-components';

@Component({
  selector: 'lib-service-section',
  standalone: true,
  imports: [CommonModule, UICardComponent, UIChipComponent, UITooltipComponent],
  template: `
    <section id="servicios" class="mb-12">
      <h2 class="text-4xl font-bold text-[#FACC15] text-center mb-8 font-nintendo drop-shadow-[0_4px_8px_rgba(255,204,21,0.8)] animate-bounce">
        Nuestros Servicios
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div *ngFor="let service of services">
          <lib-ui-tooltip [content]="service.tooltip" [variant]="variant" position="top">
            <lib-ui-card
              [variant]="variant"
              [image]="service.image"
              size="medium"
              animation="zoom"
              [title]="service.title"
              [description]="service.description"
              [actions]="[{ label: 'Reservar Ahora', href: '#reservas', onClick: onReserve }]"
            ></lib-ui-card>
          </lib-ui-tooltip>
          <div class="flex flex-wrap gap-2 mt-2 justify-center">
            <lib-ui-chip
              *ngFor="let chip of service.chips"
              [variant]="variant"
              size="sm"
              rounded="full"
              (chipClick)="filterService(chip.value)"
            >
              {{ chip.label }}
            </lib-ui-chip>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ServiceSectionComponent {
  @Input() variant: CardVariant = 'default';
  @Output() reserve = new EventEmitter<void>();

  services = [
    {
      title: 'Corte Hombre',
      description: 'Cortes modernos y clásicos adaptados a tu personalidad.',
      image: 'https://dummyimage.com/200x300/000/fff&text=Hola+León',
      tooltip: 'Explora cortes modernos y clásicos.',
      chips: [
        { label: 'Degradado', value: 'degradado' },
        { label: 'Clásico', value: 'clasico' },
        { label: 'Moderno', value: 'moderno' },
      ],
    },
    {
      title: 'Corte Mujer',
      description: 'Personaliza tu estilo con cortes únicos.',
    //   image: 'https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U',
       image: "https://dummyimage.com/200x300/000/fff&text=Hola+León2",
      tooltip: 'Personaliza tu estilo con cortes únicos.',
      chips: [
        { label: 'Bob', value: 'bob' },
        { label: 'Largo', value: 'largo' },
        { label: 'Pixie', value: 'pixie' },
      ],
    },
    {
      title: 'Manicura',
      description: 'Diseños que destacan en cualquier aventura.',
    //   image: 'https://fastly.picsum.photos/id/429/200/300.jpg?hmac=6ShrHCg_ioSEwdK2j-TkxO08G50YITxb2h0Z42Y8piI',
       image: "https://dummyimage.com/200x300/000/fff&text=Hola+León3",
      tooltip: 'Diseños que destacan en cualquier ocasión.',
      chips: [
        { label: 'Francesa', value: 'francesa' },
        { label: 'Gel', value: 'gel' },
        { label: 'Arte', value: 'arte' },
      ],
    },
  ];

  // Función para manejar el evento de reserva
  onReserve(): void {
    this.reserve.emit();
  }

  filterService(category: string) {
    console.log(`Filtrando por: ${category}`);
  }
}