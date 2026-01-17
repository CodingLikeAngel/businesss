
import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Step {
  title: string;
  description: string;
  icon?: string; 
  image?: string;
}

@Component({
  selector: 'lib-ui-steps-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './steps-section.component.html',
  styleUrls: ['./steps-section.component.scss']
})
export class UIStepsSectionComponent {
  title = input('Cómo Funciona');
  subtitle = input('Sigue estos sencillos pasos');
  steps = input<Step[]>([]);
  variant = input('linear');
  customStyles = input<{[key: string]: string}>({});

  stepsStyles = computed(() => {
    const styles: any = { ...this.customStyles() };
    if (styles['backgroundColor']) {
      styles['--theme-bg'] = styles['backgroundColor'];
    }
    if (styles['color']) {
      styles['--theme-color'] = styles['color'];
    }
    return styles;
  });
}

