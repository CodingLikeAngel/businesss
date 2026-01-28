import { Component, Input, HostBinding, forwardRef, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { variants as baseVariants } from '../../../models/ui-components-data.model';

const specificInput2Variants = ['kingfisher', 'custom1', 'custom2'] as const;
export const input2Variants = [...baseVariants, ...specificInput2Variants] as const;
export type Input2VariantType = typeof input2Variants[number] | (string & {});

export interface Input2CustomStyles {
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

export interface Input2Option {
  value: string;
  label: string;
}

@Component({
  selector: 'lib-ui-components-input-2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-2.component.html',
  styleUrls: ['./input-2.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UIInput2Component),
      multi: true,
    },
  ],
})
export class UIInput2Component implements ControlValueAccessor {
  variant = input<Input2VariantType>('primary');
  size = input<'sm' | 'md' | 'lg'>('md');
  placeholder = input('');
  @Input() disabled = false;
  type = input<'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'time' | 'datetime-local' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'range' | 'color'>('text');
  customStyles = input<Input2CustomStyles>({});
  options = input<Input2Option[]>([]);
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
  errorId = `input-2-error-${Math.random().toString(36).substr(2, 9)}`;

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
      'input-2',
      `input-2-${this.variant()}`,
      `input-2-${this.size()}`,
      this.disabled ? 'input-2-disabled' : '',
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
