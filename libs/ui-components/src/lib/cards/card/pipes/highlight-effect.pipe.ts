import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'highlightEffect', standalone: true })
export class HighlightEffectPipe implements PipeTransform {
  transform(value: string): string {
    return `<span class="highlight-text">${value}</span>`;
  }
}