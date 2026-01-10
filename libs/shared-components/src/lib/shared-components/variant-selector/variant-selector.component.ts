import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIInputComponent, InputOption, variants } from '@negocio/ui-components';
import {
  VariantService,
  HeaderConfig,
  FooterConfig,
  NavBarConfig,
  HeroConfig,
  BubbleConfig,
  CardConfig,
  TitleConfig,
  ServiceCardsConfig,
  FaqConfig,
  PricingConfig,
  PromotionsConfig,
  GalleryConfig,
  ProductsConfig,
} from '../../../services/variant.service';
import { footerVariants, bubbleVariants, cardRutasVariants, titleVariants } from '@negocio/ui-components';

@Component({
  selector: 'lib-variant-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, UIInputComponent],
  template: `
    <div class="variant-selector">
      <h2>Configurar Componentes</h2>

      <!-- Global Variant Selector -->
      <div class="config-section">
        <h3>Variante Global</h3>
        <lib-ui-components-input
          type="select"
          [variant]="selectorVariant"
          [size]="'md'"
          [placeholder]="'Selecciona una variante global'"
          [(ngModel)]="globalVariant"
          (ngModelChange)="onGlobalVariantChange()"
          [options]="variantOptions"
        ></lib-ui-components-input>
      </div>

      <!-- Component-Specific Variants -->
      <div class="config-section">
        <h3>Variantes por Componente</h3>
        <div *ngFor="let component of components" class="component-config">
          <lib-ui-components-input
            type="select"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Selecciona una variante para ' + component.label"
            [(ngModel)]="componentVariants[component.id]"
            (ngModelChange)="onComponentVariantChange(component.id)"
            [options]="componentVariantOptions"
          ></lib-ui-components-input>
        </div>
      </div>

      <!-- Header Config -->
      <div class="config-section">
        <h3 class="collapsible" tabindex="0" (click)="toggleHeaderConfig()" (keyup)="onKeyUpHeader($event)">
          Configuración del Header {{ showHeaderConfig ? '▼' : '▶' }}
        </h3>
        <div *ngIf="showHeaderConfig" class="config-content">
          <lib-ui-components-input
            type="text"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Título del header'"
            [(ngModel)]="headerConfig.title"
            (ngModelChange)="updateHeaderConfig()"
          ></lib-ui-components-input>
          <lib-ui-components-input
            type="text"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Subtítulo del header'"
            [(ngModel)]="headerConfig.subtitle"
            (ngModelChange)="updateHeaderConfig()"
          ></lib-ui-components-input>
          <lib-ui-components-input
            type="select"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Alineación'"
            [(ngModel)]="headerConfig.align"
            (ngModelChange)="updateHeaderConfig()"
            [options]="alignOptions"
          ></lib-ui-components-input>
          <lib-ui-components-input
            type="checkbox"
            [variant]="selectorVariant"
            [size]="'md'"
            [(ngModel)]="headerConfig.dark"
            (ngModelChange)="updateHeaderConfig()"
          >
            Modo Oscuro
          </lib-ui-components-input>
          <lib-ui-components-input
            type="textarea"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Nav Items (JSON)'"
            [(ngModel)]="navItemsJson"
            (ngModelChange)="updateNavItems()"
          ></lib-ui-components-input>
        </div>
      </div>

      <!-- Navbar Config -->
      <div class="config-section">
        <h3 class="collapsible" tabindex="0" (click)="toggleNavBarConfig()" (keyup)="onKeyUpNavBar($event)">
          Configuración del Navbar {{ showNavBarConfig ? '▼' : '▶' }}
        </h3>
        <div *ngIf="showNavBarConfig" class="config-content">
          <lib-ui-components-input
            type="text"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Texto del logo'"
            [(ngModel)]="navBarConfig.logoText"
            (ngModelChange)="updateNavBarConfig()"
          ></lib-ui-components-input>
          <lib-ui-components-input
            type="checkbox"
            [variant]="selectorVariant"
            [size]="'md'"
            [(ngModel)]="navBarConfig.showMobileMenu"
            (ngModelChange)="updateNavBarConfig()"
          >
            Mostrar Menú Móvil
          </lib-ui-components-input>
          <lib-ui-components-input
            type="checkbox"
            [variant]="selectorVariant"
            [size]="'md'"
            [(ngModel)]="navBarConfig.isFixed"
            (ngModelChange)="updateNavBarConfig()"
          >
            Navbar Fijo
          </lib-ui-components-input>
          <lib-ui-components-input
            type="textarea"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Nav Links (JSON)'"
            [(ngModel)]="navLinksJson"
            (ngModelChange)="updateNavLinks()"
          ></lib-ui-components-input>
          <lib-ui-components-input
            type="textarea"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Estilos Personalizados (JSON)'"
            [(ngModel)]="navCustomStylesJson"
            (ngModelChange)="updateNavCustomStyles()"
          ></lib-ui-components-input>
        </div>
      </div>

      <!-- Hero Config -->
      <div class="config-section">
        <h3 class="collapsible" tabindex="0" (click)="toggleHeroConfig()" (keyup)="onKeyUpHero($event)">
          Configuración del Hero {{ showHeroConfig ? '▼' : '▶' }}
        </h3>
        <div *ngIf="showHeroConfig" class="config-content">
          <lib-ui-components-input
            type="text"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Título del Hero'"
            [(ngModel)]="heroConfig.title"
            (ngModelChange)="updateHeroConfig()"
          ></lib-ui-components-input>
          <lib-ui-components-input
            type="text"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Subtítulo del Hero'"
            [(ngModel)]="heroConfig.subtitle"
            (ngModelChange)="updateHeroConfig()"
          ></lib-ui-components-input>
          <lib-ui-components-input
            type="checkbox"
            [variant]="selectorVariant"
            [size]="'md'"
            [(ngModel)]="heroConfig.showCta"
            (ngModelChange)="updateHeroConfig()"
          >
            Mostrar CTA
          </lib-ui-components-input>
          <lib-ui-components-input
            type="text"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Texto del CTA'"
            [(ngModel)]="heroConfig.ctaLabel"
            (ngModelChange)="updateHeroConfig()"
          ></lib-ui-components-input>
          <lib-ui-components-input
            type="checkbox"
            [variant]="selectorVariant"
            [size]="'md'"
            [(ngModel)]="heroConfig.showScrollIcon"
            (ngModelChange)="updateHeroConfig()"
          >
            Mostrar Icono de Scroll
          </lib-ui-components-input>
          <lib-ui-components-input
            type="checkbox"
            [variant]="selectorVariant"
            [size]="'md'"
            [(ngModel)]="heroConfig.videoBackground"
            (ngModelChange)="updateHeroConfig()"
          >
            Fondo de Video
          </lib-ui-components-input>
          <lib-ui-components-input
            type="text"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'URL del Video'"
            [(ngModel)]="heroConfig.videoUrl"
            (ngModelChange)="updateHeroConfig()"
          ></lib-ui-components-input>
          <lib-ui-components-input
            type="text"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'URL del Poster del Video'"
            [(ngModel)]="heroConfig.videoPoster"
            (ngModelChange)="updateHeroConfig()"
          ></lib-ui-components-input>
          <lib-ui-components-input
            type="textarea"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Navigation Cards (JSON)'"
            [(ngModel)]="navigationCardsJson"
            (ngModelChange)="updateNavigationCards()"
          ></lib-ui-components-input>
          <lib-ui-components-input
            type="textarea"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Carousel Items (JSON)'"
            [(ngModel)]="carouselItemsJson"
            (ngModelChange)="updateCarouselItems()"
          ></lib-ui-components-input>
          <lib-ui-components-input
            type="textarea"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Estilos Personalizados (JSON)'"
            [(ngModel)]="heroCustomStylesJson"
            (ngModelChange)="updateHeroCustomStyles()"
          ></lib-ui-components-input>
        </div>
      </div>

      <!-- Bubble Config -->
      <div class="config-section">
        <h3 class="collapsible" tabindex="0" (click)="toggleBubbleConfig()" (keyup)="onKeyUpBubble($event)">
          Configuración del Bubble {{ showBubbleConfig ? '▼' : '▶' }}
        </h3>
        <div *ngIf="showBubbleConfig" class="config-content">
          <lib-ui-components-input
            type="number"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Velocidad (0.1 - 10)'"
            [(ngModel)]="bubbleConfig.speed"
            (ngModelChange)="updateBubbleConfig()"
          ></lib-ui-components-input>
          <lib-ui-components-input
            type="number"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Desenfoque (0 - 100)'"
            [(ngModel)]="bubbleConfig.blur"
            (ngModelChange)="updateBubbleConfig()"
          ></lib-ui-components-input>
          <lib-ui-components-input
            type="number"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Opacidad (0 - 1)'"
            [(ngModel)]="bubbleConfig.opacity"
            (ngModelChange)="updateBubbleConfig()"
          ></lib-ui-components-input>
        </div>
      </div>

      <!-- Card Config -->
      <div class="config-section">
        <h3 class="collapsible" tabindex="0" (click)="toggleCardConfig()" (keyup)="onKeyUpCard($event)">
          Configuración del Card {{ showCardConfig ? '▼' : '▶' }}
        </h3>
        <div *ngIf="showCardConfig" class="config-content">
          <lib-ui-components-input
            type="text"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Color de Fondo (e.g., rgba(255,255,255,0.1))'"
            [(ngModel)]="cardConfig.backgroundColor"
            (ngModelChange)="updateCardConfig()"
          ></lib-ui-components-input>
          <lib-ui-components-input
            type="text"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Color de Texto (e.g., #FACC15)'"
            [(ngModel)]="cardConfig.textColor"
            (ngModelChange)="updateCardConfig()"
          ></lib-ui-components-input>
          <lib-ui-components-input
            type="text"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Color de Acento (e.g., #FF1E56)'"
            [(ngModel)]="cardConfig.accentColor"
            (ngModelChange)="updateCardConfig()"
          ></lib-ui-components-input>
          <lib-ui-components-input
            type="select"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Animación'"
            [(ngModel)]="cardConfig.animation"
            (ngModelChange)="updateCardConfig()"
            [options]="cardAnimationOptions"
          ></lib-ui-components-input>
          <lib-ui-components-input
            type="checkbox"
            [variant]="selectorVariant"
            [size]="'md'"
            [(ngModel)]="cardConfig.isMobile"
            (ngModelChange)="updateCardConfig()"
          >
            Modo Móvil
          </lib-ui-components-input>
          <lib-ui-components-input
            type="textarea"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Estilos Personalizados (JSON)'"
            [(ngModel)]="cardCustomStylesJson"
            (ngModelChange)="updateCardCustomStyles()"
          ></lib-ui-components-input>
          <lib-ui-components-input
            type="textarea"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Service Cards (JSON)'"
            [(ngModel)]="serviceCardsJson"
            (ngModelChange)="updateServiceCards()"
          ></lib-ui-components-input>
        </div>
      </div>

      <!-- Title Config -->
      <div class="config-section">
        <h3 class="collapsible" tabindex="0" (click)="toggleTitleConfig()" (keyup)="onKeyUpTitle($event)">
          Configuración del Title {{ showTitleConfig ? '▼' : '▶' }}
        </h3>
        <div *ngIf="showTitleConfig" class="config-content">
          <lib-ui-components-input
            type="select"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Nivel del Título'"
            [(ngModel)]="titleConfig.level"
            (ngModelChange)="updateTitleConfig()"
            [options]="titleLevelOptions"
          ></lib-ui-components-input>
          <lib-ui-components-input
            type="text"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Texto del Título'"
            [(ngModel)]="titleConfig.text"
            (ngModelChange)="updateTitleConfig()"
          ></lib-ui-components-input>
          <lib-ui-components-input
            type="select"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Animación'"
            [(ngModel)]="titleConfig.animation"
            (ngModelChange)="updateTitleConfig()"
            [options]="titleAnimationOptions"
          ></lib-ui-components-input>
          <lib-ui-components-input
            type="select"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Alineación'"
            [(ngModel)]="titleConfig.align"
            (ngModelChange)="updateTitleConfig()"
            [options]="alignOptions"
          ></lib-ui-components-input>
          <lib-ui-components-input
            type="textarea"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Estilos Personalizados (JSON)'"
            [(ngModel)]="titleCustomStylesJson"
            (ngModelChange)="updateTitleCustomStyles()"
          ></lib-ui-components-input>
        </div>
      </div>

      <!-- FAQ Config -->
      <div class="config-section">
        <h3 class="collapsible" tabindex="0" (click)="toggleFaqConfig()" (keyup)="onKeyUpFaq($event)">
          Configuración del FAQ {{ showFaqConfig ? '▼' : '▶' }}
        </h3>
        <div *ngIf="showFaqConfig" class="config-content">
          <lib-ui-components-input
            type="textarea"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'FAQ Items (JSON)'"
            [(ngModel)]="faqItemsJson"
            (ngModelChange)="updateFaqItems()"
          ></lib-ui-components-input>
        </div>
      </div>

      <!-- Pricing Config -->
      <div class="config-section">
        <h3 class="collapsible" tabindex="0" (click)="togglePricingConfig()" (keyup)="onKeyUpPricing($event)">
          Configuración del Pricing {{ showPricingConfig ? '▼' : '▶' }}
        </h3>
        <div *ngIf="showPricingConfig" class="config-content">
          <lib-ui-components-input
            type="textarea"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Price Columns (JSON)'"
            [(ngModel)]="priceColumnsJson"
            (ngModelChange)="updatePriceColumns()"
          ></lib-ui-components-input>
          <lib-ui-components-input
            type="textarea"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Price Rows (JSON)'"
            [(ngModel)]="priceRowsJson"
            (ngModelChange)="updatePriceRows()"
          ></lib-ui-components-input>
        </div>
      </div>

      <!-- Promotions Config -->
      <div class="config-section">
        <h3 class="collapsible" tabindex="0" (click)="togglePromotionsConfig()" (keyup)="onKeyUpPromotions($event)">
          Configuración del Promotions {{ showPromotionsConfig ? '▼' : '▶' }}
        </h3>
        <div *ngIf="showPromotionsConfig" class="config-content">
          <lib-ui-components-input
            type="textarea"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Premium Cards (JSON)'"
            [(ngModel)]="premiumCardsJson"
            (ngModelChange)="updatePremiumCards()"
          ></lib-ui-components-input>
        </div>
      </div>

      <!-- Gallery Config -->
      <div class="config-section">
        <h3 class="collapsible" tabindex="0" (click)="toggleGalleryConfig()" (keyup)="onKeyUpGallery($event)">
          Configuración del Gallery {{ showGalleryConfig ? '▼' : '▶' }}
        </h3>
        <div *ngIf="showGalleryConfig" class="config-content">
          <lib-ui-components-input
            type="textarea"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Gallery Images (JSON)'"
            [(ngModel)]="galleryImagesJson"
            (ngModelChange)="updateGalleryImages()"
          ></lib-ui-components-input>
        </div>
      </div>

      <!-- Products Config -->
      <div class="config-section">
        <h3 class="collapsible" tabindex="0" (click)="toggleProductsConfig()" (keyup)="onKeyUpProducts($event)">
          Configuración del Products {{ showProductsConfig ? '▼' : '▶' }}
        </h3>
        <div *ngIf="showProductsConfig" class="config-content">
          <lib-ui-components-input
            type="textarea"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Products (JSON)'"
            [(ngModel)]="productsJson"
            (ngModelChange)="updateProducts()"
          ></lib-ui-components-input>
        </div>
      </div>

      <!-- Footer Config -->
      <div class="config-section">
        <h3 class="collapsible" tabindex="0" (click)="toggleFooterConfig()" (keyup)="onKeyUpFooter($event)">
          Configuración del Footer {{ showFooterConfig ? '▼' : '▶' }}
        </h3>
        <div *ngIf="showFooterConfig" class="config-content">
          <lib-ui-components-input
            type="text"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Título del footer'"
            [(ngModel)]="footerConfig.title"
            (ngModelChange)="updateFooterConfig()"
          ></lib-ui-components-input>
          <lib-ui-components-input
            type="text"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Descripción del footer'"
            [(ngModel)]="footerConfig.description"
            (ngModelChange)="updateFooterConfig()"
          ></lib-ui-components-input>
          <lib-ui-components-input
            type="textarea"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Explore Links (JSON)'"
            [(ngModel)]="exploreLinksJson"
            (ngModelChange)="updateExploreLinks()"
          ></lib-ui-components-input>
          <lib-ui-components-input
            type="textarea"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Trend Links (JSON)'"
            [(ngModel)]="trendLinksJson"
            (ngModelChange)="updateTrendLinks()"
          ></lib-ui-components-input>
          <lib-ui-components-input
            type="textarea"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Social Icons (JSON)'"
            [(ngModel)]="socialIconsJson"
            (ngModelChange)="updateSocialIcons()"
          ></lib-ui-components-input>
          <lib-ui-components-input
            type="text"
            [variant]="selectorVariant"
            [size]="'md'"
            [placeholder]="'Texto de copyright'"
            [(ngModel)]="footerConfig.copyrightText"
            (ngModelChange)="updateFooterConfig()"
          ></lib-ui-components-input>
          <lib-ui-components-input
            type="checkbox"
            [variant]="selectorVariant"
            [size]="'md'"
            [(ngModel)]="footerConfig.showParticles"
            (ngModelChange)="updateFooterConfig()"
          >
            Mostrar Partículas
          </lib-ui-components-input>
          <lib-ui-components-input
            type="checkbox"
            [variant]="selectorVariant"
            [size]="'md'"
            [(ngModel)]="footerConfig.dark"
            (ngModelChange)="updateFooterConfig()"
          >
            Modo Oscuro
          </lib-ui-components-input>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./variant-selector.component.scss'],
})
export class VariantSelectorComponent implements OnInit {
  variants = [
    ...new Set([...footerVariants, ...bubbleVariants, ...cardRutasVariants, ...titleVariants, ...variants]),
  ];
  globalVariant: string;
  selectorVariant = 'cyberpunk';
  headerConfig: HeaderConfig;
  footerConfig: FooterConfig;
  navBarConfig: NavBarConfig;
  heroConfig: HeroConfig;
  bubbleConfig: BubbleConfig;
  cardConfig: CardConfig;
  titleConfig: TitleConfig;
  serviceCardsConfig: ServiceCardsConfig;
  faqConfig: FaqConfig;
  pricingConfig: PricingConfig;
  promotionsConfig: PromotionsConfig;
  galleryConfig: GalleryConfig;
  productsConfig: ProductsConfig;
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
  navItemsJson: string;
  exploreLinksJson: string;
  trendLinksJson: string;
  socialIconsJson: string;
  navLinksJson: string;
  navCustomStylesJson: string;
  navigationCardsJson: string;
  carouselItemsJson: string;
  heroCustomStylesJson: string;
  cardCustomStylesJson: string;
  titleCustomStylesJson: string;
  serviceCardsJson: string;
  faqItemsJson: string;
  priceColumnsJson: string;
  priceRowsJson: string;
  premiumCardsJson: string;
  galleryImagesJson: string;
  productsJson: string;
  componentVariants: { [key: string]: string } = {};

  components = [
    { id: 'navbar', label: 'Navbar' },
    { id: 'hero', label: 'Hero Section' },
    { id: 'card', label: 'Card' },
    { id: 'faq', label: 'FAQ Section' },
    { id: 'pricing', label: 'Pricing Section' },
    { id: 'promotions', label: 'Promotions Section' },
    { id: 'gallery', label: 'Gallery Section' },
    { id: 'form', label: 'Reservation Form' },
    { id: 'bubble', label: 'Bubble Animation' },
    { id: 'title', label: 'Title' },
    { id: 'products', label: 'Products Section' },
  ];

  variantOptions: InputOption[] = this.variants.map((variant) => ({
    value: variant,
    label: variant.charAt(0).toUpperCase() + variant.slice(1),
  }));

  componentVariantOptions: InputOption[] = [
    { value: '', label: 'Global' },
    ...this.variantOptions,
  ];

  alignOptions: InputOption[] = [
    { value: 'left', label: 'Izquierda' },
    { value: 'center', label: 'Centro' },
    { value: 'right', label: 'Derecha' },
  ];

  cardAnimationOptions: InputOption[] = [
    { value: 'pulse', label: 'Pulso' },
    { value: 'fade', label: 'Desvanecer' },
    { value: 'slide', label: 'Deslizar' },
    { value: 'bounce', label: 'Rebotar' },
    { value: 'none', label: 'Ninguna' },
  ];

  titleLevelOptions: InputOption[] = [
    { value: 'h1', label: 'H1' },
    { value: 'h2', label: 'H2' },
    { value: 'h3', label: 'H3' },
    { value: 'h4', label: 'H4' },
    { value: 'h5', label: 'H5' },
    { value: 'h6', label: 'H6' },
  ];

  titleAnimationOptions: InputOption[] = [
    { value: 'none', label: 'Ninguna' },
    { value: 'fade', label: 'Desvanecer' },
    { value: 'pulse', label: 'Pulso' },
    { value: 'bounce', label: 'Rebotar' },
    { value: 'glitch', label: 'Glitch' },
    { value: 'slide', label: 'Deslizar' },
  ];

  constructor(private variantService: VariantService) {
    this.globalVariant = this.variantService.getVariantForComponent('global');
    this.headerConfig = this.variantService.getCurrentHeaderConfig();
    this.footerConfig = this.variantService.getCurrentFooterConfig();
    this.navBarConfig = this.variantService.getCurrentNavBarConfig();
    this.heroConfig = this.variantService.getCurrentHeroConfig();
    this.bubbleConfig = this.variantService.getCurrentBubbleConfig();
    this.cardConfig = this.variantService.getCurrentCardConfig();
    this.titleConfig = this.variantService.getCurrentTitleConfig();
    this.serviceCardsConfig = this.variantService.getCurrentServiceCardsConfig();
    this.faqConfig = this.variantService.getCurrentFaqConfig();
    this.pricingConfig = this.variantService.getCurrentPricingConfig();
    this.promotionsConfig = this.variantService.getCurrentPromotionsConfig();
    this.galleryConfig = this.variantService.getCurrentGalleryConfig();
    this.productsConfig = this.variantService.getCurrentProductsConfig();
    this.navItemsJson = JSON.stringify(this.headerConfig.navItems, null, 2);
    this.exploreLinksJson = JSON.stringify(this.footerConfig.exploreLinks, null, 2);
    this.trendLinksJson = JSON.stringify(this.footerConfig.trendLinks, null, 2);
    this.socialIconsJson = JSON.stringify(this.footerConfig.socialIcons, null, 2);
    this.navLinksJson = JSON.stringify(this.navBarConfig.navLinks, null, 2);
    this.navCustomStylesJson = JSON.stringify(this.navBarConfig.customStyles, null, 2);
    this.navigationCardsJson = JSON.stringify(this.heroConfig.navigationCards, null, 2);
    this.carouselItemsJson = JSON.stringify(this.heroConfig.carouselItems, null, 2);
    this.heroCustomStylesJson = JSON.stringify(this.heroConfig.customStyles, null, 2);
    this.cardCustomStylesJson = JSON.stringify(this.cardConfig.customStyles, null, 2);
    this.titleCustomStylesJson = JSON.stringify(this.titleConfig.customStyles, null, 2);
    this.serviceCardsJson = JSON.stringify(this.serviceCardsConfig.items, null, 2);
    this.faqItemsJson = JSON.stringify(this.faqConfig.items, null, 2);
    this.priceColumnsJson = JSON.stringify(this.pricingConfig.columns, null, 2);
    this.priceRowsJson = JSON.stringify(this.pricingConfig.rows, null, 2);
    this.premiumCardsJson = JSON.stringify(this.promotionsConfig.premiumCards, null, 2);
    this.galleryImagesJson = JSON.stringify(this.galleryConfig.images, null, 2);
    this.productsJson = JSON.stringify(this.productsConfig.items, null, 2);
  }

  ngOnInit() {
    this.variantService.globalVariant$.subscribe((variant) => {
      this.globalVariant = variant;
    });

    this.variantService.componentVariants$.subscribe((variants) => {
      this.componentVariants = { ...variants };
    });

    this.variantService.headerConfig$.subscribe((config) => {
      this.headerConfig = config;
      this.navItemsJson = JSON.stringify(config.navItems, null, 2);
    });

    this.variantService.footerConfig$.subscribe((config) => {
      this.footerConfig = config;
      this.exploreLinksJson = JSON.stringify(config.exploreLinks, null, 2);
      this.trendLinksJson = JSON.stringify(config.trendLinks, null, 2);
      this.socialIconsJson = JSON.stringify(config.socialIcons, null, 2);
    });

    this.variantService.navBarConfig$.subscribe((config) => {
      this.navBarConfig = config;
      this.navLinksJson = JSON.stringify(config.navLinks, null, 2);
      this.navCustomStylesJson = JSON.stringify(config.customStyles, null, 2);
    });

    this.variantService.heroConfig$.subscribe((config) => {
      this.heroConfig = config;
      this.navigationCardsJson = JSON.stringify(config.navigationCards, null, 2);
      this.carouselItemsJson = JSON.stringify(config.carouselItems, null, 2);
      this.heroCustomStylesJson = JSON.stringify(config.customStyles, null, 2);
    });

    this.variantService.bubbleConfig$.subscribe((config) => {
      this.bubbleConfig = config;
    });

    this.variantService.cardConfig$.subscribe((config) => {
      this.cardConfig = config;
      this.cardCustomStylesJson = JSON.stringify(config.customStyles, null, 2);
    });

    this.variantService.titleConfig$.subscribe((config) => {
      this.titleConfig = config;
      this.titleCustomStylesJson = JSON.stringify(config.customStyles, null, 2);
    });

    this.variantService.serviceCardsConfig$.subscribe((config) => {
      this.serviceCardsConfig = config;
      this.serviceCardsJson = JSON.stringify(config.items, null, 2);
    });

    this.variantService.faqConfig$.subscribe((config) => {
      this.faqConfig = config;
      this.faqItemsJson = JSON.stringify(config.items, null, 2);
    });

    this.variantService.pricingConfig$.subscribe((config) => {
      this.pricingConfig = config;
      this.priceColumnsJson = JSON.stringify(config.columns, null, 2);
      this.priceRowsJson = JSON.stringify(config.rows, null, 2);
    });

    this.variantService.promotionsConfig$.subscribe((config) => {
      this.promotionsConfig = config;
      this.premiumCardsJson = JSON.stringify(config.premiumCards, null, 2);
    });

    this.variantService.galleryConfig$.subscribe((config) => {
      this.galleryConfig = config;
      this.galleryImagesJson = JSON.stringify(config.images, null, 2);
    });

    this.variantService.productsConfig$.subscribe((config) => {
      this.productsConfig = config;
      this.productsJson = JSON.stringify(config.items, null, 2);
    });
  }

  onGlobalVariantChange() {
    this.variantService.setGlobalVariant(this.globalVariant);
  }

  onComponentVariantChange(componentId: string) {
    this.variantService.setComponentVariant(componentId, this.componentVariants[componentId] || null);
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

  onKeyUpHeader(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.toggleHeaderConfig();
    }
  }

  onKeyUpFooter(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.toggleFooterConfig();
    }
  }

  onKeyUpNavBar(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.toggleNavBarConfig();
    }
  }

  onKeyUpHero(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.toggleHeroConfig();
    }
  }

  onKeyUpBubble(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.toggleBubbleConfig();
    }
  }

  onKeyUpCard(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.toggleCardConfig();
    }
  }

  onKeyUpTitle(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.toggleTitleConfig();
    }
  }

  onKeyUpFaq(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.toggleFaqConfig();
    }
  }

  onKeyUpPricing(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.togglePricingConfig();
    }
  }

  onKeyUpPromotions(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.togglePromotionsConfig();
    }
  }

  onKeyUpGallery(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.toggleGalleryConfig();
    }
  }

  onKeyUpProducts(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.toggleProductsConfig();
    }
  }

  updateHeaderConfig() {
    this.variantService.setHeaderConfig(this.headerConfig);
  }

  updateFooterConfig() {
    this.variantService.setFooterConfig(this.footerConfig);
  }

  updateNavBarConfig() {
    this.variantService.setNavBarConfig(this.navBarConfig);
  }

  updateHeroConfig() {
    this.variantService.setHeroConfig(this.heroConfig);
  }

  updateBubbleConfig() {
    this.variantService.setBubbleConfig(this.bubbleConfig);
  }

  updateCardConfig() {
    this.variantService.setCardConfig(this.cardConfig);
  }

  updateTitleConfig() {
    this.variantService.setTitleConfig(this.titleConfig);
  }

  updateNavItems() {
    try {
      const navItems = JSON.parse(this.navItemsJson);
      this.variantService.setHeaderConfig({ navItems });
    } catch (e) {
      console.error('Invalid JSON for navItems', e);
    }
  }

  updateExploreLinks() {
    try {
      const exploreLinks = JSON.parse(this.exploreLinksJson);
      this.variantService.setFooterConfig({ exploreLinks });
    } catch (e) {
      console.error('Invalid JSON for exploreLinks', e);
    }
  }

  updateTrendLinks() {
    try {
      const trendLinks = JSON.parse(this.trendLinksJson);
      this.variantService.setFooterConfig({ trendLinks });
    } catch (e) {
      console.error('Invalid JSON for trendLinks', e);
    }
  }

  updateSocialIcons() {
    try {
      const socialIcons = JSON.parse(this.socialIconsJson);
      this.variantService.setFooterConfig({ socialIcons });
    } catch (e) {
      console.error('Invalid JSON for socialIcons', e);
    }
  }

  updateNavLinks() {
    try {
      const navLinks = JSON.parse(this.navLinksJson);
      this.variantService.setNavBarConfig({ navLinks });
    } catch (e) {
      console.error('Invalid JSON for navLinks', e);
    }
  }

  updateNavCustomStyles() {
    try {
      const customStyles = JSON.parse(this.navCustomStylesJson);
      this.variantService.setNavBarConfig({ customStyles });
    } catch (e) {
      console.error('Invalid JSON for navCustomStyles', e);
    }
  }

  updateNavigationCards() {
    try {
      const navigationCards = JSON.parse(this.navigationCardsJson);
      this.variantService.setHeroConfig({ navigationCards });
    } catch (e) {
      console.error('Invalid JSON for navigationCards', e);
    }
  }

  updateCarouselItems() {
    try {
      const carouselItems = JSON.parse(this.carouselItemsJson);
      this.variantService.setHeroConfig({ carouselItems });
    } catch (e) {
      console.error('Invalid JSON for carouselItems', e);
    }
  }

  updateHeroCustomStyles() {
    try {
      const customStyles = JSON.parse(this.heroCustomStylesJson);
      this.variantService.setHeroConfig({ customStyles });
    } catch (e) {
      console.error('Invalid JSON for heroCustomStyles', e);
    }
  }

  updateCardCustomStyles() {
    try {
      const customStyles = JSON.parse(this.cardCustomStylesJson);
      this.variantService.setCardConfig({ customStyles });
    } catch (e) {
      console.error('Invalid JSON for cardCustomStyles', e);
    }
  }

  updateTitleCustomStyles() {
    try {
      const customStyles = JSON.parse(this.titleCustomStylesJson);
      this.variantService.setTitleConfig({ customStyles });
    } catch (e) {
      console.error('Invalid JSON for titleCustomStyles', e);
    }
  }

  updateServiceCards() {
    try {
      const items = JSON.parse(this.serviceCardsJson);
      this.variantService.setServiceCardsConfig({ items });
    } catch (e) {
      console.error('Invalid JSON for serviceCards', e);
    }
  }

  updateFaqItems() {
    try {
      const items = JSON.parse(this.faqItemsJson);
      this.variantService.setFaqConfig({ items });
    } catch (e) {
      console.error('Invalid JSON for faqItems', e);
    }
  }

  updatePriceColumns() {
    try {
      const columns = JSON.parse(this.priceColumnsJson);
      this.variantService.setPricingConfig({ columns });
    } catch (e) {
      console.error('Invalid JSON for priceColumns', e);
    }
  }

  updatePriceRows() {
    try {
      const rows = JSON.parse(this.priceRowsJson);
      this.variantService.setPricingConfig({ rows });
    } catch (e) {
      console.error('Invalid JSON for priceRows', e);
    }
  }

  updatePremiumCards() {
    try {
      const premiumCards = JSON.parse(this.premiumCardsJson);
      this.variantService.setPromotionsConfig({ premiumCards });
    } catch (e) {
      console.error('Invalid JSON for premiumCards', e);
    }
  }

  updateGalleryImages() {
    try {
      const images = JSON.parse(this.galleryImagesJson);
      this.variantService.setGalleryConfig({ images });
    } catch (e) {
      console.error('Invalid JSON for galleryImages', e);
    }
  }

  updateProducts() {
    try {
      const items = JSON.parse(this.productsJson);
      this.variantService.setProductsConfig({ items });
    } catch (e) {
      console.error('Invalid JSON for products', e);
    }
  }
}