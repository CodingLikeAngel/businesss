
import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UITitleComponent } from '@negocio/ui-components';
import { applySectionStyles } from '../utils/section-styles.util';
import type { CustomStyles } from '../models/custom-styles.interface';

export interface Step {
  title: string;
  description: string;
  icon?: string; 
  image?: string;
  state?: 'completed' | 'current' | 'pending';
  tooltip?: string;
  expanded?: boolean;
  children?: Step[];
}

@Component({
  selector: 'lib-ui-steps-section',
  standalone: true,
  imports: [CommonModule, UITitleComponent],
  templateUrl: './steps-section.component.html',
  styleUrls: ['./steps-section.component.scss']
})
export class UIStepsSectionComponent {
  title = input('Cómo Funciona');
  subtitle = input('Sigue estos sencillos pasos');
  steps = input<Step[]>([]);
  variant = input('linear');
  customStyles = input<CustomStyles>({});

  stepsStyles = computed(() => applySectionStyles(this.customStyles()));

  getAriaCurrent(index: number): string | null {
    const steps = this.steps();
    const step = steps[index];
    if (step.state === 'current') {
      return 'step';
    }
    return null;
  }
}

