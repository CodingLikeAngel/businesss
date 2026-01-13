import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AnimatedCardAnimation, AnimatedCardVariant, CardAnimation, CardPremiumConfig, CardVariant, HeroIcon, NavLink, TableColumn, TableRow } from '@negocio/ui-components';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
interface NavItem {
  label: string;
  sectionId: string;
  icon?: string;
}
@Component({
  selector: 'lib-base-feature-about-page',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
  ],
  template: `
  <router-outlet></router-outlet>
`,

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseFeatureAboutPageComponent {
  // Header configuration
  headerConfig = {
    title: 'Anto Studios',
    subtitle: 'Soluciones tecnológicas que impulsan tu negocio',
    variant: 'primary' as const,
    align: 'left' as const,
    dark: false,
    navItems: [
      { label: 'Inicio', href: '/', active: false },
      { label: 'about', href: '/about', active: true },
      { label: 'Contacto', href: '/contact', active: false },
    ],
    customStyles: {
      // '--header-bg': 'linear-gradient(135deg, #0891b2, #22d3ee)',
      // '--header-color': '#ffffff',
      // '--header-border': 'none',
      // '--header-shadow': '0 4px 6px rgba(0, 0, 0, 0.1)',
      // '--header-hover-bg': '#164e63',
      // '--header-hover-shadow': '0 6px 12px rgba(0, 0, 0, 0.15)',
    },
  };

   navItemsConfig: NavItem[] = [
    { label: 'Sobre Nosotros', sectionId: 'about-hero' },
    { label: 'Misión', sectionId: 'mission' },
    { label: 'Visión', sectionId: 'vision' },
    { label: 'Equipo', sectionId: 'team' },
    { label: 'Valores', sectionId: 'values' },
    { label: 'Servicios', sectionId: 'sales-dossier' },
    { label: 'Contacto', sectionId: 'cta' },
  ];


  
   tabsConfig: any[] = [
    { label: 'Sobre Nosotros', sectionId: 'about-hero', icon: '🌟', active: true },
    { label: 'Misión', sectionId: 'mission', icon: '🎯' },
    { label: 'Visión', sectionId: 'vision', icon: '👁️' },
    { label: 'Equipo', sectionId: 'team', icon: '👥' },
    { label: 'Valores', sectionId: 'values', icon: '💎' },
    { label: 'Servicios', sectionId: 'sales-dossier', icon: '💼' },
    { label: 'Contacto', sectionId: 'cta', icon: '📞' },
  ];

  navLinks: NavLink[] = [ { label: 'Inicio', href: '#hero', icon: '🏠' },
    { label: 'Servicios', href: '#servicios', icon: '🛠️' },];

  // Mission cards
  missionCards = [
    {
      icon: '🌟',
      title: 'Innovación',
      description: 'Creamos soluciones tecnológicas que transforman el futuro.',
      variant: 'ne-animated' as AnimatedCardVariant,
      animation: 'bounce' as AnimatedCardAnimation,
      backgroundColor: 'rgba(34, 211, 238, 0.1)',
      borderColor: '#22d3ee',
    },
    {
      icon: '🚀',
      title: 'Impacto',
      description: 'Construimos herramientas que empoderan a las personas.',
      variant: 'feature' as AnimatedCardVariant,
      animation: 'pulse' as AnimatedCardAnimation,
      backgroundColor: 'rgba(74, 222, 128, 0.1)',
      borderColor: '#4ade80',
    },
    {
      icon: '💡',
      title: 'Colaboración',
      description: 'Trabajamos juntos para alcanzar la excelencia.',
      variant: 'minimal' as AnimatedCardVariant,
      animation: 'float' as AnimatedCardAnimation,
      backgroundColor: 'rgba(244, 114, 182, 0.1)',
      borderColor: '#f472b6',
    },
  ];

  // Vision card
// Card 1
premiumCardConfig1: CardPremiumConfig = {
  icon: 'heroRocketLaunch' as HeroIcon,
  title: 'Nuestra Visión',
  description: 'Liderar la innovación tecnológica con soluciones únicas y escalables.',
  image: 'https://via.placeholder.com/300',
  price: '',
  discount: '',
  tooltip: 'Descubre nuestra visión para el futuro',
  gradient: 'linear-gradient(135deg, #22d3ee, #4ade80)',
};

// Card 2
premiumCardConfig2: CardPremiumConfig = {
  icon: 'heroLightBulb' as HeroIcon,
  title: 'Innovación Constante',
  description: 'Impulsamos ideas disruptivas para transformar industrias y mejorar vidas.',
  image: 'https://via.placeholder.com/300x200/1e3a8a/ffffff?text=Innovación',
  price: '',
  discount: '',
  tooltip: 'Nuestra filosofía de innovación constante',
  gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
};

// Card 3
premiumCardConfig3: CardPremiumConfig = {
  icon: 'heroGlobeAlt' as HeroIcon,
  title: 'Impacto Global',
  description: 'Creamos soluciones que marcan la diferencia a nivel mundial.',
  image: 'https://via.placeholder.com/300x200/047857/ffffff?text=Impacto',
  price: '',
  discount: '',
  tooltip: 'Cómo generamos impacto alrededor del mundo',
  gradient: 'linear-gradient(135deg, #14b8a6, #10b981)',
};

  // Team cards
  teamCards = [
    {
      title: 'Pepino Cósmico',
      description: 'Jefe supremo de absolutamente nada. Solo está aquí porque sí.',
      image: 'https://placebeard.it/200x200',
      variant: 'holo' as CardVariant,
      animation: 'zoom' as CardAnimation,
      actions: [{ label: 'Ver su gato', href: 'https://saludosalvecino.com', variant: 'ghost' }],
    },
    {
      title: 'ChatGPTín de León',
      description: 'IA entrenada para fingir que esto lo ha hecho un equipo enorme.',
      image: 'https://api.dicebear.com/7.x/thumbs/svg?seed=GPTin',
      variant: 'cyberpunk' as CardVariant,
      animation: 'slide-up' as CardAnimation,
      actions: [{ label: 'No hagas clic', href: 'https://example.com', variant: 'ghost' }],
    },
    {
      title: 'Tu Vecino el del 5º',
      description: 'No sabe programar, pero opinó sobre el logo y ya es parte del equipo.',
      image: 'https://placebeard.it/200x200',
      variant: 'neon' as CardVariant,
      animation: 'wiggle' as CardAnimation,
      actions: [{ label: 'Salúdale', href: 'https://saludosalvecino.com', variant: 'ghost' }],
    },
  ];

   // Team cards
   teamCardsMobile = [
 
    {
      title: 'ChatGPTín de León',
      description: 'IA entrenada para fingir que esto lo ha hecho un equipo enorme.',
      image: 'https://api.dicebear.com/7.x/thumbs/svg?seed=GPTin',
      variant: 'cyberpunk' as CardVariant,
      animation: 'slide-up' as CardAnimation,
      actions: [{ label: 'No hagas clic', href: 'https://example.com', variant: 'ghost' }],
    },
    {
      title: 'Tu Vecino el del 5º',
      description: 'No sabe programar, pero opinó sobre el logo y ya es parte del equipo.',
      image: 'https://placebeard.it/200x200',
      variant: 'neon' as CardVariant,
      animation: 'wiggle' as CardAnimation,
      actions: [{ label: 'Salúdale', href: 'https://saludosalvecino.com', variant: 'ghost' }],
    },
  ];
  
  // Values chips
  valuesChips = ['Innovación', 'Tecnología', 'Sostenibilidad', 'Colaboración'];

  // Table data for "Módulos Disponibles"
  moduleColumns: TableColumn[] = [
    { key: 'name', label: 'Módulo' },
    { key: 'description', label: 'Descripción' },
    { key: 'price', label: 'Precio Aproximado' },
  ];

  moduleRows: TableRow[] = [
    { name: 'Reservas online', description: 'Calendario con disponibilidad y notificaciones', price: '200-300€' },
    { name: 'Tienda simple', description: 'Muestra de productos, sin pago', price: '150€' },
    { name: 'Tienda con pago', description: 'Carrito + Stripe o Redsys', price: '500€' },
    { name: 'Facturación', description: 'Generación de tickets y facturas PDF', price: '300€' },
    { name: 'Multiidioma', description: 'Español, inglés, etc.', price: '150€' },
    { name: 'Estadísticas', description: 'Panel con visitas, clics, etc.', price: '200€' },
    { name: 'Usuarios', description: 'Login y gestión de clientes', price: '300€' },
    { name: 'Email Marketing', description: 'Captura de correos y envíos', price: '100€' },
  ];

  // Testimonials
  testimonials = [
    {
      quote: 'Tenía una web en Wix que parecía de juguete. Ahora tengo una web profesional que me trae clientes cada semana.',
      author: 'Carlos, dueño de un centro de estética',
    },
    {
      quote: 'Con WordPress todo eran problemas. Esta web es más rápida, más clara y mucho más bonita.',
      author: 'Lucía, propietaria de casa rural en León',
    },
    {
      quote: 'Es la primera vez que un informático me habla claro y cumple plazos. Profesional de 10.',
      author: 'Pedro, bar-restaurante familiar',
    },
  ];

  handleContactClick(event: Event): void {
    console.log('Contact button clicked', event);
    // Example: Open WhatsApp
    // window.open('https://wa.me/1234567890?text=¡Hola! Quiero una demo personalizada.', '_blank');
  }

  onViewDetails(details: any): void {
    console.log('Card details:', details);
  }
}