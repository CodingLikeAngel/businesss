// Exporter Base Class
// Clase base para todos los exporters de framework

import { Injectable } from '@angular/core';
import { ComponentMetadata, PropDefinition, ExportOptions } from '../models/export.models';

@Injectable({ providedIn: 'root' })
export abstract class ExporterBase {
  
  protected indent(text: string, spaces: number): string {
    const indent = ' '.repeat(spaces);
    return text.split('\n').map(line => line ? indent + line : line).join('\n');
  }

  protected toKebabCase(name: string): string {
    return name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }

  protected toCamelCase(name: string): string {
    return name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  protected mapTypeToTypeScript(type: string): string {
    const typeMap: Record<string, string> = {
      'string': 'string',
      'number': 'number',
      'boolean': 'boolean',
      'function': '() => void',
      'array': 'any[]',
      'object': 'Record<string, any>',
      'ReactNode': 'React.ReactNode',
      'Event': 'React.MouseEvent'
    };
    return typeMap[type] || 'any';
  }

  protected formatPropValue(value: any): string {
    if (typeof value === 'string') return `'${value}'`;
    if (typeof value === 'boolean') return String(value);
    if (typeof value === 'number') return String(value);
    if (Array.isArray(value)) return JSON.stringify(value);
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  protected generatePropsInterface(props: PropDefinition[], componentName: string): string {
    if (props.length === 0) return '';

    const propsInterface = props.map(prop => {
      const tsType = this.mapTypeToTypeScript(prop.type);
      const optional = prop.required ? '' : '?';
      const description = prop.description ? `  // ${prop.description}` : '';
      return `  ${prop.name}${optional}: ${tsType};${description}`;
    }).join('\n');

    return `
export interface ${componentName}Props {
${propsInterface}
}
    `.trim();
  }

  protected generateDefaultProps(props: PropDefinition[]): string {
    const defaults = props
      .filter(p => p.defaultValue !== undefined)
      .map(p => `  ${p.name}: ${this.formatPropValue(p.defaultValue)}`);

    if (defaults.length === 0) return '';

    return `
const defaultProps = {
${defaults.join(',\n')}
};
    `.trim();
  }

  abstract generate(component: ComponentMetadata): string;
}
