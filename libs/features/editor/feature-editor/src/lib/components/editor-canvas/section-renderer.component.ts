import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Section } from '../../models/editor.model';

@Component({
  selector: 'lib-section-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section-renderer">
      <div class="section-header">
        <h3>{{ section?.name || section?.type }}</h3>
        <span class="section-type">{{ section?.type }}</span>
      </div>
      <div class="section-content">
        <p>Section content will be rendered here based on type: {{ section?.type }}</p>
        <div class="elements-preview" *ngIf="section?.elements?.length">
          <small>{{ section?.elements?.length }} elements</small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .section-renderer {
      padding: 20px;
      min-height: 100px;
      border: 1px solid #e9ecef;
      border-radius: 4px;
      background: white;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #f8f9fa;
    }

    .section-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #495057;
    }

    .section-type {
      background: #e9ecef;
      color: #6c757d;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      text-transform: uppercase;
    }

    .section-content {
      color: #6c757d;
    }

    .elements-preview {
      margin-top: 10px;
      padding: 5px 10px;
      background: #f8f9fa;
      border-radius: 4px;
      display: inline-block;
    }
  `]
})
export class SectionRendererComponent {
  @Input() section?: Section;
  @Input() isSelected = false;
  @Input() devicePreview: 'mobile' | 'tablet' | 'desktop' = 'desktop';

  @Output() elementSelect = new EventEmitter<string>();
  @Output() elementHover = new EventEmitter<string | null>();
}