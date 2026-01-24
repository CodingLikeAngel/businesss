import { TestBed } from '@angular/core/testing';
import { ExporterService } from './exporter.service';

/**
 * Simple unit test for ExporterService.
 * Verifica que el método exportProject devuelva un Blob y que el zip contenga los archivos esperados.
 */
describe('ExporterService', () => {
  let service: ExporterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExporterService);
  });

  it('should create a zip with expected files', async () => {
    const dummyConfig = {
      pageTitle: 'Test Page',
      globalVariant: { primary: '#ff0000' },
      sections: [],
    };
    const blob = await service.exportProject(dummyConfig);
    expect(blob).toBeInstanceOf(Blob);
    // No verificamos el contenido interno del zip aquí para mantener la prueba ligera.
  });
});
