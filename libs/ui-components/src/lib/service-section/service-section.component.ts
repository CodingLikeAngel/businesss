import { Component, EventEmitter, Output, ViewEncapsulation, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomStyles } from '../models/custom-styles.interface';
import { UICardComponent } from '../cards/card/card.component';

export interface ServiceItem {
  title: string;
  description: string;
  image: string;
  tooltip?: string;
  styles?: { [key: string]: string };
  chips?: { label: string; value: string }[];
}

@Component({
  selector: 'lib-service-section',
  standalone: true,
  imports: [CommonModule, UICardComponent],
  templateUrl: './service-section.component.html',
  styleUrls: ['./service-section.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ServiceSectionComponent {
  variant = input<string>('default');
  customStyles = input<CustomStyles>({});
  
  title = input<string>('Nuestros Servicios');
  subtitle = input<string>('Descubre todos nuestros servicios de belleza y cuidado personal.');
  
  items = input<ServiceItem[]>([
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
  ]);

  @Output() reserve = new EventEmitter<void>();

  componentStyles = computed(() => {
    const styles: Record<string, any> = {};
    const config = this.customStyles();

    if (config['backgroundColor']) {
      styles['--theme-bg'] = config['backgroundColor'];
      styles['--component-bg'] = config['backgroundColor'];
      styles['background'] = config['backgroundColor'];
      styles['background-color'] = config['backgroundColor'];
    }

    if (config['color']) {
      styles['--theme-color'] = config['color'];
      styles['--component-text'] = config['color'];
      styles['color'] = config['color'];
    }

    Object.keys(config).forEach(key => {
      if (key !== 'backgroundColor' && key !== 'color') {
        styles[key] = config[key];
      }
    });

    return styles;
  });

  onReserve(): void {
    this.reserve.emit();
  }
}