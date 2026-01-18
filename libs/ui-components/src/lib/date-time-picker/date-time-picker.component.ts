import { Component, computed, input, output, signal, ElementRef, ViewChild, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { variants } from '../models/ui-components-data.model';

export const datePickerVariants = variants;

export type DateTimePickerVariantType = typeof datePickerVariants[number] | (string & {});

export interface DateTimePickerCustomStyles {
  backgroundColor?: string;
  color?: string;
  '--picker-bg'?: string;
  '--picker-border'?: string;
  '--picker-shadow'?: string;
  '--picker-color'?: string;
  '--picker-accent'?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-date-time-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './date-time-picker.component.html',
  styleUrl: './date-time-picker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UIDateTimePickerComponent),
      multi: true,
    },
  ],
})
export class UIDateTimePickerComponent implements ControlValueAccessor {
  variant = input<DateTimePickerVariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  disabled = input<boolean>(false);
  customStyles = input<DateTimePickerCustomStyles>({});

  dateTimeChange = output<string>();

  // Estado reactivo con signals
  selectedDate = signal(new Date());
  currentMonth = signal(new Date());
  showCalendar = signal(false);
  showTime = true;
  selectedTime = signal(this.formatTime(new Date()));
  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  @ViewChild('calendar', { static: false }) calendarRef!: ElementRef;

  // ControlValueAccessor properties
  private innerValue = '';

  // Initialize with no-op to satisfy ESLint
  private onChange: (value: any) => void = (_: any) => {
    // This will be overridden by registerOnChange
  };
  private onTouched: () => void = () => {
    // This will be overridden by registerOnTouched
  };

  // Computeds
  pickerClasses = computed(() => [
    'date-time-picker-container',
    `picker-${this.variant()}`,
    `picker-rounded-${this.rounded()}`,
    `picker-${this.size()}`,
    this.dark() ? 'dark' : '',
    this.disabled() ? 'picker-disabled' : '',
  ].filter(Boolean));

  pickerStyles = computed(() => {
    const styles: Record<string, any> = {};
    const customStyles = this.customStyles();
    
    if (customStyles['backgroundColor']) {
      styles['--picker-bg'] = customStyles['backgroundColor'];
      styles['--theme-bg'] = customStyles['backgroundColor'];
      styles['--component-bg'] = customStyles['backgroundColor'];
      styles['background'] = customStyles['backgroundColor'];
      styles['background-color'] = customStyles['backgroundColor'];
    }
    
    if (customStyles['color']) {
      styles['--picker-color'] = customStyles['color'];
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

  formattedDateTime = computed(() => {
    const date = this.selectedDate();
    const [hours, minutes] = this.selectedTime().split(':');
    const updatedDate = new Date(date);
    updatedDate.setHours(parseInt(hours), parseInt(minutes));
    return updatedDate.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  });

  daysInMonth = computed(() => {
    const days: Date[] = [];
    const year = this.currentMonth().getFullYear();
    const month = this.currentMonth().getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();

    for (let i = 0; i < startDay; i++) {
      days.push(new Date(year, month, 0 - startDay + i + 1));
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  });

  // ControlValueAccessor methods
  writeValue(value: string): void {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        this.innerValue = value;
        this.selectedDate.set(date);
        this.currentMonth.set(date);
        this.selectedTime.set(this.formatTime(date));
      }
    } else {
      this.innerValue = '';
      this.selectedDate.set(new Date());
      this.currentMonth.set(new Date());
      this.selectedTime.set(this.formatTime(new Date()));
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Since disabled is an Input signal, we can't set it directly
    // If you need to programmatically disable, consider using a signal
  }

  // Métodos de interacción
  toggleCalendar(event?: MouseEvent) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!this.disabled()) {
      this.showCalendar.update(show => !show);
      if (this.showCalendar() && event) {
        this.positionCalendar(event);
      }
      this.onTouched();
    }
  }

  positionCalendar(event: MouseEvent) {
    const input = event.target as HTMLElement;
    const rect = input.getBoundingClientRect();
    const calendarEl = this.calendarRef.nativeElement as HTMLElement;

    if (typeof window !== 'undefined') {
      calendarEl.style.top = `${rect.bottom + window.scrollY}px`;
      calendarEl.style.left = `${rect.left + window.scrollX}px`;

      const calendarRect = calendarEl.getBoundingClientRect();
      if (calendarRect.right > window.innerWidth) {
        calendarEl.style.left = `${window.innerWidth - calendarRect.width}px`;
      }
      if (calendarRect.bottom > window.innerHeight) {
        calendarEl.style.top = `${rect.top + window.scrollY - calendarRect.height}px`;
      }
    }
  }

  changeMonth(delta: number) {
    this.currentMonth.update(current => {
      const newDate = new Date(current);
      newDate.setMonth(current.getMonth() + delta);
      return newDate;
    });
  }

  selectDate(day: Date, event?: MouseEvent) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (this.isCurrentMonth(day)) {
      this.selectedDate.set(new Date(day));
      this.updateDateTime();
      this.showCalendar.set(false);
    }
  }

  updateDateTime() {
    const [hours, minutes] = this.selectedTime().split(':');
    const newDate = new Date(this.selectedDate());
    newDate.setHours(parseInt(hours), parseInt(minutes));
    const isoString = newDate.toISOString();
    this.innerValue = isoString;
    this.onChange(isoString);
    this.dateTimeChange.emit(isoString);
  }

  // Métodos de accesibilidad
  handleInputKeydown(event: KeyboardEvent) {
    if (!this.disabled() && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      this.toggleCalendar(event as any);
    }
  }

  handleButtonKeydown(event: KeyboardEvent) {
    if (!this.disabled() && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      const target = event.target as HTMLElement;
      if (target.classList.contains('date-time-picker-icon')) {
        this.toggleCalendar(event as any);
      } else if (target.textContent === '◄') {
        this.changeMonth(-1);
      } else if (target.textContent === '►') {
        this.changeMonth(1);
      }
    }
  }

  handleDayKeydown(event: KeyboardEvent, day: Date) {
    if (!this.disabled() && this.isCurrentMonth(day) && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      this.selectDate(day);
    }
  }

  handleCalendarKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.showCalendar.set(false);
    }
  }

  dayLabel(day: Date): string {
    return `${day.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} ${this.isSelected(day) ? 'Selected' : ''}`;
  }

  // Métodos de validación
  isSelected(day: Date): boolean {
    return (
      day.getDate() === this.selectedDate().getDate() &&
      day.getMonth() === this.selectedDate().getMonth() &&
      day.getFullYear() === this.selectedDate().getFullYear()
    );
  }

  isToday(day: Date): boolean {
    const today = new Date();
    return (
      day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear()
    );
  }

  isCurrentMonth(day: Date): boolean {
    return (
      day.getMonth() === this.currentMonth().getMonth() &&
      day.getFullYear() === this.currentMonth().getFullYear()
    );
  }

  private formatTime(date: Date): string {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
}
