import { Injectable } from '@angular/core';
import { VariantService } from '../../../services/variant.service';

@Injectable({
  providedIn: 'root'
})
export class DragDropService {
  draggedSectionIndex: number | null = null;
  overSectionIndex: number | null = null;

  constructor(private variantService: VariantService) {}

  onDragStart(index: number) {
    this.draggedSectionIndex = index;
  }

  onDragOver(event: DragEvent, index: number) {
    event.preventDefault();
    this.overSectionIndex = index;
  }

  onDragEnd(sections: any[]) {
    if (this.draggedSectionIndex !== null && this.overSectionIndex !== null && this.draggedSectionIndex !== this.overSectionIndex) {
      const newSections = [...sections];
      const movedItem = newSections.splice(this.draggedSectionIndex, 1)[0];
      newSections.splice(this.overSectionIndex, 0, movedItem);
      this.variantService.setSections(newSections);
    }
    this.draggedSectionIndex = null;
    this.overSectionIndex = null;
  }

  moveSection(sections: any[], index: number, direction: 'up' | 'down') {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sections.length - 1) return;

    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];

    this.variantService.setSections(newSections);
  }
}