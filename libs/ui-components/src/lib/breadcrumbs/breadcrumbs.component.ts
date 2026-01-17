
import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

@Component({
  selector: 'lib-ui-breadcrumbs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class UIBreadcrumbsComponent {
  items = input<BreadcrumbItem[]>([]);
  separator = input('/');
  variant = input('simple');
  customStyles = input<{[key: string]: string}>({});

  breadcrumbStyles = computed(() => {
    const styles: any = { ...this.customStyles() };
    if (styles['backgroundColor']) {
      styles['--theme-bg'] = styles['backgroundColor'];
    }
    if (styles['color']) {
      styles['--theme-color'] = styles['color'];
    }
    return styles;
  });
}

