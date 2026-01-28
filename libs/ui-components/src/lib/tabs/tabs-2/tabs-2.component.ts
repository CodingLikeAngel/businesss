import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants } from '../../models/ui-components-data.model';

export const tabs2Variants = variants;
export type Tabs2VariantType = typeof tabs2Variants[number];

export interface Tabs2CustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

export interface Tabs2Tab {
  id: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'lib-ui-components-tabs-2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs-2.component.html',
  styleUrl: './tabs-2.component.scss',
})
export class UITabs2Component {
  variant = input<Tabs2VariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  tabs = input<Tabs2Tab[]>([]);
  activeTab = input<string>('');
  customStyles = input<Tabs2CustomStyles>({});

  tabsStyles = computed(() => {
    const styles: Record<string, any> = {};
    const customStyles = this.customStyles();
    
    if (customStyles['backgroundColor']) {
      styles['--theme-bg'] = customStyles['backgroundColor'];
      styles['--component-bg'] = customStyles['backgroundColor'];
      styles['background'] = customStyles['backgroundColor'];
      styles['background-color'] = customStyles['backgroundColor'];
    }
    
    if (customStyles['color']) {
      styles['--theme-color'] = customStyles['color'];
      styles['--component-text'] = customStyles['color'];
      styles['color'] = customStyles['color'];
    }
    
    Object.keys(customStyles).forEach(key => {
      if (key !== 'backgroundColor' && key !== 'color') {
        styles[key] = customStyles[key];
      }
    });

    return styles;
  });

  tabsClasses = computed(() => {
    const classes = ['tabs-2', `tabs-2-${this.variant()}`];
    classes.push(`tabs-2-rounded-${this.rounded()}`);
    classes.push(`tabs-2-${this.size()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });

  tabClasses = computed(() => {
    return (tab: Tabs2Tab) => {
      const classes = ['tabs-2-tab'];
      classes.push(`tabs-2-tab-${this.size()}`);
      if (tab.id === this.activeTab()) classes.push('active');
      if (tab.disabled) classes.push('disabled');
      return classes.join(' ');
    };
  });
}
