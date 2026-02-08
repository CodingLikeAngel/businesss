// Component Export Demo
// Demo/Test para verificar que el sistema de exportación funciona

import { ExportOrchestrator, ComponentMetadata, FrameworkType } from './index';

// Componente de prueba (Button)
const demoButtonComponent: ComponentMetadata = {
  id: 'button-001',
  name: 'Button',
  type: 'button',
  htmlTag: 'button',
  baseClassName: 'btn',
  props: [
    {
      name: 'variant',
      type: 'string',
      defaultValue: 'primary',
      required: false,
      description: 'Button variant (primary, secondary, outline)',
    },
    {
      name: 'size',
      type: 'string',
      defaultValue: 'md',
      required: false,
      description: 'Button size (sm, md, lg)',
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: false,
      required: false,
      description: 'Disabled state',
    },
  ],
  slots: [
    { name: 'default', required: true },
  ],
  events: [
    { name: 'click', type: 'Event', description: 'Click event' },
  ],
  styles: {
    mode: 'css',
    content: `.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn--primary {
  background: #3b82f6;
  color: white;
}

.btn--secondary {
  background: #6b7280;
  color: white;
}

.btn--outline {
  background: transparent;
  border: 2px solid #3b82f6;
  color: #3b82f6;
}

.btn--sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.btn--lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}`,
  },
  variants: [
    { name: 'primary', props: [{ name: 'variant', defaultValue: 'primary' }] },
    { name: 'secondary', props: [{ name: 'variant', defaultValue: 'secondary' }] },
  ],
  metadata: {
    createdAt: new Date(),
    updatedAt: new Date(),
    version: '1.0.0',
    author: 'Anto Studios',
  },
};

// Ejecutar demo
export async function runExportDemo(): Promise<void> {
  console.log('🚀 Starting Component Export Demo...\n');

  const orchestrator = new ExportOrchestrator();

  // Exportar a todos los frameworks
  const frameworks: FrameworkType[] = ['react', 'angular', 'vue', 'web-component'];

  for (const framework of frameworks) {
    console.log(`\n📦 Exporting to ${framework.toUpperCase()}...`);
    
    const result = await orchestrator.export(demoButtonComponent, framework, {
      typescript: true,
      generateTests: false,
      generateStories: true,
    });

    if (result.success) {
      console.log(`✅ ${framework.toUpperCase()} export successful!`);
      console.log(`📄 Code preview (first 200 chars):`);
      console.log(result.code?.substring(0, 200) + '...\n');
    } else {
      console.log(`❌ ${framework.toUpperCase()} export failed:`);
      console.log(result.error);
    }
  }

  console.log('\n🎉 Demo completed!');
}

// Exportar resultado como archivo (para uso real)
export function generateExportOutput(component: ComponentMetadata): Record<FrameworkType, string> {
  const orchestrator = new ExportOrchestrator();
  const results: Record<FrameworkType, string> = {} as Record<FrameworkType, string>;

  const frameworks: FrameworkType[] = ['react', 'angular', 'vue', 'web-component'];

  for (const framework of frameworks) {
    const result = orchestrator.preview(component, framework);
    results[framework] = result;
  }

  return results;
}

// Ejemplo de uso en la aplicación
/*
import { ExportOrchestrator } from './services/export';

@Component({
  selector: 'app-export-panel',
  template: `
    <div class="export-panel">
      <h3>Export Component</h3>
      
      <select [(ngModel)]="selectedFramework">
        <option value="react">React</option>
        <option value="angular">Angular</option>
        <option value="vue">Vue</option>
        <option value="web-component">Web Component</option>
      </select>

      <button (click)="previewExport()">Preview</button>
      <button (click)="downloadExport()">Download</button>

      @if (code) {
        <pre><code>{{ code }}</code></pre>
      }
    </div>
  `
})
class ExportPanelComponent {
  selectedFramework: FrameworkType = 'react';
  code = '';

  constructor(private orchestrator: ExportOrchestrator) {}

  previewExport() {
    const component = this.getCurrentComponent();
    this.code = this.orchestrator.preview(component, this.selectedFramework);
  }

  async downloadExport() {
    const component = this.getCurrentComponent();
    const result = await this.orchestrator.export(component, this.selectedFramework);
    
    if (result.success) {
      // Download as file
      const blob = new Blob([result.code!], { type: 'text/typescript' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${component.name}.${this.getExtension()}`;
      a.click();
    }
  }

  private getExtension(): string {
    const ext: Record<FrameworkType, string> = {
      react: 'tsx',
      angular: 'ts',
      vue: 'vue',
      'web-component': 'js',
    };
    return ext[this.selectedFramework];
  }
}
*/

// Run demo if this file is executed directly
if (typeof window !== 'undefined') {
  (window as any).runExportDemo = runExportDemo;
}
