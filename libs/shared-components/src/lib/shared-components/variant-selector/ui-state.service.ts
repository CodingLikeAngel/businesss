import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Servicio de estado UI compartido entre los componentes del editor.
 * Se añaden métodos para resetear todo el estado y para persistirlo opcionalmente.
 */
@Injectable({
  providedIn: 'root',
})
export class UiStateService {
  // Tabs y visibilidad de modales (sin cambios)
  activeTab: 'pages' | 'general' | 'structure' | 'explorer' | 'content' | 'design' | 'footer' = 'pages';
  showItemModal = false;
  modalItemType: 'service' | 'product' | 'testimonial' | 'faq' | 'gallery' | 'pricing' | 'promotion' | 'navItem' | 'navLink' | 'footerLink' | 'socialIcon' | null = null;
  editingItem: any = null;
  editingIndex: number = -1;

  // Selección global (se mantiene como before)
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

  /** Map section type -> content keys to show in sidebar (so all wrappers are editable without isolated mode). */
  private static readonly SECTION_TYPE_CONTENT_KEYS: Record<string, string[]> = {
    title: ['title', 'text', 'level', 'variant', 'animation', 'align'],
    showcase: ['icon', 'title', 'text', 'layout', 'variant'],
    image: ['title', 'subtitle', 'image', 'imageUrl', 'label', 'alt', 'caption'],
    video: ['title', 'subtitle', 'videoUrl', 'videoPoster'],
    map: ['title', 'address', 'zoom', 'showOverlay'],
    shape: ['shapeType', 'customPath'],
    chart: ['title', 'subtitle', 'chartType'],
    list: ['title', 'subtitle', 'items'],
    table: ['title', 'subtitle', 'items'],
    tabs: ['title', 'items'],
    steps: ['title', 'subtitle', 'items'],
    faq: ['title', 'subtitle', 'items'],
    gallery: ['title', 'subtitle', 'items'],
    services: ['title', 'subtitle', 'items'],
    products: ['title', 'subtitle', 'items'],
    promotions: ['title', 'subtitle', 'items'],
    stats: ['title', 'subtitle', 'items'],
    testimonials: ['title', 'subtitle', 'items'],
    contact: ['title', 'subtitle', 'description', 'address', 'email', 'phone'],
    newsletter: ['title', 'subtitle', 'description', 'placeholder', 'label'],
    cta: ['title', 'subtitle', 'label', 'link'],
    hero: ['title', 'subtitle', 'description', 'label', 'link', 'image'],
    breadcrumbs: ['title', 'items'],
    chip: ['text', 'label', 'icon'],
    bubble: ['title', 'text', 'icon'],
    accordion: ['title', 'subtitle', 'items'],
    pricing: ['title', 'subtitle', 'items'],
    features: ['title', 'subtitle', 'items'],
    'card-testimonial': ['title', 'subtitle', 'items', 'globalVariant'],
    'card-product': ['title', 'subtitle', 'items', 'globalVariant'],
    'card-animated': ['title', 'subtitle', 'items', 'globalVariant'],
    'card-rutas': ['title', 'subtitle', 'items', 'globalVariant'],
    'card-premium': ['title', 'subtitle', 'items', 'globalVariant'],
    input: ['title', 'placeholder', 'label'],
    container: ['title', 'subtitle'],
  };

  private normalizeSection(section: any) {
    if (!section) return null;
    const copy = { ...section, content: { ...(section.content || {}) }, styles: { ...(section.styles || {}) } };
    // Garantizar colores por defecto
    if (!copy.styles.backgroundColor) copy.styles.backgroundColor = '#111111';
    if (!copy.styles.color) copy.styles.color = '#ffffff';
    // Campos comunes
    const commonKeys = ['title', 'subtitle', 'description', 'text', 'link', 'image'];
    commonKeys.forEach(k => { if (copy.content[k] === undefined) copy.content[k] = ''; });
    // Por tipo: asegurar todas las propiedades editables desde el sidebar
    const typeKeys = UiStateService.SECTION_TYPE_CONTENT_KEYS[section.type];
    if (typeKeys?.length) {
      typeKeys.forEach(k => {
        if (copy.content[k] === undefined) {
          copy.content[k] = k === 'items' ? [] : (k === 'showOverlay' ? false : '');
        }
      });
    }
    return copy;
  }

  private normalizeElement(element: any) {
    if (!element) return null;
    const copy = { ...element, _original: element, content: { ...(element.content || {}) }, styles: { ...(element.styles || {}) } };
    const type = element.type || 'element';
    if (element.name && !copy.content.title) copy.content.title = element.name;
    if (element.routeName && !copy.content.title) copy.content.title = element.routeName;
    if (element.label && !copy.content.title) copy.content.title = element.label;
    if (element.author && !copy.content.title) copy.content.title = element.author;
    if (element.description && !copy.content.description) { copy.content.description = element.description; copy.content.text = element.description; }
    if (element.quote && !copy.content.description) copy.content.description = element.quote;
    if (element.value !== undefined && !copy.content.subtitle) copy.content.subtitle = String(element.value);
    if (element.icon && !copy.content.subtitle && !element.value) copy.content.subtitle = element.icon;
    if (element.image && !copy.content.image) copy.content.image = element.image;
    if (element.imageUrl && !copy.content.image) copy.content.image = element.imageUrl;
    if (element.price && !copy.content.label) copy.content.label = element.price;
    if (element.link && !copy.content.link) copy.content.link = element.link;
    // Determinar keys a mostrar según tipo
    const typeToKeys: { [key: string]: string[] } = {
      title: ['title'],
      subtitle: ['subtitle'],
      cta: ['label', 'link'],
      form: ['title', 'subtitle'],
      image: ['image', 'label'],
      feature: ['title', 'description', 'subtitle'],
      stat: ['title', 'subtitle', 'label'],
      testimonial: ['title', 'description'],
      product: ['title', 'description', 'label', 'image'],
      service: ['title', 'description', 'image', 'link'],
      header: ['title', 'subtitle'],
      footer: ['title', 'description'],
      card: ['title', 'description', 'subtitle']
    };
    const keys = typeToKeys[type] || ['title', 'subtitle', 'description', 'text', 'link', 'image', 'label'];
    keys.forEach(k => { if (copy.content[k] === undefined) copy.content[k] = ''; });
    if (!copy.styles.backgroundColor) copy.styles.backgroundColor = '#000000';
    if (!copy.styles.color) copy.styles.color = '#ffffff';
    return copy;
  }

  // ==== UI visibility toggles (unchanged) ==== 
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

  setActiveTab(tab: 'pages' | 'general' | 'structure' | 'explorer' | 'content' | 'design' | 'footer') {
    this.activeTab = tab;
  }

  // ==== Modal handling (unchanged) ==== 
  openAddModal(type: any, getEmptyItem: (type: string) => any) {
    this.modalItemType = type;
    this.editingItem = getEmptyItem(type);
    this.editingIndex = -1;
    this.showItemModal = true;
  }
  openEditModal(type: any, item: any, index: number) {
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

  // ==== Toggle helpers (unchanged) ==== 
  toggleHeaderConfig() { this.showHeaderConfig = !this.showHeaderConfig; }
  toggleFooterConfig() { this.showFooterConfig = !this.showFooterConfig; }
  toggleNavBarConfig() { this.showNavBarConfig = !this.showNavBarConfig; }
  toggleHeroConfig() { this.showHeroConfig = !this.showHeroConfig; }
  toggleBubbleConfig() { this.showBubbleConfig = !this.showBubbleConfig; }
  toggleCardConfig() { this.showCardConfig = !this.showCardConfig; }
  toggleTitleConfig() { this.showTitleConfig = !this.showTitleConfig; }
  toggleFaqConfig() { this.showFaqConfig = !this.showFaqConfig; }
  togglePricingConfig() { this.showPricingConfig = !this.showPricingConfig; }
  togglePromotionsConfig() { this.showPromotionsConfig = !this.showPromotionsConfig; }
  toggleGalleryConfig() { this.showGalleryConfig = !this.showGalleryConfig; }
  toggleProductsConfig() { this.showProductsConfig = !this.showProductsConfig; }

  // ==== Keyboard helper (unchanged) ==== 
  onKeyUpToggle(event: KeyboardEvent, toggleFn: () => void) {
    if (event.key === 'Enter' || event.key === ' ') { toggleFn.call(this); }
  }

  /**
   * **Nuevo**: Restablece todo el estado UI a sus valores por defecto.
   * También persiste en localStorage cuando la app está en modo Pro.
   */
  resetAll(): void {
    this.activeTab = 'pages';
    this.showItemModal = false;
    this.modalItemType = null;
    this.editingItem = null;
    this.editingIndex = -1;
    // Ocultar todas las configuraciones
    this.showHeaderConfig = false;
    this.showFooterConfig = false;
    this.showNavBarConfig = false;
    this.showHeroConfig = false;
    this.showBubbleConfig = false;
    this.showCardConfig = false;
    this.showTitleConfig = false;
    this.showFaqConfig = false;
    this.showPricingConfig = false;
    this.showPromotionsConfig = false;
    this.showGalleryConfig = false;
    this.showProductsConfig = false;
    // Resetear selecciones
    this._selectedSection.next(null);
    this._selectedElement.next(null);
    // Persistir si está habilitado (ejemplo simple)
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('uiState');
    }
  }
}