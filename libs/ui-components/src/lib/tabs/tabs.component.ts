import { Component, Output, EventEmitter, OnInit, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants as baseVariants } from '../models/ui-components-data.model';

// Variante específica del componente hijo
const specificTabsVariants = ['pixel-adventure'] as const;

// Combinamos variantes globales con específicas
export const tabsVariants = [...baseVariants, ...specificTabsVariants] as const;
export type TabsVariantType = typeof tabsVariants[number] | (string & {});

interface Tab {
  label: string;
  sectionId: string;
  icon?: string;
  active?: boolean;
}

export interface TabsCustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class UITabsComponent implements OnInit {
  variant = input<TabsVariantType>('secondary');
  tabs = input<Tab[]>([
    { label: 'Inicio', sectionId: 'home', icon: '🏠', active: true },
    { label: 'Pesca', sectionId: 'pesca', icon: '🎣' },
    { label: 'Senderismo', sectionId: 'senderismo', icon: '🏞️' },
    { label: 'Foro', sectionId: 'foro', icon: '💬' },
    { label: 'Contacto', sectionId: 'contacto', icon: '✉️' },
  ]);
  showAs = input<'menu' | 'tabs'>('tabs'); // Controla si se muestra como menú o pestañas
  isMobile = input<boolean>(false); // Recibe si es móvil desde el padre
  customStyles = input<TabsCustomStyles>({});
  
  @Output() tabSelected = new EventEmitter<string>();

  activeTabId: string | null = null;

  ngOnInit() {
    const activeTab = this.tabs().find(tab => tab.active);
    this.activeTabId = activeTab ? activeTab.sectionId : this.tabs()[0]?.sectionId;
  }

  selectTab(sectionId: string) {
    this.activeTabId = sectionId;
    this.tabSelected.emit(sectionId);
    this.scrollToSection(sectionId);
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

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
    return [
      'tabs',
      `variant-${this.variant()}`,
      this.showAs() === 'menu' && this.isMobile() ? 'tabs--mobile' : '',
    ].filter(Boolean);
  });
}
