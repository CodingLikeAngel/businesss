import { Component, OnInit, Inject, PLATFORM_ID, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { EditorService } from '../../../../index';
import { BaseEditorFeatureComponent } from '../base-editor-feature.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import {
  UIHeaderComponent,
  UIFooterComponent,
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
  UITabsComponent,
  UIAccordionComponent,
  UIImageComponent,
  UiTestimonialsCardComponent,
  UIListComponent,
  UINewsletterSectionComponent,
  UIStepsSectionComponent,
  UITableComponent,
  UIBreadcrumbsComponent,
  UIChipComponent,
  UISpinnerComponent,
  UITooltipComponent,
  UIChartComponent,
  UIGamingVariantsShowcaseComponent
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
    UIHeaderComponent,
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
    UIFooterComponent,
    UIFaqSectionComponent,
    UIGallerySectionComponent,
    UIPricingTableSectionComponent,
    UITabsComponent,
    UIAccordionComponent,
    UIImageComponent,
    UiTestimonialsCardComponent,
    UIListComponent,
    UINewsletterSectionComponent,
    UIStepsSectionComponent,
    UITableComponent,
    UIBreadcrumbsComponent,
    UIChipComponent,
    UISpinnerComponent,
    UITooltipComponent,
    UIChartComponent,
    UIGamingVariantsShowcaseComponent
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
    this.editorService.updateEditorState({ isMobile: false });
  }

  onTabSelected(sectionId: string) {
    this.scrollToSection(sectionId);
  }

  onNavItemClick(sectionId: string) {
    this.scrollToSection(sectionId);
  }

  scrollToSection(sectionId: string) {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  getMergedElement(sectionId: string, elementId: string, item: any, type: string = 'element'): any {
    return {
      id: elementId,
      sectionId: sectionId,
      ...item,
      _original: item,
      type
    };
  }
}

