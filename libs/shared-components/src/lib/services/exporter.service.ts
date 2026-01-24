// ExporterService
// Genera un bundle ZIP con los archivos del proyecto (HTML, CSS, TS) a partir de la configuración JSON.
// Dependencia: npm install jszip @types/jszip

import { Injectable } from '@angular/core';
import * as JSZip from 'jszip';
// Fix for TS2351: JSZip is not constructable with namespace import in some TS configs
const JSZipConstructor = (JSZip as any).default || JSZip;

/**
 * Servicio que transforma la configuración del editor en código estático y lo empaqueta.
 * Ideal para la versión Pro del MVP.
 */
@Injectable({
  providedIn: 'root',
})
export class ExporterService {
  /**
   * Genera un archivo ZIP con la estructura del proyecto.
   * @param config Objeto JSON con la configuración completa del sitio.
   * @returns Promise que resuelve con un Blob del ZIP listo para descargar.
   */
  async exportProject(config: any): Promise<Blob> {
    const zip = new JSZipConstructor();

    // 1️⃣ Generar index.html básico
    const html = this.generateHtml(config);
    zip.file('index.html', html);

    // 2️⃣ Generar styles.css (global)
    const css = this.generateCss(config);
    zip.file('styles.css', css);

    // 3️⃣ Generar main.ts (bootstrap Angular) – versión mínima
    const ts = this.generateMainTs(config);
    zip.file('main.ts', ts);

    // 4️⃣ Incluir assets (imágenes, videos) si existen en config.assets
    if (config.assets && Array.isArray(config.assets)) {
      for (const asset of config.assets) {
        // asset: { path: string, content: string (base64) }
        if (asset.path && asset.content) {
          const binary = atob(asset.content);
          const uint8 = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            uint8[i] = binary.charCodeAt(i);
          }
          zip.file(asset.path, uint8);
        }
      }
    }

    // 5️⃣ Generar package.json básico para Angular CLI (opcional)
    const pkg = this.generatePackageJson();
    zip.file('package.json', pkg);

    // Generar el blob del zip
    const blob = await zip.generateAsync({ type: 'blob' });
    return blob;
  }

  // ---------------------------------------------------------------------
  // Métodos auxiliares para generar cada archivo
  // ---------------------------------------------------------------------
  private generateHtml(config: any): string {
    const title = config.pageTitle || 'Mi sitio Anto Studios';
    const cssLink = '<link rel="stylesheet" href="styles.css">';
    const body = this.generateBodyFromConfig(config);
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  ${cssLink}
</head>
<body>
  ${body}
</body>
</html>`;
  }

  private generateBodyFromConfig(config: any): string {
    // Simplificado: iteramos sobre sections y renderizamos componentes básicos.
    if (!config.sections || !Array.isArray(config.sections)) return '';
    return config.sections
      .map((sec: any) => this.renderSection(sec))
      .join('\n');
  }

  private renderSection(section: any): string {
    // Cada sección tiene un tipo y contenido. Aquí solo manejamos algunos tipos comunes.
    const type = section.type || 'div';
    const id = section.id ? ` id="${section.id}"` : '';
    const classes = section.classes ? ` class="${section.classes.join(' ')}"` : '';
    const content = section.content || '';
    return `<${type}${id}${classes}>${content}</${type}>`;
  }

  private generateCss(config: any): string {
    // Exporta variables CSS basadas en la variante seleccionada.
    const vars = config.globalVariant || {};
    const lines = Object.entries(vars).map(
      ([key, value]) => `  --${key}: ${value};`
    );
    return `:root {\n${lines.join('\n')}\n}\n\n/* Estilos básicos */\nbody {\n  margin: 0;\n  font-family: 'Inter', sans-serif;\n  background: var(--background, #f8fafc);\n  color: var(--text, #111827);\n}\n`;
  }

  private generateMainTs(config: any): string {
    // Bootstrap Angular minimal. El usuario podrá adaptar este archivo.
    return `import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';\nimport { AppModule } from './app.module';\n\nplatformBrowserDynamic().bootstrapModule(AppModule)\n  .catch(err => console.error(err));`;
  }

  private generatePackageJson(): string {
    const pkg = {
      name: 'antostudios-export',
      version: '1.0.0',
      scripts: {
        start: 'ng serve',
        build: 'ng build',
      },
      dependencies: {
        '@angular/core': '^17.0.0',
        '@angular/common': '^17.0.0',
        '@angular/platform-browser': '^17.0.0',
        '@angular/platform-browser-dynamic': '^17.0.0',
        'rxjs': '^7.8.0',
        'zone.js': '^0.14.0',
      },
      devDependencies: {
        'typescript': '^5.2.0',
        'jszip': '^3.10.0',
      },
    };
    return JSON.stringify(pkg, null, 2);
  }
}
