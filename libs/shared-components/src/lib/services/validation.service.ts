import { Injectable } from '@angular/core';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ValidationRule {
  check: (element: HTMLElement) => boolean;
  message: string;
  severity: 'error' | 'warning';
}

/**
 * Service for validating elements and project structure
 */
@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  
  private rules: ValidationRule[] = [
    {
      check: (el) => el.id !== '',
      message: 'Element should have an ID for better tracking',
      severity: 'warning'
    },
    {
      check: (el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      },
      message: 'Element has zero dimensions',
      severity: 'error'
    },
    {
      check: (el) => {
        const style = window.getComputedStyle(el);
        return style.position !== 'static' || el.offsetParent !== null;
      },
      message: 'Element may not be positioned correctly',
      severity: 'warning'
    }
  ];

  /**
   * Validate a single element
   */
  validateElement(element: HTMLElement): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    this.rules.forEach(rule => {
      try {
        if (!rule.check(element)) {
          if (rule.severity === 'error') {
            errors.push(rule.message);
          } else {
            warnings.push(rule.message);
          }
        }
      } catch (e) {
        console.warn('Validation rule failed:', e);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate project structure
   */
  validateProject(config: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if project has pages
    if (!config.pages || config.pages.length === 0) {
      errors.push('Project must have at least one page');
    }

    // Check each page
    config.pages?.forEach((page: any, index: number) => {
      if (!page.name || page.name.trim() === '') {
        errors.push(`Page ${index + 1} needs a name`);
      }

      if (!page.sections || page.sections.length === 0) {
        warnings.push(`Page "${page.name || index + 1}" has no sections`);
      }

      // Check for duplicate page names
      const duplicates = config.pages.filter((p: any) => p.name === page.name);
      if (duplicates.length > 1) {
        warnings.push(`Duplicate page name: "${page.name}"`);
      }
    });

    // Check for global settings
    if (!config.globalVariant) {
      warnings.push('No global variant set, using default');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate export readiness
   */
  validateForExport(config: any): ValidationResult {
    const result = this.validateProject(config);
    
    // Additional export-specific checks
    if (!config.metadata?.projectName) {
      result.warnings.push('Project name not set, will use default');
    }

    // Check if there's actual content
    let hasContent = false;
    config.pages?.forEach((page: any) => {
      if (page.sections && page.sections.length > 0) {
        hasContent = true;
      }
    });

    if (!hasContent) {
      result.errors.push('Project has no content to export');
      result.isValid = false;
    }

    return result;
  }

  /**
   * Add a custom validation rule
   */
  addRule(rule: ValidationRule): void {
    this.rules.push(rule);
  }

  /**
   * Remove all custom rules
   */
  clearCustomRules(): void {
    this.rules = this.rules.filter(r => 
      r.message.includes('Element should have an ID') ||
      r.message.includes('Element has zero dimensions') ||
      r.message.includes('Element may not be positioned')
    );
  }
}
