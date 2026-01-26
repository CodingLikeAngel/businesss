import { Component, Input, OnInit, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-draggable-box',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="box-container" [ngClass]="['box--' + variant]">
      <span class="box-label">{{ label }}</span>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .box-container {
      padding: 1.5rem;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 100px;
      min-height: 100px;
      cursor: move;
      transition: transform 0.2s, box-shadow 0.2s;
      user-select: none;
    }
    .box-label {
      font-weight: 700;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
    }
    .box--default { background: #f3f4f6; color: #1f2937; border: 1px solid #d1d5db; }
    .box--glass { background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); color: white; border: 1px solid rgba(255,255,255,0.2); }
    .box--neon { background: rgba(0,0,0,0.8); color: #00f2ff; border: 2px solid #00f2ff; box-shadow: 0 0 15px rgba(0,242,255,0.5); }
    .box--minimal { background: white; color: black; border: 1px solid #eeeeee; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
  `]
})
export class DraggableBoxComponent implements OnInit {
  @Input() variant: string = 'default';
  @Input() label: string = 'Draggable';

  constructor() {}

  ngOnInit() {}
}
