import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  BubbleAnimationComponent,
  ForestAnimationComponent,
  UIHeaderComponent,
  UITitleComponent,
} from '@negocio/ui-components';

import { RouterModule } from '@angular/router';
import { FeatureContactBasePageComponent } from '../feature-contact-base-page';
import { ContactFormComponent } from '../../../components/contact-form/contact-form.component';

@Component({
  selector: 'lib-feature-contact-mobile-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BubbleAnimationComponent,
    ForestAnimationComponent,
    UITitleComponent,
    ContactFormComponent,
    UIHeaderComponent
  ],
  templateUrl: './feature-contact-mobile-page.component.html',
  styleUrl: './feature-contact-mobile-page.component.scss',
})
export class FeatureContactMobilePageComponent extends FeatureContactBasePageComponent {}