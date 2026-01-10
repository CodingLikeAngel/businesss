import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  BubbleAnimationComponent,
  ForestAnimationComponent,
  UIHeaderComponent,
  UINavBarComponent,
  UITabsComponent,
  UITitleComponent,
} from '@negocio/ui-components';

import { RouterModule } from '@angular/router';
import { ContactFormComponent } from '../../../components/contact-form/contact-form.component';
import { FeatureContactBasePageComponent } from '../feature-contact-base-page';

@Component({
  selector: 'lib-feature-contact-desktop-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BubbleAnimationComponent,
    ForestAnimationComponent,
    UINavBarComponent,
    UITitleComponent,
    ContactFormComponent,
    UIHeaderComponent,
    UITabsComponent
  ],
  templateUrl: './feature-contact-desktop-page.component.html',
  styleUrl: './feature-contact-desktop-page.component.scss',
})
export class FeatureContactDesktopPageComponent extends FeatureContactBasePageComponent {}