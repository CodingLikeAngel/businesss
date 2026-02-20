import { Component, Input, HostBinding, forwardRef, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { variants as baseVariants } from '../../../models/ui-components-data.model';

// Variantes específicas del input-1 (Minimalista)
const specificInput1Variants = ['kingfisher', 'custom1', 'custom2'] as const;

// Combinamos variantes globales con específicas
export const input1Variants = [...baseVariants, ...specificInput1Variants] as const;
export type Input1VariantType = typeof input1Variants[number] | (string & {});

export interface Input1CustomStyles {
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

export interface Input1Option {
  value: string;
  label: string;
}

@Component({
  selector: 'lib-ui-components-input-1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-1.component.html',
  styleUrl: './input-1.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UIInput1Component),
      multi: true,
    },
  ],
})
export class UIInput1Component implements ControlValueAccessor {
  variant = input<Input1VariantType>('primary');
  size = input<'sm' | 'md' | 'lg'>('md');
  placeholder = input('');
  @Input() disabled = false;
  type = input<'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'time' | 'datetime-local' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'range' | 'color'>('text');
  customStyles = input<Input1CustomStyles>({});
  options = input<Input1Option[]>([]);
  rows = input<number>(4);
  label = input('');
  legend = input('');
  icon = input('');
  name = input('');
  errorMessage = input('');
  successMessage = input('');
  isValid = input<boolean | null>(null);
  showFloatingLabel = input<boolean>(true);

  private innerValue: any = '';
  isFocused = false;
  errorId = `input-1-error-${Math.random().toString(36).substr(2, 9)}`;

  isFloated = computed(() => this.isFocused || (this.value !== null && this.value !== undefined && this.value !== ''));

  private onChange: (value: any) => void = (_: any) => {};
  private onTouched: () => void = () => {};

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
      'input-1',
      `input-1-${this.variant()}`,
      `input-1-${this.size()}`,
      this.disabled ? 'input-1-disabled' : '',
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
