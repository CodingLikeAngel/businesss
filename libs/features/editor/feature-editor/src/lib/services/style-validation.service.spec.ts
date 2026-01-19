import { TestBed } from '@angular/core/testing';
import { StyleValidationService } from './style-validation.service';
import { ElementStyles } from '../models/editor.model';

describe('StyleValidationService', () => {
  let service: StyleValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StyleValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Color Validation', () => {
    it('should validate valid hex colors', () => {
      const result = service.validateProperty('color', '#ff0000');
      expect(result.isValid).toBe(true);
      expect(result.severity).toBe('info');
    });

    it('should validate valid named colors', () => {
      const result = service.validateProperty('color', 'red');
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid colors', () => {
      const result = service.validateProperty('color', 'invalid-color');
      expect(result.isValid).toBe(false);
      expect(result.severity).toBe('error');
      expect(result.suggestions).toBeDefined();
      expect(result.suggestions!.length).toBeGreaterThan(0);
    });

    it('should suggest corrections for invalid colors', () => {
      const result = service.validateProperty('color', 'redd');
      expect(result.suggestions).toBeDefined();
      expect(result.suggestions!.length).toBeGreaterThan(0);
    });
  });

  describe('Length Validation', () => {
    it('should validate valid pixel values', () => {
      const result = service.validateProperty('fontSize', '16px');
      expect(result.isValid).toBe(true);
    });

    it('should validate valid rem values', () => {
      const result = service.validateProperty('fontSize', '1.5rem');
      expect(result.isValid).toBe(true);
    });

    it('should suggest adding units for values without units', () => {
      const result = service.validateProperty('fontSize', '16');
      expect(result.isValid).toBe(false);
      expect(result.severity).toBe('warning');
      expect(result.suggestions).toContain(jasmine.objectContaining({
        value: '16px'
      }));
    });
  });

  describe('Range Validation', () => {
    it('should validate valid opacity values', () => {
      const result = service.validateProperty('opacity', 0.5);
      expect(result.isValid).toBe(true);
    });

    it('should reject opacity values outside range', () => {
      const result = service.validateProperty('opacity', 1.5);
      expect(result.isValid).toBe(false);
      expect(result.suggestions).toContain(jasmine.objectContaining({
        value: 1
      }));
    });
  });

  describe('Style Object Validation', () => {
    it('should validate complete style objects', () => {
      const styles: ElementStyles = {
        color: '#000000',
        fontSize: '16px',
        backgroundColor: '#ffffff'
      };

      const report = service.validateStyles(styles);
      expect(report.isValid).toBe(true);
      expect(report.results.length).toBe(3);
      expect(report.summary.valid).toBe(3);
      expect(report.summary.errors).toBe(0);
    });

    it('should report errors for invalid styles', () => {
      const styles: ElementStyles = {
        color: 'invalid-color',
        fontSize: '16', // missing units
        opacity: 2 // out of range
      };

      const report = service.validateStyles(styles);
      expect(report.isValid).toBe(false);
      expect(report.hasErrors).toBe(true);
      expect(report.summary.errors).toBeGreaterThan(0);
    });
  });

  describe('Font Weight Validation', () => {
    it('should validate numeric font weights', () => {
      const result = service.validateProperty('fontWeight', '400');
      expect(result.isValid).toBe(true);
    });

    it('should validate named font weights', () => {
      const result = service.validateProperty('fontWeight', 'bold');
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid font weights', () => {
      const result = service.validateProperty('fontWeight', 'invalid');
      expect(result.isValid).toBe(false);
      expect(result.suggestions).toBeDefined();
    });
  });
});