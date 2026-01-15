import { Component, OnInit, Inject, PLATFORM_ID, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { EditorService } from '../../../../index';
import { BaseEditorFeatureComponent } from '../base-editor-feature.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import {
  UIHeroSectionComponent,
  UIModalComponent,
  UICardRutasComponent,
  BubbleAnimationComponent,
  UITitleComponent,
  UiCardProductsComponent,
  UICardAnimatedComponent,
  UICardComponent,
  UINavBarComponent,
  UIFeaturesSectionComponent,
  UIStatsLibSectionComponent,
  UITestimonialsSectionComponent,
  UIFaqSectionComponent,
  UIGallerySectionComponent,
  UIPricingTableSectionComponent,
  UITabsComponent
} from '@negocio/ui-components';
import { Product, Testimonial, PageSection, VariantService } from '@negocio/shared-components';
import { PromotionsSectionComponent } from '../../../components/promotions-section/promotions-section.component';
import { ReservationFormComponent } from '../../../components/reservation-form/reservation-form.component';

@Component({
  selector: 'lib-editor-desktop-feature',
  standalone: true,
  templateUrl: './editor-feature.component.html',
  styleUrls: ['./editor-feature.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    UIHeroSectionComponent,
    ReservationFormComponent,
    PromotionsSectionComponent,
    UIModalComponent,
    UICardRutasComponent,
    BubbleAnimationComponent,
    UITitleComponent,
    UiCardProductsComponent,
    UICardAnimatedComponent,
    UICardComponent,
    UIFeaturesSectionComponent,
    UIStatsLibSectionComponent,
    UITestimonialsSectionComponent,
    UIFaqSectionComponent,
    UIGallerySectionComponent,
    UIPricingTableSectionComponent,
    UITabsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EditorDesktopFeatureComponent extends BaseEditorFeatureComponent implements OnInit {
  sections$: Observable<PageSection[]>;

  constructor(
    @Inject(PLATFORM_ID) protected override platformId: object,
    protected override variantService: VariantService,
    protected override router: Router,
    protected override route: ActivatedRoute
  ) {
    super(platformId, variantService, router, route);
    this.sections$ = this.variantService.sections$;
  }

  override ngOnInit() {
    super.ngOnInit();
    inject(EditorService).updateEditorState({ isMobile: false });
  }

  onTabSelected(sectionId: string) {
    this.scrollToSection(sectionId);
  }

  onNavItemClick(sectionId: string) {
    this.scrollToSection(sectionId);
  }

  scrollToSection(sectionId: string) {
    if (typeof document !== 'undefined') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  trackBySectionId(index: number, section: PageSection): string {
    return section.id;
  }
}

