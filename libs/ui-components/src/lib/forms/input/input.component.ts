import { Component, Input, HostBinding, forwardRef, input } from '@angular/core';
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
  '--input-bg'?: string;
  '--input-border'?: string;
  '--input-shadow'?: string;
  '--input-radius'?: string;
  '--input-color'?: string;
  '--input-focus-bg'?: string;
  '--input-focus-border'?: string;
  '--input-focus-shadow'?: string;
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

  private innerValue: any = '';

  // Initialize with no-op to satisfy ESLint
  private onChange: (value: any) => void = (_: any) => {
    // This will be overridden by registerOnChange
  };
  private onTouched: () => void = () => {
    // This will be overridden by registerOnTouched
  };

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
}  
