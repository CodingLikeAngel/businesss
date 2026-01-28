import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants } from '../../models/ui-components-data.model';

export const tabs3Variants = variants;
export type Tabs3VariantType = typeof tabs3Variants[number];

export interface Tabs3CustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

export interface Tabs3Tab {
  id: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'lib-ui-components-tabs-3',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs-3.component.html',
  styleUrl: './tabs-3.component.scss',
})
export class UITabs3Component {
  variant = input<Tabs3VariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  tabs = input<Tabs3Tab[]>([]);
  activeTab = input<string>('');
  customStyles = input<Tabs3CustomStyles>({});

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
    const classes = ['tabs-3', `tabs-3-${this.variant()}`];
    classes.push(`tabs-3-rounded-${this.rounded()}`);
    classes.push(`tabs-3-${this.size()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });

  tabClasses = computed(() => {
    return (tab: Tabs3Tab) => {
      const classes = ['tabs-3-tab'];
      classes.push(`tabs-3-tab-${this.size()}`);
      if (tab.id === this.activeTab()) classes.push('active');
      if (tab.disabled) classes.push('disabled');
      return classes.join(' ');
    };
  });
}
