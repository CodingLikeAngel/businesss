// Vue 3 Exporter
// Genera componentes Vue 3 con Composition API y TypeScript

import { Injectable } from '@angular/core';
import { ComponentMetadata } from '../models/export.models';
import { ExporterBase } from './exporter-base';

@Injectable({ providedIn: 'root' })
export class VueExporter extends ExporterBase {
  
  generate(component: ComponentMetadata): string {
    return `<template>
  <${component.htmlTag}
    :class="computedClass"
    :disabled="disabled"
    ${this.generateEventHandlers(component)}
  >
    <slot></slot>
  </${component.htmlTag}>
</template>

<script setup lang="ts">
${this.generateScriptSetup(component)}
</script>

${this.generateStyles(component)}
    `.trim();
  }

  private generateScriptSetup(component: ComponentMetadata): string {
    const imports = ['computed'];

    if (component.props.some(p => p.type === 'function')) {
      imports.push('ref');
    }

    const propsInterface = component.props.length > 0 
      ? this.generatePropsInterface(component.props, component.name)
      : '';

    const propsDefaults = component.props
      .filter(p => p.defaultValue !== undefined)
      .map(p => `  ${p.name}: ${this.formatPropValue(p.defaultValue)}`)
      .join(',\n');

    const withDefaults = propsDefaults 
      ? `
withDefaults(defineProps<${component.name}Props>(), {
${propsDefaults}
})`
      : `defineProps<${component.name}Props>()`;

    const emit = component.events.length > 0
      ? `
defineEmits<{
  ${component.events.map(e => `  (e: '${e.name}', payload: ${this.mapTypeToTypeScript(e.type)}): void`).join('\n  ')}
}>()`
      : '';

    const computedClass = `
const computedClass = computed(() => 
  \`${component.baseClassName}\${props.variant ? ' ' + props.variant : ''}\`.trim()
);`;

    const handlers = component.events
      .filter(e => e.name === 'click' || e.name === 'onClick')
      .map(() => `
function handleClick(event: Event) {
  emit('click', event);
}`)
      .join('\n');

    return `import { ${imports.join(', ')} } from 'vue';

${propsInterface}
const props = ${withDefaults};${emit}${computedClass}${handlers}
    `.trim();
  }

  private generateEventHandlers(component: ComponentMetadata): string {
    const handlers: string[] = [];

    if (component.events.some(e => e.name === 'click' || e.name === 'onClick')) {
      handlers.push(`@click="$emit('click', $event)"`);
    }

    return handlers.join('\n    ');
  }

  private generateStyles(component: ComponentMetadata): string {
    if (!component.styles || !component.styles.content) {
      return `<!-- Add scoped styles -->
<style scoped>
.${component.baseClassName} {
  /* Add your styles here */
}
</style>`;
    }

    return `<style scoped>
${component.styles.content}
</style>`;
  }
}
