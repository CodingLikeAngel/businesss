import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomStyles } from '../models/custom-styles.interface';
import { UICardComponent } from '../cards/card/card.component';
import { UIChipComponent } from '../chip/chip.component';
import { UITooltipComponent } from '../tooltip/tooltip.component';

@Component({
  selector: 'lib-service-section',
  standalone: true,
  imports: [CommonModule, UICardComponent, UIChipComponent, UITooltipComponent],
  templateUrl: './service-section.component.html',
  styleUrls: ['./service-section.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ServiceSectionComponent {
  @Input() variant: string = 'default';
  @Input() customStyles: CustomStyles = {};
  @Output() reserve = new EventEmitter<void>();

  get componentStyles() {
    const styles: Record<string, any> = {};

    if (this.customStyles['backgroundColor']) {
      styles['--theme-bg'] = this.customStyles['backgroundColor'];
      styles['--component-bg'] = this.customStyles['backgroundColor'];
      styles['background'] = this.customStyles['backgroundColor'];
      styles['background-color'] = this.customStyles['backgroundColor'];
    }

    if (this.customStyles['color']) {
      styles['--theme-color'] = this.customStyles['color'];
      styles['--component-text'] = this.customStyles['color'];
      styles['color'] = this.customStyles['color'];
    }

    Object.keys(this.customStyles).forEach(key => {
      if (key !== 'backgroundColor' && key !== 'color') {
        styles[key] = this.customStyles[key];
      }
    });

    return styles;
  }

  services = [
    {
      title: 'Corte Hombre',
      description: 'Cortes modernos y clásicos adaptados a tu personalidad.',
      image: 'https://dummyimage.com/200x300/000/fff&text=Hola+León',
      tooltip: 'Explora cortes modernos y clásicos.',
      styles: {},
      chips: [
        { label: 'Degradado', value: 'degradado' },
        { label: 'Clásico', value: 'clasico' },
        { label: 'Moderno', value: 'moderno' },
      ],
    },
    {
      title: 'Corte Mujer',
      description: 'Personaliza tu estilo con cortes únicos.',
       image: "https://dummyimage.com/200x300/000/fff&text=Hola+León2",
      tooltip: 'Personaliza tu estilo con cortes únicos.',
      styles: {},
      chips: [
        { label: 'Bob', value: 'bob' },
        { label: 'Largo', value: 'largo' },
        { label: 'Pixie', value: 'pixie' },
      ],
    },
    {
      title: 'Manicura',
      description: 'Diseños que destacan en cualquier aventura.',
       image: "https://dummyimage.com/200x300/000/fff&text=Hola+León3",
      tooltip: 'Diseños que destacan en cualquier ocasión.',
      styles: {},
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