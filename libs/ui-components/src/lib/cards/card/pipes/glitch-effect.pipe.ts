import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'glitchEffect', standalone: true })
export class GlitchEffectPipe implements PipeTransform {
  transform(value: string): string {
    return `<span class="glitch-text" data-text="${value}">${value}</span>`;
  }
}