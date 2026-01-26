import { Component, Input, OnInit, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SmartContainerConfig {
  width?: string;
  height?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  borderRadius?: string;
  border?: string;
  boxShadow?: string;
  padding?: string;
  margin?: string;
  display?: 'block' | 'flex' | 'grid';
  flexDirection?: 'row' | 'column';
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
  overflow?: string;
  position?: 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  zIndex?: number;
}

@Component({
  selector: 'lib-smart-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-content></ng-content>
  `,
  styles: [`
    :host {
      display: block;
      transition: all 0.2s ease-in-out;
      box-sizing: border-box;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmartContainerComponent implements OnInit {
  @Input() config: SmartContainerConfig = {};
  @Input() variant: string = 'default';
  @Input() customID: string = '';

  @HostBinding('class') get variantClass() {
    return `container--${this.variant}`;
  }

  @HostBinding('style.width') get width() { return this.config.width || '100%'; }
  @HostBinding('style.height') get height() { return this.config.height || 'auto'; }
  @HostBinding('style.backgroundColor') get backgroundColor() { return this.config.backgroundColor || 'transparent'; }
  @HostBinding('style.backgroundImage') get backgroundImage() { return this.config.backgroundImage ? `url(${this.config.backgroundImage})` : 'none'; }
  @HostBinding('style.borderRadius') get borderRadius() { return this.config.borderRadius || '0'; }
  @HostBinding('style.border') get border() { return this.config.border || 'none'; }
  @HostBinding('style.boxShadow') get boxShadow() { return this.config.boxShadow || 'none'; }
  @HostBinding('style.padding') get padding() { return this.config.padding || '0'; }
  @HostBinding('style.margin') get margin() { return this.config.margin || '0'; }
  @HostBinding('style.display') get display() { return this.config.display || 'block'; }
  @HostBinding('style.flexDirection') get flexDirection() { return this.config.flexDirection || 'row'; }
  @HostBinding('style.justifyContent') get justifyContent() { return this.config.justifyContent || 'flex-start'; }
  @HostBinding('style.alignItems') get alignItems() { return this.config.alignItems || 'stretch'; }
  @HostBinding('style.gap') get gap() { return this.config.gap || '0'; }
  @HostBinding('style.overflow') get overflow() { return this.config.overflow || 'visible'; }
  @HostBinding('style.position') get position() { return this.config.position || 'relative'; }
  @HostBinding('style.top') get top() { return this.config.top || 'auto'; }
  @HostBinding('style.left') get left() { return this.config.left || 'auto'; }
  @HostBinding('style.right') get right() { return this.config.right || 'auto'; }
  @HostBinding('style.bottom') get bottom() { return this.config.bottom || 'auto'; }
  @HostBinding('style.zIndex') get zIndex() { return this.config.zIndex || 'auto'; }

  @HostBinding('attr.id') get id() { return this.customID || null; }

  constructor() {}

  ngOnInit() {}
}
