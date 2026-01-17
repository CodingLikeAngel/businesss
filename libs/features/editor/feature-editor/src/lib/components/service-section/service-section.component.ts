import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UICardComponent, UIChipComponent, UITooltipComponent, CardVariant } from '@negocio/ui-components';

@Component({
  selector: 'lib-service-section',
  standalone: true,
  imports: [CommonModule, UICardComponent, UIChipComponent, UITooltipComponent],
  template: "<section id=\"servicios\" class=\"mb-16\"><div class=\"container mx-auto px-4\"><h2 class=\"text-4xl font-bold text-center mb-8\">Nuestros Servicios</h2><p class=\"text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto\">Descubre todos nuestros servicios de belleza y cuidado personal.</p></div><div class=\"container mx-auto px-4\"><div class=\"grid grid-cols-1 md:grid-cols-3 gap-8\"><div><lib-ui-components-card [variant]=\"variant\" [image]=\"services[0].image\" size=\"medium\" animation=\"zoom\" [title]=\"services[0].title\" [description]=\"services[0].description\" [actions]=\"[{ label: 'Reservar Ahora', href: '#reservas' }]\" ></lib-ui-components-card></div></div></div></section>",
  styles: [ ".container { max-width: 1200px; } @media (max-width: 768px) { .container { padding: 0 1rem; } }" ]
  ,
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