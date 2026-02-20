import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplyDynamicStylesDirective } from '@negocio/shared-components';
import { BaseEditorSectionComponent } from '../base-editor-section.component';
import { EditorSectionChromeComponent } from '../editor-section-chrome/editor-section-chrome.component';

/**
 * Vista de edición para cualquier tipo de sección no mapeado a un editor específico.
 * Muestra una vista real del contenido (título, subtítulo, texto, items) con el mismo
 * chrome que el resto de secciones; no muestra mensaje de "sin vista".
 */
@Component({
  selector: 'lib-editor-fallback-section',
  standalone: true,
  imports: [
    CommonModule,
    ApplyDynamicStylesDirective,
    EditorSectionChromeComponent
  ],
  template: `
    <section
      [id]="section.id"
      class="editor-section editor-fallback-section cursor-pointer transition-all duration-500 relative py-10 px-6"
      [class.preview-mode]="isPreviewMode && !showEditorControls"
      [class.is-selected]="selectedSectionId === section.id"
      (click)="selectSection($event, section)"
      [applyDynamicStyles]="section?.styles || {}"
    >
      <lib-editor-section-chrome
        [sectionLabel]="section?.label || section?.type || 'Bloque'"
        sectionIcon="📦"
        [isPreviewMode]="isPreviewMode"
        [showEditorControls]="showEditorControls"
        editButtonTitle="Editar en panel lateral"
        (togglePreview)="toggleEditorControlsInPreview()">
      </lib-editor-section-chrome>

      <div class="fallback-content max-w-4xl mx-auto space-y-6">
        <h2 *ngIf="getSectionContent('title', '')" class="text-2xl font-bold text-white">
          {{ getSectionContent('title', '') }}
        </h2>
        <p *ngIf="getSectionContent('subtitle', '')" class="text-lg text-white/80">
          {{ getSectionContent('subtitle', '') }}
        </p>
        <p *ngIf="getSectionContent('description', '') || getSectionContent('text', '')" class="text-white/70 leading-relaxed">
          {{ getSectionContent('description', '') || getSectionContent('text', '') }}
        </p>

        <ul *ngIf="items.length" class="space-y-2 list-disc list-inside text-white/80">
          <li *ngFor="let item of items; let i = index; trackBy: trackByIndex">
            <ng-container *ngIf="typeof item === 'string'">{{ item }}</ng-container>
            <ng-container *ngIf="typeof item === 'object' && item !== null">
              {{ item.title || item.label || item.text || item.name || ('Item ' + (i + 1)) }}
            </ng-container>
          </li>
        </ul>

        <div *ngIf="!hasAnyContent" class="text-white/50 text-center py-8 rounded-xl border border-dashed border-white/20">
          <span class="text-4xl">📦</span>
          <p class="mt-2 text-sm">Tipo: {{ section?.type }}</p>
          <p class="text-xs mt-1">Edita desde la pestaña Redacción o Estilo del panel.</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .editor-fallback-section .fallback-content h2 { margin-bottom: 0.5rem; }
    .editor-fallback-section .fallback-content p { margin-bottom: 0; }
  `]
})
export class EditorFallbackSectionComponent extends BaseEditorSectionComponent {
  get items(): any[] {
    const raw = this.section?.content?.['items'];
    if (Array.isArray(raw)) return raw;
    return [];
  }

  get hasAnyContent(): boolean {
    const c = this.section?.content;
    if (!c) return false;
    const hasText = (c['title'] || c['subtitle'] || c['description'] || c['text']) ? true : false;
    return hasText || this.items.length > 0;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
