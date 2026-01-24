import { Injectable } from '@angular/core';
import { VariantService, PageSection } from '../../../services/variant.service';

interface TemplateBlueprint {
  id: string;
  name: string;
  category: string;
  variant: string;
  sections: PageSection[];
  globalConfig: any;
}

@Injectable({
  providedIn: 'root'
})
export class VariantTemplateService {

  private industryTemplates: { [key: string]: TemplateBlueprint } = {
    'fitness': {
      id: 'fitness',
      name: 'Power Gym',
      category: 'Deportes',
      variant: 'cyberpunk',
      globalConfig: {
        header: { title: 'IRON GYM', subtitle: 'Push your limits', variant: 'cyberpunk' },
        hero: { 
           title: 'TRANSFORMA TU CUERPO', 
           subtitle: 'Entrenamiento de alto rendimiento para quienes buscan la excelencia.',
           ctaLabel: 'EMPIEZA HOY',
           variant: 'cyberpunk'
        },
        features: {
            variant: 'cyberpunk',
            items: [
                { title: 'Zona de Pesas', description: 'Maquinaria de última generación.', icon: '🏋️' },
                { title: 'CrossFit', description: 'WODs desafiantes cada día.', icon: '🔥' },
                { title: 'Nutrición', description: 'Planes personalizados.', icon: '🍎' }
            ]
        },
        stats: {
           items: [
              { label: 'Atletas', value: '500+', icon: '🏃' },
              { label: 'Entrenadores', value: '15', icon: '👨‍🏫' },
              { label: 'Kilos Levantados', value: '10M', icon: '💪' }
           ]
        },
        pricing: {
           rows: [
              { plan: 'Diario', price: '10€', features: 'Acceso 1 día' },
              { plan: 'Mensual', price: '45€', features: 'Acceso total + Clases' },
              { plan: 'Anual', price: '400€', features: 'VIP + Toalla gratis' }
           ]
        }
      },
      sections: [
        { id: 'gym_hero', type: 'hero', label: 'Hero Fitness', visible: true, name: 'Hero', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'gym_stats', type: 'stats', label: 'Logros', visible: true, name: 'Stats', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'gym_pricing', type: 'pricing', label: 'Membresías', visible: true, name: 'Pricing', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'gym_features', type: 'features', label: 'Disciplinas', visible: true, name: 'Features', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'gym_contact', type: 'contact', label: 'Únete', visible: true, name: 'Contact', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' }
      ]
    },
    'clinic': {
      id: 'clinic',
      name: 'MediCare+',
      category: 'Salud',
      variant: 'glass', 
      globalConfig: {
        header: { title: 'MediCare', subtitle: 'Tu salud es lo primero', variant: 'glass' },
        hero: { 
           title: 'Atención Médica de Calidad', 
           subtitle: 'Especialistas comprometidos con tu bienestar integral.',
           ctaLabel: 'PEDIR CITA',
           variant: 'glass'
        },
        features: {
            variant: 'glass',
            items: [
                { title: 'Cardiología', description: 'Cuidado experto para tu corazón.', icon: '❤️' },
                { title: 'Pediatría', description: 'Atención dulce para los pequeños.', icon: '👶' },
                { title: 'Análisis', description: 'Resultados rápidos y precisos.', icon: '🔬' }
            ]
        },
        faq: {
           items: [
              { title: '¿Aceptan seguros?', content: 'Trabajamos con las principales aseguradoras.', expanded: false },
              { title: '¿Hay parquin?', content: 'Disponemos de parquin gratuito para pacientes.', expanded: false }
           ]
        }
      },
      sections: [
        { id: 'med_hero', type: 'hero', label: 'Hero Médico', visible: true, name: 'Hero', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'med_features', type: 'features', label: 'Especialidades', visible: true, name: 'Specialties', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'med_faq', type: 'faq', label: 'Dudas', visible: true, name: 'FAQ', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'med_contact', type: 'contact', label: 'Cita Previa', visible: true, name: 'Booking', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' }
      ]
    },
    'agency': {
      id: 'agency',
      name: 'Pixel Agency',
      category: 'Diseño',
      variant: 'neon',
      globalConfig: {
        header: { title: 'PIXEL', subtitle: 'Digital Dreams', variant: 'neon' },
        hero: { 
           title: 'CREAMOS LO IMPOSIBLE', 
           subtitle: 'Diseño y desarrollo web disruptivo para marcas audaces.',
           ctaLabel: 'VER PROYECTOS',
           variant: 'neon'
        },
        features: {
            variant: 'neon',
            items: [
                { title: 'Web Design', description: 'Interfaces que enamoran.', icon: '🎨' },
                { title: 'DevOps', description: 'Escalabilidad sin límites.', icon: '☁️' },
                { title: 'Branding', description: 'Identidad con alma.', icon: '✨' }
            ]
        },
        stats: {
           items: [
              { label: 'Proyectos', value: '150+', icon: '🚀' },
              { label: 'Premios', value: '12', icon: '🏆' }
           ]
        },
        gallery: {
           images: [
              { src: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d', alt: 'P1' },
              { src: 'https://images.unsplash.com/photo-1558655146-d09347e92766', alt: 'P2' }
           ]
        }
      },
      sections: [
        { id: 'acc_hero', type: 'hero', label: 'Hero Agencia', visible: true, name: 'Hero', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'acc_gallery', type: 'gallery', label: 'Portfolio', visible: true, name: 'Work', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'acc_stats', type: 'stats', label: 'Performance', visible: true, name: 'Stats', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'acc_features', type: 'features', label: 'Servicios VIP', visible: true, name: 'Services', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'acc_contact', type: 'contact', label: 'Charlemos', visible: true, name: 'Contact', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' }
      ]
    },
    'spa': {
      id: 'spa',
      name: 'Serenity Spa',
      category: 'Salud',
      variant: 'glass',
      globalConfig: {
        header: { title: 'SERENITY', subtitle: 'Wellness & Spa', variant: 'glass' },
        hero: { title: 'ENCUENTRA TU PAZ', subtitle: 'Tratamientos holísticos para cuerpo y mente.', ctaLabel: 'RESERVAR', variant: 'glass' },
        features: { items: [{title:'Masajes', icon:'💆'}, {title:'Hydroterapia', icon:'💧'}, {title:'Faciales', icon:'🧖'}] }
      },
      sections: [
        { id: 'hero_spa', type: 'hero', label: 'Hero Spa', visible: true, name: 'Hero', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'services_spa', type: 'features', label: 'Tratamientos', visible: true, name: 'Services', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'gallery_spa', type: 'gallery', label: 'Ambiente', visible: true, name: 'Gallery', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'contact_spa', type: 'contact', label: 'Contacto', visible: true, name: 'Contact', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' }
      ]
    },
    'barber-shop': {
      id: 'barber-shop',
      name: 'Gentleman Barber',
      category: 'Belleza',
      variant: 'retro',
      globalConfig: {
        header: { title: 'THE BARBER', subtitle: 'Clásicos del afeitado', variant: 'retro' },
        hero: { title: 'ESTILO Y TRADICIÓN', subtitle: 'Cortes clásicos para el hombre moderno.', ctaLabel: 'RESERVAR', variant: 'retro' },
        features: { items: [{title:'Corte Degradado', icon:'✂️'}, {title:'Barba Ritual', icon:'🪒'}, {title:'Masaje Capilar', icon:'💆‍♂️'}] },
        pricing: { rows: [{plan:'Corte', price:'18€'}, {plan:'Barba', price:'12€'}, {plan:'Combo', price:'25€'}] }
      },
      sections: [
        { id: 'barb_hero', type: 'hero', label: 'Cabecera', visible: true, name: 'Hero', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'barb_pricing', type: 'pricing', label: 'Tarifas', visible: true, name: 'Pricing', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'barb_contact', type: 'contact', label: 'Contacto', visible: true, name: 'Contact', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' }
      ]
    },
    'restaurant': {
      id: 'restaurant',
      name: 'Gourmet Rest',
      category: 'Gastronomía',
      variant: 'glass',
      globalConfig: {
        header: { title: 'L’Artiste', subtitle: 'Cuisine Fine', variant: 'glass' },
        hero: { title: 'EXPERIENCIA SENSORIAL', subtitle: 'Sabores que cuentan una historia en cada plato.', ctaLabel: 'VER CARTA', variant: 'glass' },
        features: { items: [{title:'Ingredientes Km 0', icon:'🥗'}, {title:'Vinos Selección', icon:'🍷'}, {title:'Chef Estrella', icon:'👨‍🍳'}] },
        gallery: { images: [{src:'/1029.png', alt:'Plato 1'}, {src:'/1090.png', alt:'Plato 2'}] }
      },
      sections: [
        { id: 'rest_hero', type: 'hero', label: 'Portada', visible: true, name: 'Hero', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'rest_features', type: 'features', label: 'Nuestra Filosofía', visible: true, name: 'Features', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'rest_gallery', type: 'gallery', label: 'Platos', visible: true, name: 'Gallery', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'rest_contact', type: 'contact', label: 'Reservar Mesa', visible: true, name: 'Contact', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' }
      ]
    },
    'school': {
      id: 'school',
      name: 'Academy Plus',
      category: 'Educación',
      variant: 'default',
      globalConfig: {
        header: { title: 'ACADEMY', subtitle: 'Forjando el futuro', variant: 'default' },
        hero: { title: 'APRENDIZAJE SIN LÍMITES', subtitle: 'Formación de alto nivel con los mejores expertos.', ctaLabel: 'MATRICÚLATE', variant: 'default' },
        features: { items: [{title:'Soporte 24/7', icon:'🎓'}, {title:'Título Oficial', icon:'📜'}, {title:'Prácticas', icon:'💼'}] },
        stats: { items: [{label:'Alumnos', value:'1000+'}, {label:'Profesores', value:'40'}] }
      },
      sections: [
        { id: 'edu_hero', type: 'hero', label: 'Bienvenida', visible: true, name: 'Hero', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'edu_stats', type: 'stats', label: 'Cifras', visible: true, name: 'Stats', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'edu_features', type: 'features', label: 'Ventajas', visible: true, name: 'Features', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'edu_contact', type: 'contact', label: 'Más Info', visible: true, name: 'Contact', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' }
      ]
    }
  };

  constructor(private variantService: VariantService) {}

  applyTemplate(templateId: string) {
    const blueprint = this.industryTemplates[templateId];
    if (!blueprint) {
        console.warn(`Template ${templateId} not found`);
        // Fallback to agency if not found
        const fallback = this.industryTemplates['agency'];
        if (fallback) this.applyTemplate('agency');
        return;
    }

    // 1. Apply Global Variant (Theme)
    this.variantService.setGlobalVariant(blueprint.variant);

    // 2. Apply Section Structure (LAYOUT)
    // This is the CRITICAL part: changing the order and types of sections
    this.variantService.setSections([...blueprint.sections]);

    // 3. Update Component Configurations (CONTENT)
    if (blueprint.globalConfig) {
        const conf = blueprint.globalConfig;
        if (conf.header) this.variantService.setHeaderConfig(conf.header);
        if (conf.hero) this.variantService.setHeroConfig(conf.hero);
        if (conf.features) this.variantService.setFeaturesConfig(conf.features);
        if (conf.stats) this.variantService.setStatsConfig(conf.stats);
        if (conf.pricing) this.variantService.setPricingConfig(conf.pricing);
        if (conf.gallery) this.variantService.setGalleryConfig(conf.gallery);
        if (conf.faq) this.variantService.setFaqConfig(conf.faq);
        if (conf.contact) this.variantService.setTitleConfig(conf.contact); // Title for contact sections
    }
    
    console.log(`Applied template: ${blueprint.name} with ${blueprint.sections.length} sections`);
  }

  saveAsCustomTemplate() {
    const name = prompt('Nombre para tu plantilla personalizada:', 'Nueva Plantilla');
    if (name) {
      const config = this.variantService.getFullConfig();
      const templates = JSON.parse(localStorage.getItem('custom_templates') || '[]');
      templates.push({
        ...config,
        id: `custom_${new Date().getTime()}`,
        name,
        category: 'Personalizado',
        icon: '💎'
      });
      localStorage.setItem('custom_templates', JSON.stringify(templates));
      alert('Plantilla guardada correctamente en el navegador.');
    }
  }
  onTemplateApplied() {
    // Stub
  }
}