import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  StyleValidationResult,
  StyleValidationReport,
  CorrectionSuggestion,
  ElementStyles,
  SectionStyles,
  StylePropertyType
} from '../models/editor.model';

@Injectable({
  providedIn: 'root'
})
export class StyleValidationService {
  private validationRules = new Map<StylePropertyType, ValidationRule>();

  // Observable for validation results
  private validationReportSubject = new BehaviorSubject<StyleValidationReport | null>(null);
  public validationReport$: Observable<StyleValidationReport | null> = this.validationReportSubject.asObservable();

  constructor() {
    this.initializeValidationRules();
  }

  /**
   * Validate a single style property
   */
  validateProperty(property: StylePropertyType, value: any): StyleValidationResult {
    const rule = this.validationRules.get(property);
    if (!rule) {
      return {
        property,
        value,
        isValid: true,
        severity: 'info',
        message: `No validation rule defined for property: ${property}`
      };
    }

    const result = rule.validator(value);
    return {
      property,
      value,
      isValid: result.isValid,
      severity: result.severity,
      message: result.message,
      suggestions: result.suggestions
    };
  }

  /**
   * Validate a complete style object
   */
  validateStyles(styles: ElementStyles | SectionStyles): StyleValidationReport {
    const results: StyleValidationResult[] = [];
    let hasErrors = false;
    let hasWarnings = false;

    Object.keys(styles).forEach(key => {
      const property = key as StylePropertyType;
      const value = (styles as any)[property];

      if (value !== undefined && value !== null && value !== '') {
        const result = this.validateProperty(property, value);
        results.push(result);

        if (result.severity === 'error') hasErrors = true;
        if (result.severity === 'warning') hasWarnings = true;
      }
    });

    const report: StyleValidationReport = {
      results,
      isValid: !hasErrors,
      hasErrors,
      hasWarnings,
      summary: {
        total: results.length,
        valid: results.filter(r => r.isValid).length,
        errors: results.filter(r => r.severity === 'error').length,
        warnings: results.filter(r => r.severity === 'warning').length,
        info: results.filter(r => r.severity === 'info').length
      }
    };

    this.validationReportSubject.next(report);
    return report;
  }

  /**
   * Get correction suggestions for an invalid value
   */
  getSuggestions(property: StylePropertyType, invalidValue: any): CorrectionSuggestion[] {
    const rule = this.validationRules.get(property);
    if (!rule || !rule.suggestions) return [];

    return rule.suggestions(invalidValue);
  }

  /**
   * Apply a correction suggestion
   */
  applyCorrection(value: any, suggestion: CorrectionSuggestion): any {
    return suggestion.value;
  }

  /**
   * Initialize validation rules for all style properties
   */
  private initializeValidationRules(): void {
    // Color properties
    this.addValidationRule('color', this.createColorValidator());
    this.addValidationRule('backgroundColor', this.createColorValidator());
    this.addValidationRule('borderColor', this.createColorValidator());

    // Size/length properties
    this.addValidationRule('fontSize', this.createLengthValidator());
    this.addValidationRule('padding', this.createLengthValidator());
    this.addValidationRule('margin', this.createLengthValidator());
    this.addValidationRule('borderRadius', this.createLengthValidator());
    this.addValidationRule('width', this.createLengthValidator());
    this.addValidationRule('height', this.createLengthValidator());
    this.addValidationRule('minHeight', this.createLengthValidator());
    this.addValidationRule('maxWidth', this.createLengthValidator());
    this.addValidationRule('maxHeight', this.createLengthValidator());

    // Numeric properties with ranges
    this.addValidationRule('opacity', this.createRangeValidator(0, 1));
    this.addValidationRule('zIndex', this.createIntegerValidator());

    // Font weight
    this.addValidationRule('fontWeight', this.createFontWeightValidator());

    // Box shadow
    this.addValidationRule('boxShadow', this.createBoxShadowValidator());
  }

  private addValidationRule(property: StylePropertyType, rule: ValidationRule): void {
    this.validationRules.set(property, rule);
  }

  private createColorValidator(): ValidationRule {
    return {
      validator: (value: any) => {
        if (typeof value !== 'string') {
          return {
            isValid: false,
            severity: 'error',
            message: 'Color must be a string',
            suggestions: [{ value: '#000000', description: 'Default black color', confidence: 0.8 }]
          };
        }

        const colorRegex = {
          hex: /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/,
          rgb: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
          rgba: /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(0|1|0?\.\d+)\)$/,
          hsl: /^hsl\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%\)$/,
          hsla: /^hsla\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%,\s*(0|1|0?\.\d+)\)$/
        };

        const namedColors = [
          'black', 'white', 'red', 'green', 'blue', 'yellow', 'purple', 'orange',
          'pink', 'gray', 'grey', 'brown', 'cyan', 'magenta', 'lime', 'maroon',
          'navy', 'olive', 'silver', 'teal', 'transparent'
        ];

        if (namedColors.includes(value.toLowerCase())) {
          return { isValid: true, severity: 'info', message: 'Valid named color' };
        }

        if (colorRegex.hex.test(value) || colorRegex.rgb.test(value) ||
            colorRegex.rgba.test(value) || colorRegex.hsl.test(value) || colorRegex.hsla.test(value)) {
          return { isValid: true, severity: 'info', message: 'Valid color format' };
        }

        // Try to fix common issues
        const suggestions: CorrectionSuggestion[] = [];

        // Fix missing # for hex
        if (/^[A-Fa-f0-9]{3,8}$/.test(value)) {
          suggestions.push({
            value: '#' + value,
            description: 'Add missing # prefix',
            confidence: 0.9
          });
        }

        // Default fallback
        suggestions.push({
          value: '#000000',
          description: 'Default black color',
          confidence: 0.5
        });

        return {
          isValid: false,
          severity: 'error',
          message: 'Invalid color format',
          suggestions
        };
      },
      suggestions: (value: any) => {
        return [
          { value: '#000000', description: 'Black', confidence: 0.5 },
          { value: '#ffffff', description: 'White', confidence: 0.5 },
          { value: '#007bff', description: 'Blue', confidence: 0.5 }
        ];
      }
    };
  }

  private createLengthValidator(): ValidationRule {
    return {
      validator: (value: any) => {
        if (typeof value !== 'string') {
          return {
            isValid: false,
            severity: 'error',
            message: 'Length must be a string with units',
            suggestions: [{ value: '0px', description: 'Zero pixels', confidence: 0.8 }]
          };
        }

        const lengthRegex = /^-?\d*\.?\d+(px|em|rem|vh|vw|vmin|vmax|%|pt|pc|in|cm|mm|ex|ch)$/;
        if (lengthRegex.test(value)) {
          return { isValid: true, severity: 'info', message: 'Valid length with units' };
        }

        // Try to fix missing units
        if (/^-?\d*\.?\d+$/.test(value)) {
          return {
            isValid: false,
            severity: 'warning',
            message: 'Missing units, assuming pixels',
            suggestions: [
              { value: value + 'px', description: 'Add px units', confidence: 0.9 },
              { value: value + 'rem', description: 'Add rem units', confidence: 0.7 },
              { value: value + '%', description: 'Add percentage units', confidence: 0.6 }
            ]
          };
        }

        return {
          isValid: false,
          severity: 'error',
          message: 'Invalid length format',
          suggestions: [{ value: '16px', description: 'Default 16px', confidence: 0.5 }]
        };
      },
      suggestions: (value: any) => {
        return [
          { value: '16px', description: '16 pixels', confidence: 0.5 },
          { value: '1rem', description: '1 rem', confidence: 0.5 },
          { value: '100%', description: '100 percent', confidence: 0.5 }
        ];
      }
    };
  }

  private createRangeValidator(min: number, max: number): ValidationRule {
    return {
      validator: (value: any) => {
        const num = parseFloat(value);
        if (isNaN(num)) {
          return {
            isValid: false,
            severity: 'error',
            message: `Must be a number between ${min} and ${max}`,
            suggestions: [{ value: Math.max(min, Math.min(max, 1)), description: `Clamped to valid range`, confidence: 0.8 }]
          };
        }

        if (num < min || num > max) {
          return {
            isValid: false,
            severity: 'warning',
            message: `Value ${num} is outside valid range [${min}, ${max}]`,
            suggestions: [
              { value: Math.max(min, Math.min(max, num)), description: `Clamp to range`, confidence: 0.9 }
            ]
          };
        }

        return { isValid: true, severity: 'info', message: 'Valid range value' };
      },
      suggestions: (value: any) => {
        const num = parseFloat(value) || 0;
        return [
          { value: Math.max(min, Math.min(max, num)), description: 'Clamp to valid range', confidence: 0.8 },
          { value: (min + max) / 2, description: 'Middle of range', confidence: 0.5 }
        ];
      }
    };
  }

  private createIntegerValidator(): ValidationRule {
    return {
      validator: (value: any) => {
        const num = parseInt(value, 10);
        if (isNaN(num) || num !== parseFloat(value)) {
          return {
            isValid: false,
            severity: 'error',
            message: 'Must be an integer',
            suggestions: [{ value: Math.round(parseFloat(value) || 0), description: 'Round to nearest integer', confidence: 0.8 }]
          };
        }

        return { isValid: true, severity: 'info', message: 'Valid integer' };
      },
      suggestions: (value: any) => {
        return [
          { value: Math.round(parseFloat(value) || 0), description: 'Round to integer', confidence: 0.8 },
          { value: 0, description: 'Zero', confidence: 0.5 }
        ];
      }
    };
  }

  private createFontWeightValidator(): ValidationRule {
    return {
      validator: (value: any) => {
        const validWeights = ['normal', 'bold', 'lighter', 'bolder', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
        const stringValue = String(value);

        if (validWeights.includes(stringValue)) {
          return { isValid: true, severity: 'info', message: 'Valid font weight' };
        }

        // Try to map numeric values
        const num = parseInt(stringValue, 10);
        if (!isNaN(num) && num >= 100 && num <= 900 && num % 100 === 0) {
          return { isValid: true, severity: 'info', message: 'Valid numeric font weight' };
        }

        return {
          isValid: false,
          severity: 'warning',
          message: 'Invalid font weight',
          suggestions: [
            { value: 'normal', description: 'Normal weight (400)', confidence: 0.7 },
            { value: 'bold', description: 'Bold weight (700)', confidence: 0.7 },
            { value: '400', description: 'Regular (400)', confidence: 0.6 }
          ]
        };
      },
      suggestions: (value: any) => {
        return [
          { value: 'normal', description: 'Normal', confidence: 0.7 },
          { value: 'bold', description: 'Bold', confidence: 0.7 },
          { value: '400', description: '400', confidence: 0.6 }
        ];
      }
    };
  }

  private createBoxShadowValidator(): ValidationRule {
    return {
      validator: (value: any) => {
        if (typeof value !== 'string') {
          return {
            isValid: false,
            severity: 'error',
            message: 'Box shadow must be a string',
            suggestions: [{ value: '0 2px 4px rgba(0,0,0,0.1)', description: 'Subtle shadow', confidence: 0.8 }]
          };
        }

        // Basic box-shadow regex (simplified)
        const shadowRegex = /^(\d+px\s+){3,4}(rgb|rgba|hsl|hsla|#)?[^\)]*\)?$/;
        if (shadowRegex.test(value.replace(/\s+/g, ' ').trim())) {
          return { isValid: true, severity: 'info', message: 'Valid box shadow' };
        }

        return {
          isValid: false,
          severity: 'warning',
          message: 'Invalid box shadow format',
          suggestions: [
            { value: '0 2px 4px rgba(0,0,0,0.1)', description: 'Subtle shadow', confidence: 0.8 },
            { value: 'none', description: 'No shadow', confidence: 0.6 }
          ]
        };
      },
      suggestions: (value: any) => {
        return [
          { value: '0 2px 4px rgba(0,0,0,0.1)', description: 'Subtle', confidence: 0.8 },
          { value: '0 4px 8px rgba(0,0,0,0.2)', description: 'Medium', confidence: 0.7 },
          { value: 'none', description: 'None', confidence: 0.6 }
        ];
      }
    };
  }
}

interface ValidationRule {
  validator: (value: any) => {
    isValid: boolean;
    severity: 'error' | 'warning' | 'info';
    message: string;
    suggestions?: CorrectionSuggestion[];
  };
  suggestions?: (value: any) => CorrectionSuggestion[];
}