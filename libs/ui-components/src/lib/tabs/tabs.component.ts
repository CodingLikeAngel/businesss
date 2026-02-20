import { Component, Output, EventEmitter, OnInit, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants as baseVariants } from '../models/ui-components-data.model';
import { mergeCustomStyles } from '../models/merge-custom-styles.util';

// Variante específica del componente hijo
const specificTabsVariants = ['pixel-adventure'] as const;

// Combinamos variantes globales con específicas
export const tabsVariants = [...baseVariants, ...specificTabsVariants] as const;
export type TabsVariantType = typeof tabsVariants[number] | (string & {});

export interface Tab {
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
  styleUrl: './tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  orientation = input<'horizontal' | 'vertical'>('horizontal'); // Controla la orientación de las pestañas
  lazyLoad = input<boolean>(false); // Controla si se carga el contenido de forma perezosa
  
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

  tabsStyles = computed(() => mergeCustomStyles(this.customStyles(), 'tabs'));

  tabsClasses = computed(() => {
    return [
      'tabs',
      `variant-${this.variant()}`,
      this.showAs() === 'menu' && this.isMobile() ? 'tabs--mobile' : '',
    ].filter(Boolean);
  });
}
