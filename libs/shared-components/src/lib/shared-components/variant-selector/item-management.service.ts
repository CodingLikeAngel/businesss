import { Injectable } from '@angular/core';
import { VariantService } from '../../../services/variant.service';

@Injectable({
  providedIn: 'root'
})
export class ItemManagementService {

  constructor(private variantService: VariantService) {}

  saveServiceItem(editingItem: any, editingIndex: number) {
    const services = [...this.variantService.getCurrentServiceCardsConfig().items];
    if (editingIndex >= 0) {
      services[editingIndex] = editingItem;
    } else {
      services.push(editingItem);
    }
    this.variantService.setServiceCardsConfig({ items: services });
  }

  saveProductItem(editingItem: any, editingIndex: number) {
    const products = [...this.variantService.getCurrentProductsConfig().items];
    if (editingIndex >= 0) {
      products[editingIndex] = editingItem;
    } else {
      products.push(editingItem);
    }
    this.variantService.setProductsConfig({ items: products });
  }

  saveTestimonialItem(editingItem: any, editingIndex: number) {
    const testimonials = [...this.variantService.getCurrentTestimonialsConfig().items];
    if (editingIndex >= 0) {
      testimonials[editingIndex] = editingItem;
    } else {
      testimonials.push(editingItem);
    }
    this.variantService.setTestimonialsConfig({ items: testimonials });
  }

  saveFaqItem(editingItem: any, editingIndex: number) {
    const faq = [...this.variantService.getCurrentFaqConfig().items];
    if (editingIndex >= 0) {
      faq[editingIndex] = editingItem;
    } else {
      faq.push(editingItem);
    }
    this.variantService.setFaqConfig({ items: faq });
  }

  saveGalleryItem(editingItem: any, editingIndex: number) {
    const gallery = [...this.variantService.getCurrentGalleryConfig().images];
    if (editingIndex >= 0) {
      gallery[editingIndex] = editingItem;
    } else {
      gallery.push(editingItem);
    }
    this.variantService.setGalleryConfig({ images: gallery });
  }

  savePricingItem(editingItem: any, editingIndex: number) {
    const rows = [...this.variantService.getCurrentPricingConfig().rows];
    if (editingIndex >= 0) {
      rows[editingIndex] = editingItem;
    } else {
      rows.push(editingItem);
    }
    this.variantService.setPricingConfig({ rows });
  }

  savePromotionItem(editingItem: any, editingIndex: number) {
    const promotions = [...this.variantService.getCurrentPromotionsConfig().premiumCards];
    if (editingIndex >= 0) {
      promotions[editingIndex] = editingItem;
    } else {
      promotions.push(editingItem);
    }
    this.variantService.setPromotionsConfig({ premiumCards: promotions });
  }

  saveNavItem(editingItem: any, editingIndex: number) {
    const navItems = [...this.variantService.getCurrentHeaderConfig().navItems];
    if (editingIndex >= 0) {
      navItems[editingIndex] = editingItem;
    } else {
      navItems.push(editingItem);
    }
    this.variantService.setHeaderConfig({ navItems });
  }

  saveNavLink(editingItem: any, editingIndex: number) {
    const navLinks = [...this.variantService.getCurrentNavBarConfig().navLinks];
    if (editingIndex >= 0) {
      navLinks[editingIndex] = editingItem;
    } else {
      navLinks.push(editingItem);
    }
    this.variantService.setNavBarConfig({ navLinks });
  }

  saveFooterLink(editingItem: any, editingIndex: number, listType: 'explore' | 'trend') {
    const config = this.variantService.getCurrentFooterConfig();
    const links = listType === 'explore' ? [...config.exploreLinks] : [...config.trendLinks];
    if (editingIndex >= 0) {
      links[editingIndex] = editingItem;
    } else {
      links.push(editingItem);
    }
    if (listType === 'explore') {
      this.variantService.setFooterConfig({ exploreLinks: links });
    } else {
      this.variantService.setFooterConfig({ trendLinks: links });
    }
  }

  saveSocialIcon(editingItem: any, editingIndex: number) {
    const socialIcons = [...this.variantService.getCurrentFooterConfig().socialIcons];
    if (editingIndex >= 0) {
      socialIcons[editingIndex] = editingItem;
    } else {
      socialIcons.push(editingItem);
    }
    this.variantService.setFooterConfig({ socialIcons });
  }

  removeServiceItem(index: number) {
    const services = [...this.variantService.getCurrentServiceCardsConfig().items];
    services.splice(index, 1);
    this.variantService.setServiceCardsConfig({ items: services });
  }

  removeProductItem(index: number) {
    const products = [...this.variantService.getCurrentProductsConfig().items];
    products.splice(index, 1);
    this.variantService.setProductsConfig({ items: products });
  }

  removeTestimonialItem(index: number) {
    const testimonials = [...this.variantService.getCurrentTestimonialsConfig().items];
    testimonials.splice(index, 1);
    this.variantService.setTestimonialsConfig({ items: testimonials });
  }

  removeFaqItem(index: number) {
    const faq = [...this.variantService.getCurrentFaqConfig().items];
    faq.splice(index, 1);
    this.variantService.setFaqConfig({ items: faq });
  }

  removeGalleryItem(index: number) {
    const gallery = [...this.variantService.getCurrentGalleryConfig().images];
    gallery.splice(index, 1);
    this.variantService.setGalleryConfig({ images: gallery });
  }

  removePricingItem(index: number) {
    const rows = [...this.variantService.getCurrentPricingConfig().rows];
    rows.splice(index, 1);
    this.variantService.setPricingConfig({ rows });
  }

  removePromotionItem(index: number) {
    const promotions = [...this.variantService.getCurrentPromotionsConfig().premiumCards];
    promotions.splice(index, 1);
    this.variantService.setPromotionsConfig({ premiumCards: promotions });
  }

  removeNavItem(index: number) {
    const navItems = [...this.variantService.getCurrentHeaderConfig().navItems];
    navItems.splice(index, 1);
    this.variantService.setHeaderConfig({ navItems });
  }

  removeNavLink(index: number) {
    const navLinks = [...this.variantService.getCurrentNavBarConfig().navLinks];
    navLinks.splice(index, 1);
    this.variantService.setNavBarConfig({ navLinks });
  }

  removeFooterLink(index: number, listType: 'explore' | 'trend') {
    const config = this.variantService.getCurrentFooterConfig();
    const links = listType === 'explore' ? [...config.exploreLinks] : [...config.trendLinks];
    links.splice(index, 1);
    if (listType === 'explore') {
      this.variantService.setFooterConfig({ exploreLinks: links });
    } else {
      this.variantService.setFooterConfig({ trendLinks: links });
    }
  }

  removeSocialIcon(index: number) {
    const socialIcons = [...this.variantService.getCurrentFooterConfig().socialIcons];
    socialIcons.splice(index, 1);
    this.variantService.setFooterConfig({ socialIcons });
  }

  removeSection(sections: any[], index: number) {
    const sectionList = [...sections];
    sectionList.splice(index, 1);
    this.variantService.setSections(sectionList);
  }

  getEmptyItem(type: string): any {
    switch (type) {
      case 'service': return { routeName: 'Nuevo Servicio', description: 'Descripción aquí', imageUrl: '', features: [], link: '#' };
      case 'product': return { name: 'Nuevo Producto', description: 'Descripción aquí', image: '', price: '0€' };
      case 'testimonial': return { quote: 'Cita espectacular', author: 'Nombre del Autor' };
      case 'faq': return { title: 'Pregunta frecuente', content: 'Respuesta detallada', expanded: false };
      case 'gallery': return { src: '', alt: 'Descripción de imagen' };
      case 'pricing': return { service: 'Servicio', description: 'Detalles', price: '0€' };
      case 'promotion': return { title: 'Oferta Especial', description: 'Detallitos', image: '', price: '0€', discount: '0%', icon: 'heroStar', tooltip: '¡Aprovecha!' };
      case 'navItem': return { label: 'Nuevo Link', href: '#', active: false };
      case 'navLink': return { label: 'Sección', href: '#section', icon: '🔹' };
      case 'footerLink': return { label: 'Enlace', href: '#', icon: '🔗', _listType: 'explore' };
      case 'socialIcon': return { name: 'instagram', href: '#' };
      default: return {};
    }
  }
}