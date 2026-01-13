import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UICardAnimatedComponent, UICardPremiumComponent, UICardComponent, UIChipComponent, UIButtonComponent, UITableComponent, UIHeaderComponent, BubbleAnimationComponent, UITabsComponent } from '@negocio/ui-components';
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
    BubbleAnimationComponent,
    UITabsComponent
  ],
  templateUrl: './feature-about-page.component.html',
  styleUrls: ['./feature-about-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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