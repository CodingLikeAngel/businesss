
import { Component, Input } from '@angular/core';
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
  @Input() title = 'Cómo Funciona';
  @Input() subtitle = 'Sigue estos sencillos pasos';
  @Input() steps: Step[] = [];
  @Input() variant: 'linear' | 'cards' | 'zigzag' | 'timeline' = 'linear';
}

