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
    if (!config.sections || !Array.isArray(config.sections)) return '';
    const visible = config.sections.filter((s: any) => s.visible !== false);
    return visible.map((sec: any) => this.renderSection(sec)).join('\n');
  }

  private renderSection(section: any): string {
    const id = section.id ? ` id="${section.id}"` : '';
    const type = section.type || 'generic';
    const sectionClass = `section section-${type}`;
    const content = section.content || {};
    const styles = section.styles || {};
    const styleStr = this.inlineStyles(styles);
    const styleAttr = styleStr ? ` style="${styleStr}"` : '';

    let inner = '';
    if (type === 'hero' || type === 'hero-minimal' || type === 'hero-split') {
      const title = content.title || content.headline || 'Título';
      const subtitle = content.subtitle || content.description || '';
      inner = `<div class="hero-content"><h1>${this.escapeHtml(title)}</h1>${subtitle ? `<p class="hero-subtitle">${this.escapeHtml(subtitle)}</p>` : ''}</div>`;
    } else if (type === 'features') {
      const title = content.title || 'Características';
      const items = content.items || content.features || [];
      const itemsHtml = items.slice(0, 6).map((f: any) => `<li>${this.escapeHtml(f.title || f.name || f)}</li>`).join('');
      inner = `<h2>${this.escapeHtml(title)}</h2><ul class="features-list">${itemsHtml}</ul>`;
    } else if (type === 'pricing') {
      const title = content.title || 'Precios';
      inner = `<h2>${this.escapeHtml(title)}</h2><div class="pricing-grid"><!-- Planes --></div>`;
    } else if (type === 'contact' || type === 'cta') {
      const title = content.title || 'Contacto';
      inner = `<h2>${this.escapeHtml(title)}</h2><div class="contact-form"><!-- Formulario --></div>`;
    } else {
      const title = content.title || content.name;
      const text = content.text || content.description || (typeof content === 'string' ? content : '');
      inner = title ? `<h2>${this.escapeHtml(title)}</h2>` : '';
      if (text) inner += `<div class="section-body">${this.escapeHtml(String(text))}</div>`;
    }
    if (!inner) inner = `<div class="section-placeholder">Sección ${type}</div>`;

    return `<section${id} class="${sectionClass}"${styleAttr}>\n  <div class="section-inner">\n  ${inner}\n  </div>\n</section>`;
  }

  private inlineStyles(styles: Record<string, string>): string {
    if (!styles || typeof styles !== 'object') return '';
    const allowed = ['minHeight', 'min-height', 'height', 'padding', 'backgroundColor', 'background-color', 'color'];
    return Object.entries(styles)
      .filter(([k]) => allowed.some(a => k === a || k.replace(/([A-Z])/g, '-$1').toLowerCase() === a))
      .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`)
      .join('; ');
  }

  private escapeHtml(s: string): string {
    if (!s) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  private generateCss(config: any): string {
    const g = config.globalVariant || {};
    const theme = (g.theme === 'dark' || g.dark) ? 'dark' : 'light';
    const lines = Object.entries(g).filter(([, v]) => v != null && typeof v === 'string').map(
      ([key, value]) => `  --${key}: ${value};`
    );
    const baseVars = theme === 'dark'
      ? `  --background: #0f172a;\n  --text: #f1f5f9;\n  --accent: #6366f1;\n  --primary: #3b82f6;`
      : `  --background: #f8fafc;\n  --text: #111827;\n  --accent: #6366f1;\n  --primary: #3b82f6;`;
    return `:root {\n${baseVars}\n${lines.join('\n')}\n}\n\nbody { margin: 0; font-family: 'Inter', system-ui, sans-serif; background: var(--background); color: var(--text); }\n.section { min-height: 2rem; }\n.section-inner { max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; }\n.hero-content h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }\n.hero-subtitle { font-size: 1.25rem; opacity: 0.9; }\n.features-list { list-style: none; padding: 0; display: grid; gap: 1rem; }\n`;
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
