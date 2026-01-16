import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Template, TemplateCategory } from '../models/editor.model';
import { PageSection } from '@negocio/shared-components';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private templatesSubject = new BehaviorSubject<Template[]>(this.getDefaultTemplates());
  private categoriesSubject = new BehaviorSubject<TemplateCategory[]>(this.getDefaultCategories());
  private selectedTemplateSubject = new BehaviorSubject<Template | null>(null);

  templates$: Observable<Template[]> = this.templatesSubject.asObservable();
  categories$: Observable<TemplateCategory[]> = this.categoriesSubject.asObservable();
  selectedTemplate$: Observable<Template | null> = this.selectedTemplateSubject.asObservable();

  getTemplates(): Template[] {
    return this.templatesSubject.value;
  }

  getCategories(): TemplateCategory[] {
    return this.categoriesSubject.value;
  }

  getTemplateById(id: string): Template | undefined {
    return this.templatesSubject.value.find(t => t.id === id);
  }

  getTemplatesByCategory(categoryId: string): Template[] {
    return this.templatesSubject.value.filter(t => t.category === categoryId);
  }

  selectTemplate(template: Template | null): void {
    this.selectedTemplateSubject.next(template);
  }

  applyTemplate(templateId: string): PageSection[] {
    const template = this.getTemplateById(templateId);
    if (!template) {
      console.error(`Template ${templateId} not found`);
      return [];
    }

    // Convert template sections to PageSections
    return this.convertToPageSections(template);
  }

  private convertToPageSections(template: Template): PageSection[] {
    // Map template sections to PageSection format
    return template.sections.map(section => ({
      id: section.id,
      type: section.type as any,
      name: section.name,
      label: section.name, // Add label property
      visible: section.visible,
      order: section.zIndex,
      styles: (section.styles || {}) as { [key: string]: string },
      content: section.content || {},
      elements: section.elements || [],
      config: section.content || {},
      customStyles: {},
      animation: 'none',
      layout: 'default',
      animations: section.animations,
      responsive: section.responsive ? {
        mobile: {
          visible: section.responsive.mobile.visible,
          styles: section.responsive.mobile.styles as { [key: string]: string }
        },
        tablet: {
          visible: section.responsive.tablet.visible,
          styles: section.responsive.tablet.styles as { [key: string]: string }
        },
        desktop: {
          visible: section.responsive.desktop.visible,
          styles: section.responsive.desktop.styles as { [key: string]: string }
        }
      } : undefined,
      locked: section.locked,
      zIndex: section.zIndex
    }));
  }

  private getDefaultTemplates(): Template[] {
    return [
      // Business Templates
      {
        id: 'business-modern',
        name: 'Modern Business',
        description: 'Clean and professional business template with hero, services, and contact sections',
        category: 'business',
        thumbnail: '/templates/business-modern-thumb.png',
        preview: '/templates/business-modern-preview.png',
        tags: ['professional', 'corporate', 'clean'],
        sections: this.getBusinessModernSections(),
        globalStyles: this.getDefaultGlobalStyles(),
        popularity: 95,
        author: 'AntoStudios',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15'),
        premium: false
      },
      {
        id: 'business-creative',
        name: 'Creative Agency',
        description: 'Bold and creative template perfect for agencies and startups',
        category: 'business',
        thumbnail: '/templates/business-creative-thumb.png',
        preview: '/templates/business-creative-preview.png',
        tags: ['creative', 'bold', 'modern'],
        sections: this.getCreativeAgencySections(),
        globalStyles: this.getCreativeGlobalStyles(),
        popularity: 88,
        author: 'AntoStudios',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-15'),
        premium: false
      },

      // E-commerce Templates
      {
        id: 'ecommerce-fashion',
        name: 'Fashion Store',
        description: 'Elegant e-commerce template for fashion and lifestyle brands',
        category: 'ecommerce',
        thumbnail: '/templates/ecommerce-fashion-thumb.png',
        preview: '/templates/ecommerce-fashion-preview.png',
        tags: ['fashion', 'elegant', 'shop'],
        sections: this.getFashionStoreSections(),
        globalStyles: this.getFashionGlobalStyles(),
        popularity: 92,
        author: 'AntoStudios',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-15'),
        premium: true
      },

      // Portfolio Templates
      {
        id: 'portfolio-minimal',
        name: 'Minimal Portfolio',
        description: 'Minimalist portfolio template for designers and creatives',
        category: 'portfolio',
        thumbnail: '/templates/portfolio-minimal-thumb.png',
        preview: '/templates/portfolio-minimal-preview.png',
        tags: ['minimal', 'portfolio', 'clean'],
        sections: this.getMinimalPortfolioSections(),
        globalStyles: this.getMinimalGlobalStyles(),
        popularity: 85,
        author: 'AntoStudios',
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-15'),
        premium: false
      },

      // Restaurant Templates
      {
        id: 'restaurant-gourmet',
        name: 'Gourmet Restaurant',
        description: 'Sophisticated restaurant template with menu and reservation features',
        category: 'restaurant',
        thumbnail: '/templates/restaurant-gourmet-thumb.png',
        preview: '/templates/restaurant-gourmet-preview.png',
        tags: ['restaurant', 'food', 'elegant'],
        sections: this.getRestaurantSections(),
        globalStyles: this.getRestaurantGlobalStyles(),
        popularity: 90,
        author: 'AntoStudios',
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-15'),
        premium: true
      },

      // Landing Page Templates
      {
        id: 'landing-saas',
        name: 'SaaS Landing',
        description: 'High-converting landing page for SaaS products',
        category: 'landing',
        thumbnail: '/templates/landing-saas-thumb.png',
        preview: '/templates/landing-saas-preview.png',
        tags: ['saas', 'conversion', 'tech'],
        sections: this.getSaaSLandingSections(),
        globalStyles: this.getSaaSGlobalStyles(),
        popularity: 97,
        author: 'AntoStudios',
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-15'),
        premium: false
      }
    ];
  }

  private getDefaultCategories(): TemplateCategory[] {
    return [
      {
        id: 'business',
        name: 'Business',
        description: 'Professional templates for businesses and corporations',
        icon: '💼',
        templates: []
      },
      {
        id: 'ecommerce',
        name: 'E-commerce',
        description: 'Online store templates with product showcases',
        icon: '🛒',
        templates: []
      },
      {
        id: 'portfolio',
        name: 'Portfolio',
        description: 'Showcase your work with stunning portfolio templates',
        icon: '🎨',
        templates: []
      },
      {
        id: 'restaurant',
        name: 'Restaurant',
        description: 'Templates for restaurants, cafes, and food businesses',
        icon: '🍽️',
        templates: []
      },
      {
        id: 'landing',
        name: 'Landing Pages',
        description: 'High-converting landing pages for products and services',
        icon: '🚀',
        templates: []
      },
      {
        id: 'blog',
        name: 'Blog',
        description: 'Content-focused templates for blogs and publications',
        icon: '📝',
        templates: []
      }
    ];
  }

  // Template Section Builders
  private getBusinessModernSections(): any[] {
    return [
      {
        id: 'hero-1',
        type: 'hero',
        name: 'Hero Section',
        position: { x: 0, y: 0 },
        styles: { minHeight: '100vh', backgroundColor: '#1a1a2e' },
        content: { title: 'Transform Your Business', subtitle: 'Professional solutions for modern companies' },
        elements: [],
        animations: [],
        responsive: this.getDefaultResponsive(),
        visible: true,
        locked: false,
        zIndex: 1
      },
      {
        id: 'services-1',
        type: 'services',
        name: 'Services',
        position: { x: 0, y: 1 },
        styles: { padding: '80px 0', backgroundColor: '#ffffff' },
        content: { title: 'Our Services', items: [] },
        elements: [],
        animations: [],
        responsive: this.getDefaultResponsive(),
        visible: true,
        locked: false,
        zIndex: 2
      },
      {
        id: 'contact-1',
        type: 'contact',
        name: 'Contact',
        position: { x: 0, y: 2 },
        styles: { padding: '80px 0', backgroundColor: '#f8f9fa' },
        content: { title: 'Get In Touch' },
        elements: [],
        animations: [],
        responsive: this.getDefaultResponsive(),
        visible: true,
        locked: false,
        zIndex: 3
      }
    ];
  }

  private getCreativeAgencySections(): any[] {
    return [
      {
        id: 'hero-creative',
        type: 'hero',
        name: 'Creative Hero',
        position: { x: 0, y: 0 },
        styles: { minHeight: '100vh', backgroundColor: '#ff6b6b' },
        content: { title: 'We Create Amazing Experiences', subtitle: 'Bold ideas, brilliant execution' },
        elements: [],
        animations: [],
        responsive: this.getDefaultResponsive(),
        visible: true,
        locked: false,
        zIndex: 1
      },
      {
        id: 'portfolio-1',
        type: 'gallery',
        name: 'Portfolio',
        position: { x: 0, y: 1 },
        styles: { padding: '100px 0', backgroundColor: '#1a1a2e' },
        content: { title: 'Our Work' },
        elements: [],
        animations: [],
        responsive: this.getDefaultResponsive(),
        visible: true,
        locked: false,
        zIndex: 2
      }
    ];
  }

  private getFashionStoreSections(): any[] {
    return [
      {
        id: 'hero-fashion',
        type: 'hero',
        name: 'Fashion Hero',
        position: { x: 0, y: 0 },
        styles: { minHeight: '90vh', backgroundColor: '#faf0e6' },
        content: { title: 'New Collection 2024', subtitle: 'Elegance meets comfort' },
        elements: [],
        animations: [],
        responsive: this.getDefaultResponsive(),
        visible: true,
        locked: false,
        zIndex: 1
      },
      {
        id: 'products-fashion',
        type: 'products',
        name: 'Featured Products',
        position: { x: 0, y: 1 },
        styles: { padding: '80px 0', backgroundColor: '#ffffff' },
        content: { title: 'Shop The Look' },
        elements: [],
        animations: [],
        responsive: this.getDefaultResponsive(),
        visible: true,
        locked: false,
        zIndex: 2
      }
    ];
  }

  private getMinimalPortfolioSections(): any[] {
    return [
      {
        id: 'hero-minimal',
        type: 'hero',
        name: 'Minimal Hero',
        position: { x: 0, y: 0 },
        styles: { minHeight: '100vh', backgroundColor: '#ffffff' },
        content: { title: 'John Doe', subtitle: 'Designer & Developer' },
        elements: [],
        animations: [],
        responsive: this.getDefaultResponsive(),
        visible: true,
        locked: false,
        zIndex: 1
      },
      {
        id: 'gallery-minimal',
        type: 'gallery',
        name: 'Work Gallery',
        position: { x: 0, y: 1 },
        styles: { padding: '60px 0', backgroundColor: '#f5f5f5' },
        content: { title: 'Selected Works' },
        elements: [],
        animations: [],
        responsive: this.getDefaultResponsive(),
        visible: true,
        locked: false,
        zIndex: 2
      }
    ];
  }

  private getRestaurantSections(): any[] {
    return [
      {
        id: 'hero-restaurant',
        type: 'hero',
        name: 'Restaurant Hero',
        position: { x: 0, y: 0 },
        styles: { minHeight: '100vh', backgroundColor: '#2c1810' },
        content: { title: 'Fine Dining Experience', subtitle: 'Reserve your table today' },
        elements: [],
        animations: [],
        responsive: this.getDefaultResponsive(),
        visible: true,
        locked: false,
        zIndex: 1
      },
      {
        id: 'pricing-menu',
        type: 'pricing',
        name: 'Menu',
        position: { x: 0, y: 1 },
        styles: { padding: '80px 0', backgroundColor: '#f8f4e6' },
        content: { title: 'Our Menu' },
        elements: [],
        animations: [],
        responsive: this.getDefaultResponsive(),
        visible: true,
        locked: false,
        zIndex: 2
      }
    ];
  }

  private getSaaSLandingSections(): any[] {
    return [
      {
        id: 'hero-saas',
        type: 'hero',
        name: 'SaaS Hero',
        position: { x: 0, y: 0 },
        styles: { minHeight: '100vh', backgroundColor: '#667eea' },
        content: { title: 'Grow Your Business Faster', subtitle: 'All-in-one platform for modern teams' },
        elements: [],
        animations: [],
        responsive: this.getDefaultResponsive(),
        visible: true,
        locked: false,
        zIndex: 1
      },
      {
        id: 'features-saas',
        type: 'features',
        name: 'Features',
        position: { x: 0, y: 1 },
        styles: { padding: '100px 0', backgroundColor: '#ffffff' },
        content: { title: 'Everything You Need' },
        elements: [],
        animations: [],
        responsive: this.getDefaultResponsive(),
        visible: true,
        locked: false,
        zIndex: 2
      },
      {
        id: 'pricing-saas',
        type: 'pricing',
        name: 'Pricing',
        position: { x: 0, y: 2 },
        styles: { padding: '100px 0', backgroundColor: '#f7fafc' },
        content: { title: 'Simple Pricing' },
        elements: [],
        animations: [],
        responsive: this.getDefaultResponsive(),
        visible: true,
        locked: false,
        zIndex: 3
      }
    ];
  }

  // Style Presets
  private getDefaultGlobalStyles(): any {
    return {
      primaryColor: '#667eea',
      secondaryColor: '#764ba2',
      accentColor: '#f093fb',
      backgroundColor: '#ffffff',
      textColor: '#2d3748',
      fontFamily: "'Inter', sans-serif",
      fontSize: { h1: '3rem', h2: '2.5rem', h3: '2rem', body: '1rem' },
      spacing: { small: '0.5rem', medium: '1rem', large: '2rem' },
      borderRadius: '0.5rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      customCSS: ''
    };
  }

  private getCreativeGlobalStyles(): any {
    return {
      ...this.getDefaultGlobalStyles(),
      primaryColor: '#ff6b6b',
      secondaryColor: '#4ecdc4',
      accentColor: '#ffe66d',
      fontFamily: "'Poppins', sans-serif"
    };
  }

  private getFashionGlobalStyles(): any {
    return {
      ...this.getDefaultGlobalStyles(),
      primaryColor: '#c9ada7',
      secondaryColor: '#9a8c98',
      accentColor: '#4a4e69',
      backgroundColor: '#faf0e6',
      fontFamily: "'Playfair Display', serif"
    };
  }

  private getMinimalGlobalStyles(): any {
    return {
      ...this.getDefaultGlobalStyles(),
      primaryColor: '#000000',
      secondaryColor: '#666666',
      accentColor: '#999999',
      fontFamily: "'Helvetica Neue', sans-serif"
    };
  }

  private getRestaurantGlobalStyles(): any {
    return {
      ...this.getDefaultGlobalStyles(),
      primaryColor: '#8b4513',
      secondaryColor: '#d4a574',
      accentColor: '#f4e4c1',
      backgroundColor: '#2c1810',
      textColor: '#f8f4e6',
      fontFamily: "'Cormorant Garamond', serif"
    };
  }

  private getSaaSGlobalStyles(): any {
    return {
      ...this.getDefaultGlobalStyles(),
      primaryColor: '#667eea',
      secondaryColor: '#764ba2',
      accentColor: '#f093fb'
    };
  }

  private getDefaultResponsive(): any {
    return {
      mobile: { visible: true, styles: {} },
      tablet: { visible: true, styles: {} },
      desktop: { visible: true, styles: {} }
    };
  }
}
