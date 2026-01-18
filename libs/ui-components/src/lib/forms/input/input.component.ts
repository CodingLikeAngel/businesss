import { Component, Input, HostBinding, forwardRef, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { variants as baseVariants } from '../../models/ui-components-data.model';

// Variantes específicas del componente hijo
const specificInputVariants = [
  'kingfisher',
  'custom1',
  'custom2',
] as const;

// Combinamos variantes globales con específicas
export const inputVariants = [...baseVariants, ...specificInputVariants] as const;
export type InputVariantType = typeof inputVariants[number] | (string & {});

export interface InputCustomStyles {
  backgroundColor?: string;
  color?: string;
  '--input-bg'?: string;
  '--input-border'?: string;
  '--input-shadow'?: string;
  '--input-radius'?: string;
  '--input-color'?: string;
  '--input-focus-bg'?: string;
  '--input-focus-border'?: string;
  '--input-focus-shadow'?: string;
  [key: string]: string | undefined;
}

export interface InputOption {
  value: string;
  label: string;
}

@Component({
  selector: 'lib-ui-components-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UIInputComponent),
      multi: true,
    },
  ],
})
export class UIInputComponent implements ControlValueAccessor {
  variant = input<InputVariantType>('primary');
  size = input<'sm' | 'md' | 'lg'>('md');
  placeholder = input('');
  @Input() disabled = false; // Keep as Input for CVA compatibility/mutable
  type = input('text');
  customStyles = input<InputCustomStyles>({});
  options = input<InputOption[]>([]);
  rows = input<number | undefined>(undefined);
  label = input('');
  legend = input('');
  icon = input('');
  errorMessage = input('');
  successMessage = input('');
  isValid = input<boolean | null>(null);

  private innerValue: any = '';
  isFocused = false;
  errorId = `input-error-${Math.random().toString(36).substr(2, 9)}`;

  isFloated = computed(() => this.isFocused || (this.value !== null && this.value !== undefined && this.value !== ''));

  // Initialize with no-op to satisfy ESLint
  private onChange: (value: any) => void = (_: any) => {
    // This will be overridden by registerOnChange
  };
  private onTouched: () => void = () => {
    // This will be overridden by registerOnTouched
  };

  inputStyles = computed(() => {
    const styles: Record<string, any> = {};
    const customStyles = this.customStyles();
    
    if (customStyles['backgroundColor']) {
      styles['--input-bg'] = customStyles['backgroundColor'];
      styles['--theme-bg'] = customStyles['backgroundColor'];
      styles['--component-bg'] = customStyles['backgroundColor'];
      styles['background'] = customStyles['backgroundColor'];
      styles['background-color'] = customStyles['backgroundColor'];
    }
    
    if (customStyles['color']) {
      styles['--input-color'] = customStyles['color'];
      styles['--theme-color'] = customStyles['color'];
      styles['--component-text'] = customStyles['color'];
      styles['color'] = customStyles['color'];
    }
    
    Object.keys(customStyles).forEach(key => {
      if (key !== 'backgroundColor' && key !== 'color') {
        styles[key] = customStyles[key];
      }
    });

    return styles;
  });

  @HostBinding('class') get hostClasses() {
    return [
      'input',
      `input-${this.variant()}`,
      `input-${this.size()}`,
      this.disabled ? 'input-disabled' : '',
    ].filter(Boolean);
  }

  @HostBinding('style') get hostStyles() {
    return this.customStyles();
  }

  get value(): any {
    return this.innerValue;
  }

  set value(newValue: any) {
    if (this.innerValue !== newValue) {
      this.innerValue = newValue;
      this.onChange(newValue);
    }
  }

  writeValue(value: any): void {
    this.innerValue = value || '';
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  
  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      this.value = target.checked;
    } else {
      this.value = target.value;
    }

    this.onTouched();
  }

  onFocus(): void {
    this.isFocused = true;
  }

  onBlur(): void {
    this.isFocused = false;
    this.onTouched();
  }
}  
