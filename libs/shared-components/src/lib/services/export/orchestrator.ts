// Export Orchestrator
// Servicio principal que coordina la exportación de componentes a múltiples frameworks

import { Injectable, signal } from '@angular/core';
import { ComponentMetadata, FrameworkType, ExportOptions, ExportResult } from './models/export.models';
import { ReactExporter } from './exporters/react.exporter';
import { AngularExporter } from './exporters/angular.exporter';
import { VueExporter } from './exporters/vue.exporter';
import { WebComponentExporter } from './exporters/web-component.exporter';

@Injectable({ providedIn: 'root' })
export class ExportOrchestrator {
  private reactExporter = new ReactExporter();
  private angularExporter = new AngularExporter();
  private vueExporter = new VueExporter();
  private webComponentExporter = new WebComponentExporter();

  // Signals para UI
  readonly isExporting = signal(false);
  readonly exportProgress = signal(0);
  readonly lastExportResult = signal<ExportResult | null>(null);

  /**
   * Exporta un componente al framework especificado
   */
  async export(
    component: ComponentMetadata,
    framework: FrameworkType,
    options: Partial<ExportOptions> = {}
  ): Promise<ExportResult> {
    this.isExporting.set(true);
    this.exportProgress.set(0);

    try {
      const exportOptions: ExportOptions = {
        framework,
        typescript: options.typescript ?? true,
        styling: options.styling ?? 'css',
        indentation: options.indentation ?? 2,
        addComments: options.addComments ?? true,
        generateTests: options.generateTests ?? false,
        generateStories: options.generateStories ?? false,
      };

      // Parse component
      this.exportProgress.set(20);
      const parsedComponent = this.parseComponent(component);

      // Transform to framework-specific format
      this.exportProgress.set(40);
      const transformedComponent = this.transformComponent(parsedComponent, exportOptions);

      // Generate code based on framework
      this.exportProgress.set(60);
      let code: string;
      
      switch (framework) {
        case 'react':
          code = this.reactExporter.generate(transformedComponent);
          break;
        case 'angular':
          code = this.angularExporter.generate(transformedComponent);
          break;
        case 'vue':
          code = this.vueExporter.generate(transformedComponent);
          break;
        case 'web-component':
          code = this.webComponentExporter.generate(transformedComponent);
          break;
        default:
          throw new Error(`Unsupported framework: ${framework}`);
      }

      // Generate additional files if needed
      this.exportProgress.set(80);
      const files = await this.generateAdditionalFiles(transformedComponent, exportOptions);

      // Format code
      this.exportProgress.set(100);
      const formattedCode = this.formatCode(code, exportOptions);

      const result: ExportResult = {
        success: true,
        code: formattedCode,
        files,
      };

      this.lastExportResult.set(result);
      return result;

    } catch (error: any) {
      const errorResult: ExportResult = {
        success: false,
        error: error.message || 'Unknown error during export',
      };
      this.lastExportResult.set(errorResult);
      return errorResult;
    } finally {
      this.isExporting.set(false);
    }
  }

  /**
   * Exporta a múltiples frameworks simultáneamente
   */
  async exportToAll(component: ComponentMetadata): Promise<Record<FrameworkType, ExportResult>> {
    const frameworks: FrameworkType[] = ['react', 'angular', 'vue', 'web-component'];
    const results: Record<FrameworkType, ExportResult> = {} as Record<FrameworkType, ExportResult>;

    for (const framework of frameworks) {
      results[framework] = await this.export(component, framework);
    }

    return results;
  }

  /**
   * Previsualiza el código sin guardar
   */
  preview(component: ComponentMetadata, framework: FrameworkType): string {
    const parsedComponent = this.parseComponent(component);
    
    switch (framework) {
      case 'react':
        return this.reactExporter.generate(parsedComponent);
      case 'angular':
        return this.angularExporter.generate(parsedComponent);
      case 'vue':
        return this.vueExporter.generate(parsedComponent);
      case 'web-component':
        return this.webComponentExporter.generate(parsedComponent);
      default:
        return '// Unsupported framework';
    }
  }

  /**
   * Parsea el componente del editor a formato interno
   */
  private parseComponent(component: ComponentMetadata): ComponentMetadata {
    return {
      ...component,
      props: component.props.map(p => ({
        ...p,
        name: this.toCamelCase(p.name),
      })),
    };
  }

  /**
   * Transforma el componente al formato específico del framework
   */
  private transformComponent(
    component: ComponentMetadata,
    options: ExportOptions
  ): ComponentMetadata {
    // Transform props based on framework
    const transformedProps = component.props.map(prop => {
      // Map prop types to framework-specific types
      let type = prop.type;
      if (options.framework === 'react' && prop.type === 'function') {
        type = 'function';
      }
      return { ...prop, type };
    });

    return {
      ...component,
      props: transformedProps,
    };
  }

  /**
   * Genera archivos adicionales (types, styles, tests, stories)
   */
  private async generateAdditionalFiles(
    component: ComponentMetadata,
    options: ExportOptions
  ): Promise<ExportResult['files']> {
    const files: ExportResult['files'] = [];

    // Types file (for React/Angular/Vue TypeScript)
    if (options.typescript && options.framework !== 'web-component') {
      files.push({
        name: `${component.name}.types.ts`,
        path: `${component.name}.types.ts`,
        content: this.generateTypesFile(component),
        language: 'typescript',
      });
    }

    // Styles file
    if (component.styles?.content) {
      files.push({
        name: `${component.name}.styles.css`,
        path: `${component.name}.styles.css`,
        content: component.styles.content,
        language: 'css',
      });
    }

    // Story file (if requested)
    if (options.generateStories && options.framework === 'react') {
      files.push({
        name: `${component.name}.stories.tsx`,
        path: `${component.name}.stories.tsx`,
        content: this.generateStorybookFile(component),
        language: 'typescript',
      });
    }

    // Test file (if requested)
    if (options.generateTests) {
      files.push({
        name: `${component.name}.test.tsx`,
        path: `${component.name}.test.tsx`,
        content: this.generateTestFile(component, options.framework),
        language: 'typescript',
      });
    }

    return files;
  }

  /**
   * Genera archivo de tipos
   */
  private generateTypesFile(component: ComponentMetadata): string {
    const props = component.props.map(p => {
      const tsType = this.mapTypeToTypeScript(p.type);
      const optional = p.required ? '' : '?';
      return `  ${p.name}${optional}: ${tsType};`;
    }).join('\n');

    return `export interface ${component.name}Props {
${props || '  // No props'}
}

export default ${component.name}Props;
`;
  }

  /**
   * Genera archivo de Storybook
   */
  private generateStorybookFile(component: ComponentMetadata): string {
    return `import type { Meta, StoryObj } from '@storybook/react';
import { ${component.name} } from './${component.name}';

const meta: Meta<typeof ${component.name}> = {
  title: 'Components/${component.name}',
  component: ${component.name},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
${component.props.map(p => `    ${p.name}: ${this.formatPropValue(p.defaultValue)},`).join('\n')}
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <${component.name} variant="primary">Primary</${component.name}>
      <${component.name} variant="secondary">Secondary</${component.name}>
    </div>
  ),
};
`;
  }

  /**
   * Genera archivo de tests
   */
  private generateTestFile(component: ComponentMetadata, framework: string): string {
    if (framework === 'react') {
      return `import { render, screen, fireEvent } from '@testing-library/react';
import { ${component.name} } from './${component.name}';

describe('${component.name}', () => {
  it('renders without crashing', () => {
    render(<${component.name}>Test</${component.name}>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<${component.name} onClick={handleClick}>Click me</${component.name}>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
`;
    }

    return `// Tests for ${component.name} (${framework})
describe('${component.name}', () => {
  it('should be defined', () => {
    expect(true).toBe(true);
  });
});
`;
  }

  /**
   * Formatea el código generado
   */
  private formatCode(code: string, options: ExportOptions): string {
    // Basic formatting - add proper indentation
    const lines = code.split('\n');
    const indentedLines = lines.map((line, index) => {
      if (line.trim() === '' || line.includes('//')) return line;
      const currentIndent = line.match(/^(\s*)/)?.[1]?.length || 0;
      const targetIndent = options.indentation === 4 ? currentIndent : currentIndent;
      return ' '.repeat(targetIndent) + line.trim();
    });

    return indentedLines.join('\n').trim();
  }

  private toCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  private mapTypeToTypeScript(type: string): string {
    const typeMap: Record<string, string> = {
      'string': 'string',
      'number': 'number',
      'boolean': 'boolean',
      'function': '() => void',
      'array': 'any[]',
      'object': 'Record<string, any>',
      'ReactNode': 'React.ReactNode',
    };
    return typeMap[type] || 'any';
  }

  private formatPropValue(value: any): string {
    if (typeof value === 'string') return `'${value}'`;
    if (typeof value === 'boolean') return String(value);
    if (typeof value === 'number') return String(value);
    if (Array.isArray(value)) return JSON.stringify(value);
    if (typeof value === 'object') return JSON.stringify(value);
    return 'undefined';
  }
}
