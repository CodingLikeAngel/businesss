import { TestBed } from '@angular/core/testing';
import { ExporterService } from './exporter.service';
import * as JSZip from 'jszip';

/**
 * Unit tests for ExporterService (plan DOC_MEJORAS – estabilidad del build).
 * Verifica que exportProject devuelva un ZIP con index.html, styles.css y archivos esperados.
 */
describe('ExporterService', () => {
  let service: ExporterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExporterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a zip blob', async () => {
    const config = {
      pageTitle: 'Test Page',
      globalVariant: { primary: '#ff0000' },
      sections: [],
    };
    const blob = await service.exportProject(config);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
    expect(blob.type).toMatch(/application\/zip|application\/octet-stream/);
  });

  it('should include index.html, styles.css and package.json in zip', async () => {
    const config = {
      pageTitle: 'Mi sitio',
      globalVariant: { theme: 'dark' },
      sections: [
        { id: 's1', type: 'hero', visible: true, content: { title: 'Hola' } },
      ],
    };
    const blob = await service.exportProject(config);
    const Zip = (JSZip as any).default || JSZip;
    const zip = await Zip.loadAsync(blob);
    const names = Object.keys(zip.files).map((n) => n.split('/').pop()?.toLowerCase() ?? n);
    expect(names).toContain('index.html');
    expect(names).toContain('styles.css');
    expect(names).toContain('package.json');
  });

  it('should generate valid HTML with section content', async () => {
    const config = {
      pageTitle: 'Test',
      globalVariant: {},
      sections: [
        { id: 'h1', type: 'hero', visible: true, content: { title: 'Título Hero', subtitle: 'Subtítulo' } },
      ],
    };
    const blob = await service.exportProject(config);
    const Zip = (JSZip as any).default || JSZip;
    const zip = await Zip.loadAsync(blob);
    const file = zip.files['index.html'] || Object.values(zip.files).find((f: any) => f.name.endsWith('index.html'));
    expect(file).toBeTruthy();
    const html = await (file as any).async('string');
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('Título Hero');
    expect(html).toContain('Subtítulo');
  });
});
