import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UICardAnimatedComponent, UICardPremiumComponent, UICardComponent, UIChipComponent, UIButtonComponent, UITableComponent, UIHeaderComponent, BubbleAnimationComponent } from '@negocio/ui-components';
import { BaseFeatureAboutPageComponent } from '../../base-feature-about-page.component';


@Component({
selector: 'lib-mobile-feature-about-page',
standalone: true,
imports: [
  CommonModule,
  UICardAnimatedComponent,
  UICardPremiumComponent,
  UICardComponent,
  UIChipComponent,
  UIButtonComponent,
  UITableComponent,
  UIHeaderComponent,
  BubbleAnimationComponent
],
templateUrl: './feature-about-page.component.html',
styleUrls: ['./feature-about-page.component.scss'],

})
export class MobileFeatureAboutPageComponent extends BaseFeatureAboutPageComponent {
isMobile = true;
onTabSelected(sectionId: string) {
    this.scrollToSection(sectionId);
  }

  onNavItemClick(sectionId: string) {
    this.scrollToSection(sectionId);
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}