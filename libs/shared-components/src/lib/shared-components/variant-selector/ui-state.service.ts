import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiStateService {
  activeTab: 'general' | 'structure' | 'explorer' | 'content' | 'design' | 'footer' = 'general';

  // Modal state
  showItemModal = false;
  modalItemType: 'service' | 'product' | 'testimonial' | 'faq' | 'gallery' | 'pricing' | 'promotion' | 'navItem' | 'navLink' | 'footerLink' | 'socialIcon' | null = null;
  editingItem: any = null;
  editingIndex: number = -1;

  // Selection state (Global)
  private _selectedSection = new BehaviorSubject<any>(null);
  selectedSection$ = this._selectedSection.asObservable();

  private _selectedElement = new BehaviorSubject<any>(null);
  selectedElement$ = this._selectedElement.asObservable();

  get selectedSection() { return this._selectedSection.value; }
  get selectedElement() { return this._selectedElement.value; }

  selectSection(section: any) {
    const normalized = this.normalizeSection(section);
    this._selectedSection.next(normalized);
    this._selectedElement.next(null);
    if (this.activeTab !== 'content' && this.activeTab !== 'design') {
      this.activeTab = 'content';
    }
  }

  selectElement(element: any) {
    const normalized = this.normalizeElement(element);
    this._selectedElement.next(normalized);
    this._selectedSection.next(null);
    if (this.activeTab !== 'content' && this.activeTab !== 'design') {
      this.activeTab = 'content';
    }
  }

  private normalizeSection(section: any) {
    if (!section) return null;
    const sectionCopy = {
      ...section,
      content: { ...(section.content || {}) },
      styles: { ...(section.styles || {}) }
    };
    
    // Ensure common fields for color inputs (preventing "" error)
    if (!sectionCopy.styles.backgroundColor) sectionCopy.styles.backgroundColor = '#111111';
    if (!sectionCopy.styles.color) sectionCopy.styles.color = '#ffffff';

    // Ensure common content keys exist for the editor inputs
    const commonKeys = ['title', 'subtitle', 'description', 'text', 'link', 'image'];
    commonKeys.forEach(key => {
      if (sectionCopy.content[key] === undefined) {
         sectionCopy.content[key] = '';
      }
    });

    return sectionCopy;
  }

  private normalizeElement(element: any) {
    if (!element) return null;
    
    // Create a copy and ensure content/styles objects exist
    const elementCopy = {
      ...element,
      _original: element,
      content: { ...(element.content || {}) },
      styles: { ...(element.styles || {}) }
    };

    // Mapping for common library items (Product, Testimonial, Stat, Route, etc.) to standard editor content
    if (element.name && !elementCopy.content.title) elementCopy.content.title = element.name;
    if (element.routeName && !elementCopy.content.title) elementCopy.content.title = element.routeName;
    if (element.label && !elementCopy.content.title) elementCopy.content.title = element.label;
    if (element.author && !elementCopy.content.title) elementCopy.content.title = element.author;

    if (element.description && !elementCopy.content.description) {
      elementCopy.content.description = element.description;
      elementCopy.content.text = element.description; // fallback
    }
    if (element.quote && !elementCopy.content.description) elementCopy.content.description = element.quote;
    
    if (element.value !== undefined && !elementCopy.content.subtitle) elementCopy.content.subtitle = String(element.value);
    if (element.icon && !elementCopy.content.subtitle && !element.value) elementCopy.content.subtitle = element.icon;

    if (element.image && !elementCopy.content.image) elementCopy.content.image = element.image;
    if (element.imageUrl && !elementCopy.content.image) elementCopy.content.image = element.imageUrl;
    
    if (element.price && !elementCopy.content.label) elementCopy.content.label = element.price;
    if (element.link && !elementCopy.content.link) elementCopy.content.link = element.link;

    // Ensure common fields for color inputs
    if (!elementCopy.styles.backgroundColor) elementCopy.styles.backgroundColor = '#000000';
    if (!elementCopy.styles.color) elementCopy.styles.color = '#ffffff';

    // Ensure standard keys exist to show inputs in ContentEditor
    const commonKeys = ['title', 'subtitle', 'description', 'text', 'link', 'image', 'label'];
    commonKeys.forEach(key => {
      if (elementCopy.content[key] === undefined) {
         elementCopy.content[key] = '';
      }
    });

    return elementCopy;
  }

  // Config visibility toggles
  showHeaderConfig = false;
  showFooterConfig = false;
  showNavBarConfig = false;
  showHeroConfig = false;
  showBubbleConfig = false;
  showCardConfig = false;
  showTitleConfig = false;
  showFaqConfig = false;
  showPricingConfig = false;
  showPromotionsConfig = false;
  showGalleryConfig = false;
  showProductsConfig = false;

  setActiveTab(tab: 'general' | 'structure' | 'explorer' | 'content' | 'design' | 'footer') {
    this.activeTab = tab;
  }

  openAddModal(type: 'service' | 'product' | 'testimonial' | 'faq' | 'gallery' | 'pricing' | 'promotion' | 'navItem' | 'navLink' | 'footerLink' | 'socialIcon', getEmptyItem: (type: string) => any) {
    this.modalItemType = type;
    this.editingItem = getEmptyItem(type);
    this.editingIndex = -1;
    this.showItemModal = true;
  }

  openEditModal(type: 'service' | 'product' | 'testimonial' | 'faq' | 'gallery' | 'pricing' | 'promotion' | 'navItem' | 'navLink' | 'footerLink' | 'socialIcon', item: any, index: number) {
    this.modalItemType = type;
    this.editingItem = { ...item };
    this.editingIndex = index;
    this.showItemModal = true;
  }

  closeItemModal() {
    this.showItemModal = false;
    this.editingItem = null;
    this.modalItemType = null;
  }

  toggleHeaderConfig() {
    this.showHeaderConfig = !this.showHeaderConfig;
  }

  toggleFooterConfig() {
    this.showFooterConfig = !this.showFooterConfig;
  }

  toggleNavBarConfig() {
    this.showNavBarConfig = !this.showNavBarConfig;
  }

  toggleHeroConfig() {
    this.showHeroConfig = !this.showHeroConfig;
  }

  toggleBubbleConfig() {
    this.showBubbleConfig = !this.showBubbleConfig;
  }

  toggleCardConfig() {
    this.showCardConfig = !this.showCardConfig;
  }

  toggleTitleConfig() {
    this.showTitleConfig = !this.showTitleConfig;
  }

  toggleFaqConfig() {
    this.showFaqConfig = !this.showFaqConfig;
  }

  togglePricingConfig() {
    this.showPricingConfig = !this.showPricingConfig;
  }

  togglePromotionsConfig() {
    this.showPromotionsConfig = !this.showPromotionsConfig;
  }

  toggleGalleryConfig() {
    this.showGalleryConfig = !this.showGalleryConfig;
  }

  toggleProductsConfig() {
    this.showProductsConfig = !this.showProductsConfig;
  }

  onKeyUpToggle(event: KeyboardEvent, toggleFn: () => void) {
    if (event.key === 'Enter' || event.key === ' ') {
      toggleFn.call(this);
    }
  }
}