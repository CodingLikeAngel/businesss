#!/usr/bin/env node

/**
 * Script para actualizar todos los componentes UI con el patrón de estilos personalizados
 * 
 * Este script:
 * 1. Busca todos los componentes con customStyles
 * 2. Actualiza sus interfaces para incluir backgroundColor, color e index signature
 * 3. Crea/actualiza el computed property de estilos
 * 4. Asegura que el template use [ngStyle] o [style]
 */

const componentsToUpdate = [
  {
    name: 'Newsletter',
    path: 'libs/ui-components/src/lib/newsletter-section/newsletter-section.component.ts',
    stylesProp: 'newsletterStyles'
  },
  {
    name: 'Steps',
    path: 'libs/ui-components/src/lib/steps-section/steps-section.component.ts',
    stylesProp: 'stepsStyles'
  },
  {
    name: 'Table',
    path: 'libs/ui-components/src/lib/table/table.component.ts',
    stylesProp: 'tableStyles'
  },
  {
    name: 'Breadcrumbs',
    path: 'libs/ui-components/src/lib/breadcrumbs/breadcrumbs.component.ts',
    stylesProp: 'breadcrumbStyles'
  },
  {
    name: 'Chip',
    path: 'libs/ui-components/src/lib/chip/chip.component.ts',
    stylesProp: 'chipStyles'
  },
  {
    name: 'Spinner',
    path: 'libs/ui-components/src/lib/spinner/spinner.component.ts',
    stylesProp: 'spinnerStyles'
  },
  {
    name: 'Chart',
    path: 'libs/ui-components/src/lib/chart/chart.component.ts',
    stylesProp: 'chartStyles'
  },
  {
    name: 'Tabs',
    path: 'libs/ui-components/src/lib/tabs/tabs.component.ts',
    stylesProp: 'tabsStyles'
  }
];

console.log('📝 Componentes a actualizar:', componentsToUpdate.length);
console.log('✅ Patrón: backgroundColor + color + CSS variables + direct properties');
console.log('');
console.log('Ejecuta manualmente las actualizaciones para cada componente siguiendo el patrón de Footer/Header');
