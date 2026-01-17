import { Component, OnInit, TrackByFunction, inject, Inject, PLATFORM_ID } from '@angular/core';
import { EditorService } from '../../../../index';
import { BaseEditorFeatureComponent } from '../base-editor-feature.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  BubbleAnimationComponent,
  UITitleComponent,
  UiTestimonialsCardComponent,
  UICardAnimatedComponent,
  UICardComponent,
  UINavBarComponent,
  UIAccordionComponent,
  UIImageComponent
} from '@negocio/ui-components';
import { Testimonial, PageSection, VariantService } from '@negocio/shared-components';
import { ReservationFormComponent } from '../../../components/reservation-form/reservation-form.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'lib-editor-mobile-feature',
  standalone: true,
  templateUrl: './editor-feature.component.html',
  styleUrls: ['./editor-feature.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    ReservationFormComponent,
    BubbleAnimationComponent,
    UITitleComponent,
    UiTestimonialsCardComponent,
    UICardAnimatedComponent,
    UICardComponent,
    UIAccordionComponent,
    UIImageComponent
  ],
})
export class EditorMobileFeatureComponent extends BaseEditorFeatureComponent implements OnInit {
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


  testimonials: Testimonial[] = [];


  override ngOnInit() {
    super.ngOnInit();
    this.editorService.updateEditorState({ isMobile: true });
    // Inicializar testimonials desde testimonialsConfig
    // this.testimonialsConfig$.subscribe((config: { items: Testimonial[]; }) => {
    //   this.testimonials = config.items;
    // });
  }


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
