import { Injectable } from '@angular/core';

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