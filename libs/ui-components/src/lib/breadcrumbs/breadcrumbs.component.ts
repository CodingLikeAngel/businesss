import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { mergeCustomStyles } from '../models/merge-custom-styles.util';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

export interface BreadcrumbsCustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-breadcrumbs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UIBreadcrumbsComponent {
  items = input<BreadcrumbItem[]>([]);
  separator = input('/');
  variant = input('simple');
  customStyles = input<BreadcrumbsCustomStyles>({});

  breadcrumbStyles = computed(() => mergeCustomStyles(this.customStyles(), 'breadcrumb'));
}

