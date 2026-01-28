import { Component, Input, OnInit, CUSTOM_ELEMENTS_SCHEMA, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UIButtonComponent, CardVariant, UIDateTimePickerComponent, UIInputComponent, UITitleComponent } from '@negocio/ui-components';

@Component({
  selector: 'lib-reservation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UIInputComponent, UIButtonComponent, UIDateTimePickerComponent , UITitleComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
<div id="reservas" class="container mx-auto px-4 py-16">
  <div class="max-w-4xl mx-auto">
    <div class="text-center mb-12">
      <lib-ui-components-title
          level="h2"
          [text]="title()"
          [variant]="variant()"
          animation="fade"
          align="center"
          class="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600"
      ></lib-ui-components-title>
      <p class="text-xl text-white/60">
        {{ subtitle() }}
      </p>
    </div>

    <div class="relative group">
      <!-- Glow Effect -->
      <div class="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
      
      <form
        [formGroup]="reservationForm"
        (ngSubmit)="onSubmit()"
        [ngStyle]="formStyles()"
        class="relative reservation-form bg-[#0f172a]/80 backdrop-blur-2xl rounded-2xl p-10 space-y-8 border border-white/10 shadow-2xl"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-2">
            <lib-ui-components-input
              type="select"
              [variant]="variant()"
              size="md"
              label="Elige tu Servicio"
              formControlName="service"
              [options]="serviceOptions"
              (ngModelChange)="onServiceChange($event)"
            ></lib-ui-components-input>
            <div *ngIf="reservationForm.get('service')?.touched && reservationForm.get('service')?.invalid" class="text-red-400 text-xs">
              Por favor, selecciona un servicio.
            </div>
          </div>

          <div class="space-y-2">
            <lib-ui-components-input
              type="select"
              [variant]="variant()"
              size="md"
              label="Selecciona tu Estilista"
              formControlName="employee"
              [options]="employeeOptions"
            ></lib-ui-components-input>
          </div>
        </div>

        <div class="space-y-2">
           <label class="block text-sm font-semibold text-white/70 mb-2">Fecha y Hora de la Cita</label>
           <lib-ui-components-date-time-picker
            [variant]="variant()"
            [rounded]="'md'"
            formControlName="dateTime"
          ></lib-ui-components-date-time-picker>
          <div *ngIf="reservationForm.get('dateTime')?.touched && reservationForm.get('dateTime')?.invalid" class="text-red-400 text-xs mt-1">
            Por favor, selecciona una fecha y hora.
          </div>
        </div>

        <ng-container *ngIf="reservationForm.get('service')?.value === 'manicura'">
          <div class="animate-fadeIn">
            <lib-ui-components-input
              type="select"
              [variant]="variant()"
              size="md"
              label="Tipo de Manicura"
              formControlName="manicureType"
              [options]="[{ value: 'francesa', label: 'Francesa' }, { value: 'gel', label: 'Gel' }, { value: 'arte', label: 'Arte' }]"
            ></lib-ui-components-input>
          </div>
        </ng-container>

        <ng-container *ngIf="reservationForm.get('service')?.value === 'tinte'">
          <div class="animate-fadeIn">
            <lib-ui-components-input
              type="text"
              [variant]="variant()"
              size="md"
              label="Color Deseado"
              formControlName="color"
              placeholder="Ej: Rubio platino"
            ></lib-ui-components-input>
          </div>
        </ng-container>

        <div class="space-y-2">
          <lib-ui-components-input
            type="textarea"
            [variant]="variant()"
            size="md"
            label="Notas Adicionales"
            formControlName="notes"
            placeholder="Ej: Algún detalle que debamos saber..."
            [rows]="3"
          ></lib-ui-components-input>
        </div>

        <div class="space-y-6">
           <lib-ui-components-input
            type="range"
            [variant]="variant()"
            label="Presupuesto máximo deseado"
            formControlName="budget"
          ></lib-ui-components-input>

           <lib-ui-components-input
            type="checkbox"
            [variant]="variant()"
            label="Deseo recibir promociones por email"
            formControlName="newsletter"
          ></lib-ui-components-input>

          <lib-ui-components-input
            type="checkbox"
            [variant]="variant()"
            label="Acepto los términos y condiciones"
            formControlName="terms"
          ></lib-ui-components-input>
        </div>

        <div class="flex justify-center pt-4">
          <lib-ui-components-button
            [variant]="variant() === 'default' ? 'primary' : variant()"
            [size]="'lg'"
            [rounded]="'full'"
            type="submit"
            [disabled]="reservationForm.invalid"
            class="w-full md:w-auto md:px-12"
          >
            <span class="flex items-center gap-2">
              Confirmar Reserva <i class="icon-calendar"></i>
            </span>
          </lib-ui-components-button>
        </div>
      </form>
    </div>
  </div>
</div>
  `,
  styles: [
    `
      .reservation-form {
        max-width: 600px;
        margin: 0 auto;
        transition: all 0.3s ease;
      }

      .reservation-form:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 40px rgba(255, 107, 157, 0.3);
      }

      .container {
        max-width: 1200px;
      }

      @media (max-width: 768px) {
        .container {
          padding: 0 1rem;
        }

        .reservation-form {
          padding: 1.5rem;
        }
      }
    `
  ]
})
export class ReservationFormComponent implements OnInit {
  variant = input<CardVariant>('default');
  title = input('Reservar Cita');
  subtitle = input('Reserva tu cita fácilmente y elige el servicio que más te guste.');
  customStyles = input<{[key: string]: string}>({});

  formStyles = computed(() => {
    const styles: any = { ...this.customStyles() };
    if (styles['backgroundColor']) {
      styles['--theme-bg'] = styles['backgroundColor'];
    }
    if (styles['color']) {
      styles['--theme-color'] = styles['color'];
    }
    return styles;
  });


  reservationForm!: FormGroup; // Usamos non-null assertion para indicar que se inicializará en ngOnInit

  serviceOptions = [
    { value: 'corte_hombre', label: 'Corte Hombre' },
    { value: 'corte_mujer', label: 'Corte Mujer' },
    { value: 'manicura', label: 'Manicura' },
    { value: 'tinte', label: 'Tinte' },
  ];

  employeeOptions = [
    { value: 'ana', label: 'Ana' },
    { value: 'laura', label: 'Laura' },
    { value: 'maria', label: 'María' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    // Inicializamos el formulario en ngOnInit para asegurar que fb esté disponible
    this.reservationForm = this.fb.group({
      service: ['', Validators.required],
      employee: [''],
      dateTime: ['', Validators.required],
      manicureType: [''],
      color: [''],
      notes: [''],
      budget: [50],
      newsletter: [false],
      terms: [false, Validators.requiredTrue]
    });

    // Escuchamos cambios en el servicio para actualizar validaciones dinámicas
    this.reservationForm.get('service')?.valueChanges.subscribe((service) => {
      this.onServiceChange(service);
    });
  }

  onServiceChange(service: string) {
    this.reservationForm.patchValue({ manicureType: '', color: '' });
    if (service !== 'manicura') {
      this.reservationForm.get('manicureType')?.clearValidators();
    } else {
      this.reservationForm.get('manicureType')?.setValidators(Validators.required);
    }
    if (service !== 'tinte') {
      this.reservationForm.get('color')?.clearValidators();
    } else {
      this.reservationForm.get('color')?.setValidators(Validators.required);
    }
    this.reservationForm.get('manicureType')?.updateValueAndValidity();
    this.reservationForm.get('color')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.reservationForm.valid) {
      console.log('Reserva enviada:', this.reservationForm.value);
      // Aquí puedes añadir una llamada a un servicio para enviar los datos
    }
  }
}