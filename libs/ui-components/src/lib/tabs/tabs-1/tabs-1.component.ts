import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants } from '../../models/ui-components-data.model';

export const tabs1Variants = variants;
export type Tabs1VariantType = typeof tabs1Variants[number];

export interface Tabs1CustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

export interface Tabs1Tab {
  id: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'lib-ui-components-tabs-1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs-1.component.html',
  styleUrl: './tabs-1.component.scss',
})
export class UITabs1Component {
  variant = input<Tabs1VariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  tabs = input<Tabs1Tab[]>([]);
  activeTab = input<string>('');
  customStyles = input<Tabs1CustomStyles>({});

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
    const classes = ['tabs-1', `tabs-1-${this.variant()}`];
    classes.push(`tabs-1-rounded-${this.rounded()}`);
    classes.push(`tabs-1-${this.size()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });

  tabClasses = computed(() => {
    return (tab: Tabs1Tab) => {
      const classes = ['tabs-1-tab'];
      classes.push(`tabs-1-tab-${this.size()}`);
      if (tab.id === this.activeTab()) classes.push('active');
      if (tab.disabled) classes.push('disabled');
      return classes.join(' ');
    };
  });
}
