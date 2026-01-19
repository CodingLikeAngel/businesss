import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  StylePreset,
  StylePresetCategory,
  ElementStyles,
  SectionStyles,
  StylePresetCollection
} from '../models/editor.model';

@Injectable({
  providedIn: 'root'
})
export class StylePresetService {
  private presetsSubject = new BehaviorSubject<StylePreset[]>([]);
  private collectionsSubject = new BehaviorSubject<StylePresetCollection[]>([]);

  public presets$: Observable<StylePreset[]> = this.presetsSubject.asObservable();
  public collections$: Observable<StylePresetCollection[]> = this.collectionsSubject.asObservable();

  // In-memory storage (in production, this would be backed by a database/API)
  private presets: StylePreset[] = [];
  private collections: StylePresetCollection[] = [];

  constructor() {
    this.initializeDefaultPresets();
  }

  /**
   * Get all presets, optionally filtered by category
   */
  getPresets(category?: StylePresetCategory): Observable<StylePreset[]> {
    const filtered = category
      ? this.presets.filter(p => p.category === category)
      : this.presets;

    return of(filtered);
  }

  /**
   * Get presets by tags
   */
  getPresetsByTags(tags: string[]): Observable<StylePreset[]> {
    const filtered = this.presets.filter(preset =>
      tags.some(tag => preset.tags.includes(tag))
    );
    return of(filtered);
  }

  /**
   * Get preset by ID
   */
  getPresetById(id: string): Observable<StylePreset | null> {
    const preset = this.presets.find(p => p.id === id) || null;
    return of(preset);
  }

  /**
   * Search presets by name or description
   */
  searchPresets(query: string): Observable<StylePreset[]> {
    const lowerQuery = query.toLowerCase();
    const filtered = this.presets.filter(preset =>
      preset.name.toLowerCase().includes(lowerQuery) ||
      preset.description.toLowerCase().includes(lowerQuery) ||
      preset.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
    return of(filtered);
  }

  /**
   * Create a new preset
   */
  createPreset(presetData: Omit<StylePreset, 'id' | 'createdAt' | 'updatedAt' | 'usage'>): Observable<StylePreset> {
    const preset: StylePreset = {
      ...presetData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      usage: 0
    };

    this.presets.push(preset);
    this.presetsSubject.next([...this.presets]);

    return of(preset);
  }

  /**
   * Update an existing preset
   */
  updatePreset(id: string, updates: Partial<Omit<StylePreset, 'id' | 'createdAt'>>): Observable<StylePreset | null> {
    const index = this.presets.findIndex(p => p.id === id);
    if (index === -1) return of(null);

    this.presets[index] = {
      ...this.presets[index],
      ...updates,
      updatedAt: new Date()
    };

    this.presetsSubject.next([...this.presets]);
    return of(this.presets[index]);
  }

  /**
   * Delete a preset
   */
  deletePreset(id: string): Observable<boolean> {
    const index = this.presets.findIndex(p => p.id === id);
    if (index === -1) return of(false);

    this.presets.splice(index, 1);
    this.presetsSubject.next([...this.presets]);
    return of(true);
  }

  /**
   * Duplicate a preset
   */
  duplicatePreset(id: string, newName?: string): Observable<StylePreset | null> {
    const original = this.presets.find(p => p.id === id);
    if (!original) return of(null);

    const duplicate: StylePreset = {
      ...original,
      id: this.generateId(),
      name: newName || `${original.name} Copy`,
      createdAt: new Date(),
      updatedAt: new Date(),
      usage: 0
    };

    this.presets.push(duplicate);
    this.presetsSubject.next([...this.presets]);

    return of(duplicate);
  }

  /**
   * Apply a preset to styles (merge operation)
   */
  applyPreset(presetId: string, currentStyles: ElementStyles | SectionStyles = {}): Observable<ElementStyles | SectionStyles> {
    const preset = this.presets.find(p => p.id === presetId);
    if (!preset) return of(currentStyles);

    // Increment usage counter
    preset.usage++;
    this.updatePreset(presetId, { usage: preset.usage }).subscribe();

    // Merge preset styles with current styles
    const mergedStyles = { ...currentStyles, ...preset.styles };
    return of(mergedStyles);
  }

  /**
   * Create preset from existing styles
   */
  createPresetFromStyles(
    styles: ElementStyles | SectionStyles,
    name: string,
    category: StylePresetCategory,
    description = '',
    tags: string[] = []
  ): Observable<StylePreset> {
    return this.createPreset({
      name,
      description,
      category,
      styles,
      tags,
      author: 'user' // In production, get from auth service
    });
  }

  /**
   * Get preset collections
   */
  getCollections(): Observable<StylePresetCollection[]> {
    return of(this.collections);
  }

  /**
   * Create a collection of presets
   */
  createCollection(collectionData: Omit<StylePresetCollection, 'id' | 'createdAt' | 'updatedAt'>): Observable<StylePresetCollection> {
    const collection: StylePresetCollection = {
      ...collectionData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.collections.push(collection);
    this.collectionsSubject.next([...this.collections]);

    return of(collection);
  }

  /**
   * Get most used presets
   */
  getPopularPresets(limit = 10): Observable<StylePreset[]> {
    const sorted = [...this.presets].sort((a, b) => b.usage - a.usage);
    return of(sorted.slice(0, limit));
  }

  /**
   * Get recently created presets
   */
  getRecentPresets(limit = 10): Observable<StylePreset[]> {
    const sorted = [...this.presets].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return of(sorted.slice(0, limit));
  }

  /**
   * Export presets to JSON
   */
  exportPresets(presetIds?: string[]): Observable<string> {
    const toExport = presetIds
      ? this.presets.filter(p => presetIds.includes(p.id))
      : this.presets;

    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      presets: toExport
    };

    return of(JSON.stringify(exportData, null, 2));
  }

  /**
   * Import presets from JSON
   */
  importPresets(jsonData: string): Observable<{ imported: number; skipped: number; errors: string[] }> {
    try {
      const importData = JSON.parse(jsonData);
      let imported = 0;
      let skipped = 0;
      const errors: string[] = [];

      if (importData.presets && Array.isArray(importData.presets)) {
        for (const presetData of importData.presets) {
          try {
            // Check if preset with same name already exists
            const existing = this.presets.find(p => p.name === presetData.name);
            if (existing) {
              skipped++;
              continue;
            }

            // Create new preset with new ID and timestamps
            const newPreset: StylePreset = {
              ...presetData,
              id: this.generateId(),
              createdAt: new Date(),
              updatedAt: new Date(),
              usage: 0
            };

            this.presets.push(newPreset);
            imported++;
          } catch (error) {
            errors.push(`Failed to import preset "${presetData.name}": ${error}`);
          }
        }
      }

      this.presetsSubject.next([...this.presets]);
      return of({ imported, skipped, errors });
    } catch (error) {
      return of({ imported: 0, skipped: 0, errors: [`Invalid JSON data: ${error}`] });
    }
  }

  /**
   * Initialize default presets
   */
  private initializeDefaultPresets(): void {
    const defaultPresets: Omit<StylePreset, 'id' | 'createdAt' | 'updatedAt' | 'usage'>[] = [
      // Button presets
      {
        name: 'Primary Button',
        description: 'Blue primary button style',
        category: 'button',
        styles: {
          backgroundColor: '#007bff',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: '500',
          border: 'none',
          cursor: 'pointer'
        },
        tags: ['primary', 'blue', 'button'],
        author: 'system'
      },
      {
        name: 'Secondary Button',
        description: 'Gray secondary button style',
        category: 'button',
        styles: {
          backgroundColor: '#6c757d',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: '500',
          border: 'none',
          cursor: 'pointer'
        },
        tags: ['secondary', 'gray', 'button'],
        author: 'system'
      },
      {
        name: 'Outline Button',
        description: 'Transparent button with border',
        category: 'button',
        styles: {
          backgroundColor: 'transparent',
          color: '#007bff',
          padding: '12px 24px',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: '500',
          border: '2px solid #007bff',
          cursor: 'pointer'
        },
        tags: ['outline', 'border', 'button'],
        author: 'system'
      },

      // Card presets
      {
        name: 'Basic Card',
        description: 'Simple white card with shadow',
        category: 'card',
        styles: {
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '24px',
          border: '1px solid #e9ecef'
        },
        tags: ['basic', 'white', 'shadow', 'card'],
        author: 'system'
      },
      {
        name: 'Elevated Card',
        description: 'Card with stronger shadow',
        category: 'card',
        styles: {
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          padding: '32px',
          border: 'none'
        },
        tags: ['elevated', 'shadow', 'card'],
        author: 'system'
      },

      // Typography presets
      {
        name: 'Heading Large',
        description: 'Large heading style',
        category: 'typography',
        styles: {
          fontSize: '48px',
          fontWeight: '700',
          lineHeight: '1.2',
          color: '#1a202c',
          margin: '0 0 16px 0'
        },
        tags: ['heading', 'large', 'bold', 'typography'],
        author: 'system'
      },
      {
        name: 'Body Text',
        description: 'Standard body text style',
        category: 'typography',
        styles: {
          fontSize: '16px',
          fontWeight: '400',
          lineHeight: '1.6',
          color: '#4a5568',
          margin: '0 0 16px 0'
        },
        tags: ['body', 'text', 'paragraph', 'typography'],
        author: 'system'
      }
    ];

    // Create default presets
    defaultPresets.forEach(presetData => {
      const preset: StylePreset = {
        ...presetData,
        id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
        usage: 0
      };
      this.presets.push(preset);
    });

    this.presetsSubject.next([...this.presets]);
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return 'preset_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}