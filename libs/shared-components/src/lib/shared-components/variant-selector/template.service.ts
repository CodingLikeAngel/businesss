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
        header: { title: 'IRON GYM', subtitle: 'Hams & Glutes', variant: 'cyberpunk' },
        hero: { 
           title: 'TRANSFORMA TU CUERPO', 
           subtitle: 'Entrenamiento de alto rendimiento para quienes no aceptan excusas.',
           ctaLabel: 'EMPIEZA HOY GRATIS',
           variant: 'cyberpunk',
           customStyles: { '--hero-gradient': 'linear-gradient(to right, #000000, #434343)' }
        },
        features: {
            variant: 'cyberpunk',
            items: [
                { title: 'Maquinaria Pro', description: 'Equipamiento Hammer Strength de última generación.', icon: '🏋️' },
                { title: 'Entrenadores Elite', description: 'Atletas olímpicos guiando tu progreso.', icon: '🏆' },
                { title: 'Abierto 24/7', description: 'Tu ritmo, tus horarios. Sin límites.', icon: 'clock' }
            ]
        }
      },
      sections: [
        { id: 'hero_gym', type: 'hero', label: 'Hero Gym', visible: true, name: 'Hero', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'features_gym', type: 'features', label: 'Ventajas Gym', visible: true, name: 'Features', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'pricing_gym', type: 'pricing', label: 'Planes', visible: true, name: 'Pricing', styles: {}, content: { title: 'Membresías' }, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'gallery_gym', type: 'gallery', label: 'Instalaciones', visible: true, name: 'Gallery', styles: {}, content: { title: 'Zona de Guerra' }, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'contact_gym', type: 'contact', label: 'Join Us', visible: true, name: 'Contact', styles: {}, content: { title: 'Únete al Club' }, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' }
      ]
    },
    'clinic': {
      id: 'clinic',
      name: 'MediCare',
      category: 'Salud',
      variant: 'neon', 
      globalConfig: {
        header: { title: 'MediCare+', subtitle: 'Salud Integral', variant: 'glass' },
        hero: { 
           title: 'Cuidamos lo más importante', 
           subtitle: 'Medicina avanzada con un toque humano. Especialistas en tu bienestar.',
           ctaLabel: 'Pedir Cita Previa',
           variant: 'glass',
           customStyles: { '--hero-gradient': 'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)' } 
        },
        features: {
            variant: 'glass',
            items: [
                { title: 'Urgencias 24h', description: 'Siempre disponibles para ti y tu familia.', icon: '🚑' },
                { title: 'Telemedicina', description: 'Consultas por videollamada desde casa.', icon: '💻' },
                { title: 'Laboratorio Propio', description: 'Resultados en el mismo día.', icon: '🔬' }
            ]
        }
      },
      sections: [
        { id: 'hero_clinic', type: 'hero', label: 'Hero Clinic', visible: true, name: 'Hero', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'features_clinic', type: 'features', label: 'Servicios Médicos', visible: true, name: 'Services', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'team_clinic', type: 'services', label: 'Doctores', visible: true, name: 'Team', styles: {}, content: { title: 'Nuestro Equipo Médico' }, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'faq_clinic', type: 'faq', label: 'Preguntas', visible: true, name: 'FAQ', styles: {}, content: { title: 'Dudas Frecuentes' }, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'contact_clinic', type: 'contact', label: 'Cita', visible: true, name: 'Contact', styles: {}, content: { title: 'Agenda tu visita' }, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' }
      ]
    },
    'agency': {
      id: 'agency',
      name: 'Creative Studio',
      category: 'Diseño',
      variant: 'glass',
      globalConfig: {
        header: { title: 'AURA', subtitle: 'Digital Experiences', variant: 'glass' },
        hero: { 
           title: 'WE DESIGN FUTURE', 
           subtitle: 'Agencia de productos digitales premiada internacionalmente.',
           ctaLabel: 'Ver Portfolio',
           variant: 'glass',
           customStyles: {}
        },
        features: {
            variant: 'glass',
            items: [
                { title: 'Estrategia de Marca', description: 'Posicionamiento que deja huella.', icon: '✨' },
                { title: 'Desarrollo Web', description: 'Código limpio, performance extrema.', icon: '🚀' },
                { title: 'Marketing', description: 'Campañas que convierten.', icon: '📈' }
            ]
        }
      },
      sections: [
        { id: 'hero_agency', type: 'hero', label: 'Hero Agency', visible: true, name: 'Hero', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'showcase_agency', type: 'gallery', label: 'Showcase', visible: true, name: 'Work', styles: {}, content: { title: 'Últimos Proyectos' }, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'stats_agency', type: 'stats', label: 'Impacto', visible: true, name: 'Stats', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'features_agency', type: 'features', label: 'Servicios', visible: true, name: 'Services', styles: {}, content: {}, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' },
        { id: 'contact_agency', type: 'contact', label: 'Briefing', visible: true, name: 'Contact', styles: {}, content: { title: 'Empecemos' }, elements: [], config: {}, customStyles: {}, animation: 'none', layout: 'default' }
      ]
    }
  };

  constructor(private variantService: VariantService) {}

  applyTemplate(templateId: string) {
    const blueprint = this.industryTemplates[templateId];
    if (!blueprint) {
        console.warn(`Template ${templateId} not found`);
        return;
    }

    // 1. Apply Global Variant
    this.variantService.setGlobalVariant(blueprint.variant);

    // 2. Apply Section Structure
    this.variantService.setSections(blueprint.sections);

    // 3. Update Component Configurations
    if (blueprint.globalConfig) {
        const conf = blueprint.globalConfig;
        if (conf.header) this.variantService.setHeaderConfig(conf.header);
        if (conf.hero) this.variantService.setHeroConfig(conf.hero);
        if (conf.features) this.variantService.setFeaturesConfig(conf.features);
    }
    
    console.log(`Applied template: ${blueprint.name}`);
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