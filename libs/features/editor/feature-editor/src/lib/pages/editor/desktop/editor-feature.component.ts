import { Component, OnInit, Inject, PLATFORM_ID, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { EditorService } from '../../../../index';
import { BaseEditorFeatureComponent } from '../base-editor-feature.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import {
  UIHeaderComponent,
  UIFooterComponent,
  UIModalComponent,
  BubbleAnimationComponent,
  UITitleComponent,
  UiCardProductsComponent,
  UICardAnimatedComponent,
  UICardComponent,
  UINavBarComponent,
  UIPricingTableSectionComponent,
  UITabsComponent,
  UIAccordionComponent,
  UIImageComponent,
  UiTestimonialsCardComponent,
  UIListComponent,
  UINewsletterSectionComponent,
  UIStepsSectionComponent,
  UIBreadcrumbsComponent,
  UISpinnerComponent,
  UIChartComponent,
  UIGamingVariantsShowcaseComponent
} from '@negocio/ui-components';
import { 
  Product, 
  Testimonial, 
  PageSection, 
  VariantService,
  ApplyDynamicStylesDirective,
  VisualEditableDirective,
  VisualEditorService
} from '@negocio/shared-components';
import { ReservationFormComponent } from '../../../components/reservation-form/reservation-form.component';

@Component({
  selector: 'lib-editor-desktop-feature',
  standalone: true,
  templateUrl: './editor-feature.component.html',
  styleUrls: ['./editor-feature.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    ReservationFormComponent,
    UIHeaderComponent,
    UIModalComponent,
    BubbleAnimationComponent,
    UITitleComponent,
    UiCardProductsComponent,
    UICardAnimatedComponent,
    UICardComponent,
    UIFooterComponent,
    UIPricingTableSectionComponent,
    UITabsComponent,
    UIAccordionComponent,
    UIImageComponent,
    UiTestimonialsCardComponent,
    UIListComponent,
    UINewsletterSectionComponent,
    UIStepsSectionComponent,
    UIBreadcrumbsComponent,
    UISpinnerComponent,
    UIChartComponent,
    UIGamingVariantsShowcaseComponent,
    ApplyDynamicStylesDirective,
    VisualEditableDirective
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [VisualEditorService]
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

  onSectionResized(section: PageSection, bounds: any) {
    console.log('📏 Section resized:', section.id, bounds);

    // Update section styles with new height
    const updatedSection = {
      ...section,
      styles: {
        ...section.styles,
        minHeight: `${bounds.height}px`,
        height: `${bounds.height}px`
      }
    };

    // Update in service
    this.variantService.updateSectionInCurrentPage(section.id, updatedSection);
  }

  onElementMoved(bounds: any, elementId: string) {
    console.log('📍 Element moved:', elementId, bounds);
    // TODO: Implement element position persistence
  }

  onElementResized(bounds: any, elementId: string) {
    console.log('📐 Element resized:', elementId, bounds);
    // TODO: Implement element size persistence
  }
}

