import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  UIFooterComponent,
  UIHeaderComponent,
  UINavBarComponent,
} from '@negocio/ui-components';
import { VariantSelectorComponent } from '@negocio/shared-components';
import { CommonModule } from '@angular/common';
import { MainLayoutBaseComponent } from '../main-layout-base.component';


@Component({
  selector: 'lib-main-mobile-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UIHeaderComponent,
    VariantSelectorComponent,
    UIFooterComponent,
    UINavBarComponent,
  ],
  templateUrl: './main-mobile-layout.component.html',
  styleUrl: './main-mobile-layout.component.scss',
})
export class MainMobileLayoutComponent extends MainLayoutBaseComponent {
  activeTab: 'configurator' | 'content' = 'content';



  switchTab(tab: 'configurator' | 'content') {
    this.activeTab = tab;
  }

  returnToEditor() {
    this.variantService.setBuilderStep('editor');
  }
}