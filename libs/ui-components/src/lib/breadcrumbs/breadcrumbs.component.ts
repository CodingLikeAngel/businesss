
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

@Component({
  selector: 'lib-ui-components-breadcrumbs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class UIBreadcrumbsComponent {
  @Input() items: BreadcrumbItem[] = [];
  @Input() separator = '/';
  @Input() variant: 'simple' | 'glass' | 'pill' = 'simple';
}
