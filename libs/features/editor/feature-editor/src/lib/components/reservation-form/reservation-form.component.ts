import { Component, Input, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UIInputComponent, UIButtonComponent, UIDateTimePickerComponent, CardVariant, UITitleComponent } from '@negocio/ui-components';

@Component({
  selector: 'lib-reservation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UIInputComponent, UIButtonComponent, UIDateTimePickerComponent , UITitleComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
<div id="reservas" class="container mx-auto px-4">
<lib-ui-components-title
      level="h2"
      text="Reservar Cita"
      [variant]="variant"
      animation="fade"
      align="center"
      class="text-4xl font-bold mb-8"
    ></lib-ui-components-title>
  <p class="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
    Reserva tu cita fácilmente y elige el servicio que más te guste.
  </p>
  <form
    [formGroup]="reservationForm"
    (ngSubmit)="onSubmit()"
    class="reservation-form mt-12 bg-gradient-to-br from-pink-50 to-purple-50 backdrop-blur-lg rounded-2xl p-8 space-y-6 border-2 border-pink-200 shadow-2xl"
  >
    <div class="mb-6">
      <lib-ui-components-input
        type="select"
        [variant]="variant"
        size="md"
        label="Elige tu Servicio"
        formControlName="service"
        [options]="serviceOptions"
        (ngModelChange)="onServiceChange($event)"
      ></lib-ui-components-input>
      <div *ngIf="reservationForm.get('service')?.touched && reservationForm.get('service')?.invalid" class="text-red-500 text-sm">
        Por favor, selecciona un servicio.
      </div>
    </div>

    <div class="mb-6">
      <lib-ui-components-input
        type="select"
        [variant]="variant"
        size="md"
        label="Selecciona tu Estilista"
        formControlName="employee"
        [options]="employeeOptions"
      ></lib-ui-components-input>
    </div>

    <div class="mb-6 z-50">
      <lib-ui-components-date-time-picker
        [variant]="variant"
        [rounded]="'full'"
        formControlName="dateTime"
      ></lib-ui-components-date-time-picker>
      <div *ngIf="reservationForm.get('dateTime')?.touched && reservationForm.get('dateTime')?.invalid" class="text-red-500 text-sm">
        Por favor, selecciona una fecha y hora.
      </div>
    </div>

    <ng-container *ngIf="reservationForm.get('service')?.value === 'manicura'">
      <div class="mb-6">
        <lib-ui-components-input
          type="select"
          [variant]="variant"
          size="md"
          label="Tipo de Manicura"
          formControlName="manicureType"
          [options]="[{ value: 'francesa', label: 'Francesa' }, { value: 'gel', label: 'Gel' }, { value: 'arte', label: 'Arte' }]"
        ></lib-ui-components-input>
        <div *ngIf="reservationForm.get('manicureType')?.touched && reservationForm.get('manicureType')?.invalid" class="text-red-500 text-sm">
          Por favor, selecciona un tipo de manicura.
        </div>
      </div>
    </ng-container>

    <ng-container *ngIf="reservationForm.get('service')?.value === 'tinte'">
      <div class="mb-6">
        <lib-ui-components-input
          type="text"
          [variant]="variant"
          size="md"
          label="Color Deseado"
          formControlName="color"
          placeholder="Ej: Rubio platino"
        ></lib-ui-components-input>
        <div *ngIf="reservationForm.get('color')?.touched && reservationForm.get('color')?.invalid" class="text-red-500 text-sm">
          Por favor, ingresa un color.
        </div>
      </div>
    </ng-container>

    <div class="mb-6">
      <lib-ui-components-input
        type="textarea"
        [variant]="variant"
        size="md"
        label="Notas Adicionales"
        formControlName="notes"
        placeholder="Ej: Quiero un corte degradado con diseño."
        [rows]="3"
      ></lib-ui-components-input>
    </div>

    <div class="flex justify-center">
      <lib-ui-components-button
        [variant]="variant"
        size="lg"
        rounded="full"
        leadingIcon="heroStar"
        type="submit"
        [disabled]="reservationForm.invalid"
      >
        ¡Reservar!
      </lib-ui-components-button>
    </div>
  </form>
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
  @Input() variant: CardVariant = 'default';

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