import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UIInputComponent, UIButtonComponent, CardVariant } from '@negocio/ui-components';

@Component({
  selector: 'lib-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UIInputComponent, UIButtonComponent],
  template: `
   <div id="contacto">

  <form
    [formGroup]="contactForm"
    (ngSubmit)="onSubmit()"
    class="bg-[rgba(255,30,86,0.2)] backdrop-blur-lg rounded-xl p-8 space-y-4 border-2 border-[#FF6B9D] shadow-[0_0_15px_rgba(255,107,157,0.7)]"
  >
    <div class="mb-6">
      <lib-ui-components-input
        type="text"
        [variant]="variant"
        size="md"
        label="Nombre"
        formControlName="name"
        placeholder="Tu nombre"
      ></lib-ui-components-input>
      <div *ngIf="contactForm.get('name')?.touched && contactForm.get('name')?.invalid" class="text-red-500 text-sm">
        El nombre es obligatorio.
      </div>
    </div>

    <div class="mb-6">
      <lib-ui-components-input
        type="email"
        [variant]="variant"
        size="md"
        label="Correo Electrónico"
        formControlName="email"
        placeholder="tu@correo.com"
      ></lib-ui-components-input>
      <div *ngIf="contactForm.get('email')?.touched && contactForm.get('email')?.invalid" class="text-red-500 text-sm">
        Por favor, ingresa un correo válido.
      </div>
    </div>

    <div class="mb-6">
      <lib-ui-components-input
        type="textarea"
        [variant]="variant"
        size="md"
        label="Mensaje"
        formControlName="message"
        placeholder="¿En qué podemos ayudarte?"
        [rows]="3"
      ></lib-ui-components-input>
      <div *ngIf="contactForm.get('message')?.touched && contactForm.get('message')?.invalid" class="text-red-500 text-sm">
        El mensaje es obligatorio.
      </div>
    </div>

    <div class="flex justify-center">
      <lib-ui-components-button
        [variant]="variant"
        size="lg"
        rounded="full"
        type="submit"
        [disabled]="contactForm.invalid"
      >
        ¡Enviar!
      </lib-ui-components-button>
    </div>
  </form>
</div>


  `,
})
export class ContactFormComponent implements OnInit {
  @Input() variant: CardVariant = 'default';

  contactForm!: FormGroup; // Usamos non-null assertion para indicar que se inicializará en ngOnInit

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    // Inicializamos el formulario en ngOnInit para asegurar que fb esté disponible
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Contacto enviado:', this.contactForm.value);
      // Llamada a un servicio para enviar el formulario
    }
  }
}