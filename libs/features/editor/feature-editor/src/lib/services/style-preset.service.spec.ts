import { TestBed } from '@angular/core/testing';
import { StylePresetService } from './style-preset.service';
import { StylePresetCategory } from '../models/editor.model';

describe('StylePresetService', () => {
  let service: StylePresetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StylePresetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Default Presets', () => {
    it('should load default presets', (done) => {
      service.presets$.subscribe(presets => {
        expect(presets.length).toBeGreaterThan(0);
        done();
      });
    });

    it('should include button presets', (done) => {
      service.getPresets('button').subscribe(presets => {
        expect(presets.length).toBeGreaterThan(0);
        expect(presets.every(p => p.category === 'button')).toBe(true);
        done();
      });
    });
  });

  describe('Preset CRUD Operations', () => {
    it('should create a new preset', (done) => {
      const testPreset = {
        name: 'Test Preset',
        description: 'A test preset',
        category: 'custom' as StylePresetCategory,
        styles: { color: '#000000', fontSize: '16px' },
        tags: ['test'],
        author: 'test-user'
      };

      service.createPreset(testPreset).subscribe(preset => {
        expect(preset.id).toBeDefined();
        expect(preset.name).toBe('Test Preset');
        expect(preset.usage).toBe(0);
        done();
      });
    });

    it('should retrieve a preset by id', (done) => {
      const testPreset = {
        name: 'Test Preset',
        description: 'A test preset',
        category: 'custom' as StylePresetCategory,
        styles: { color: '#000000' },
        tags: ['test'],
        author: 'test-user'
      };

      service.createPreset(testPreset).subscribe(created => {
        service.getPresetById(created.id).subscribe(retrieved => {
          expect(retrieved).toBeDefined();
          expect(retrieved!.id).toBe(created.id);
          done();
        });
      });
    });

    it('should update a preset', (done) => {
      const testPreset = {
        name: 'Original Name',
        description: 'Original description',
        category: 'custom' as StylePresetCategory,
        styles: { color: '#000000' },
        tags: ['test'],
        author: 'test-user'
      };

      service.createPreset(testPreset).subscribe(created => {
        service.updatePreset(created.id, { name: 'Updated Name' }).subscribe(updated => {
          expect(updated!.name).toBe('Updated Name');
          done();
        });
      });
    });

    it('should delete a preset', (done) => {
      const testPreset = {
        name: 'To Delete',
        description: 'Will be deleted',
        category: 'custom' as StylePresetCategory,
        styles: { color: '#000000' },
        tags: ['test'],
        author: 'test-user'
      };

      service.createPreset(testPreset).subscribe(created => {
        service.deletePreset(created.id).subscribe(deleted => {
          expect(deleted).toBe(true);

          service.getPresetById(created.id).subscribe(retrieved => {
            expect(retrieved).toBeNull();
            done();
          });
        });
      });
    });
  });

  describe('Preset Search and Filtering', () => {
    beforeEach((done) => {
      // Create test presets
      const presets = [
        {
          name: 'Red Button',
          description: 'A red button',
          category: 'button' as StylePresetCategory,
          styles: { backgroundColor: '#ff0000' },
          tags: ['red', 'button'],
          author: 'test'
        },
        {
          name: 'Blue Card',
          description: 'A blue card',
          category: 'card' as StylePresetCategory,
          styles: { backgroundColor: '#0000ff' },
          tags: ['blue', 'card'],
          author: 'test'
        }
      ];

      Promise.all(presets.map(p => service.createPreset(p).toPromise())).then(() => done());
    });

    it('should filter presets by category', (done) => {
      service.getPresets('button').subscribe(presets => {
        expect(presets.every(p => p.category === 'button')).toBe(true);
        done();
      });
    });

    it('should search presets by name', (done) => {
      service.searchPresets('Red').subscribe(presets => {
        expect(presets.length).toBeGreaterThan(0);
        expect(presets.some(p => p.name.includes('Red'))).toBe(true);
        done();
      });
    });

    it('should find presets by tags', (done) => {
      service.getPresetsByTags(['red']).subscribe(presets => {
        expect(presets.length).toBeGreaterThan(0);
        expect(presets.every(p => p.tags.includes('red'))).toBe(true);
        done();
      });
    });
  });

  describe('Preset Application', () => {
    it('should apply a preset to existing styles', (done) => {
      const preset = {
        name: 'Test Apply',
        description: 'Test preset application',
        category: 'custom' as StylePresetCategory,
        styles: { color: '#ff0000', fontSize: '18px' },
        tags: ['test'],
        author: 'test'
      };

      const existingStyles = { backgroundColor: '#ffffff', padding: '10px' };

      service.createPreset(preset).subscribe(created => {
        service.applyPreset(created.id, existingStyles).subscribe(merged => {
          expect(merged.color).toBe('#ff0000');
          expect(merged.fontSize).toBe('18px');
          expect(merged.backgroundColor).toBe('#ffffff'); // existing preserved
          expect(merged.padding).toBe('10px'); // existing preserved
          done();
        });
      });
    });

    it('should increment usage counter when applying preset', (done) => {
      const preset = {
        name: 'Usage Test',
        description: 'Test usage tracking',
        category: 'custom' as StylePresetCategory,
        styles: { color: '#000000' },
        tags: ['test'],
        author: 'test'
      };

      service.createPreset(preset).subscribe(created => {
        const initialUsage = created.usage;

        service.applyPreset(created.id).subscribe(() => {
          service.getPresetById(created.id).subscribe(updated => {
            expect(updated!.usage).toBe(initialUsage + 1);
            done();
          });
        });
      });
    });
  });

  describe('Popular and Recent Presets', () => {
    it('should return popular presets', (done) => {
      service.getPopularPresets(5).subscribe(presets => {
        // Should return presets sorted by usage
        expect(Array.isArray(presets)).toBe(true);
        done();
      });
    });

    it('should return recent presets', (done) => {
      service.getRecentPresets(5).subscribe(presets => {
        // Should return most recently created presets
        expect(Array.isArray(presets)).toBe(true);
        done();
      });
    });
  });
});