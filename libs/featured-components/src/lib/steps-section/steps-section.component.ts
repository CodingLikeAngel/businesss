
import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

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

export interface StepsCustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
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
  customStyles = input<StepsCustomStyles>({});
  
  stepsStyles = computed(() => {
    const styles: Record<string, any> = {};
    const customStyles = this.customStyles();
    
    if (customStyles['backgroundColor']) {
      styles['--theme-bg'] = customStyles['backgroundColor'];
      styles['--component-bg'] = customStyles['backgroundColor'];
      styles['background'] = customStyles['backgroundColor'];
      styles['background-color'] = customStyles['backgroundColor'];
    }
    
    if (customStyles['color']) {
      styles['--theme-color'] = customStyles['color'];
      styles['--component-text'] = customStyles['color'];
      styles['color'] = customStyles['color'];
    }
    
    Object.keys(customStyles).forEach(key => {
      if (key !== 'backgroundColor' && key !== 'color') {
        styles[key] = customStyles[key];
      }
    });
    
    return styles;
  });

  getAriaCurrent(index: number): string | null {
    const steps = this.steps();
    const step = steps[index];
    if (step.state === 'current') {
      return 'step';
    }
    return null;
  }
}

