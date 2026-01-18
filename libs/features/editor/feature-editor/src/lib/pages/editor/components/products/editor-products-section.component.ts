import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  ProductsConfig,
  TitleConfig,
  ApplyDynamicStylesDirective,
  VisualEditableDirective
} from '@negocio/shared-components';
import { 
  UITitleComponent, 
  UICardComponent,
  UICardAnimatedComponent,
  UiCardProductsComponent
} from '@negocio/ui-components';
import { BaseEditorSectionComponent } from '../base-editor-section.component';

@Component({
  selector: 'lib-editor-products-section',
  standalone: true,
  imports: [
    CommonModule,
    UITitleComponent,
    UICardComponent,
    UICardAnimatedComponent,
    UiCardProductsComponent,
    ApplyDynamicStylesDirective,
    VisualEditableDirective
  ],
  templateUrl: './editor-products-section.component.html'
})
export class EditorProductsSectionComponent extends BaseEditorSectionComponent {
  @Input() productsConfig!: ProductsConfig;
  @Input() titleConfig!: TitleConfig;

  trackByProductName(index: number, product: any): string {
    return product.name;
  }
}
