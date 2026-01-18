import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  TitleConfig,
  ApplyDynamicStylesDirective,
  VisualEditableDirective
} from '@negocio/shared-components';
import {
  UITitleComponent
} from '@negocio/ui-components';
import { BaseEditorSectionComponent } from '../base-editor-section.component';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'lib-editor-contact-section',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UITitleComponent,
    ApplyDynamicStylesDirective,
    VisualEditableDirective
  ],
  templateUrl: './editor-contact-section.component.html',
  styleUrls: ['./editor-contact-section.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-in')
      ]),
      transition('* => void', [
        animate('300ms ease-out', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class EditorContactSectionComponent extends BaseEditorSectionComponent implements OnInit {
  @Input() titleConfig!: TitleConfig;

  contactForm!: FormGroup;
  isSubmitting = false;
  showSuccess = false;

  contactMethods = [
    { value: 'email', label: 'Correo electrónico', icon: '📧' },
    { value: 'phone', label: 'Teléfono', icon: '📞' },
    { value: 'whatsapp', label: 'WhatsApp', icon: '💬' }
  ];

  contactInfo = [
    {
      icon: '📧',
      title: 'Email',
      value: 'info@empresa.com',
      link: 'mailto:info@empresa.com',
      linkText: 'Enviar email'
    },
    {
      icon: '📞',
      title: 'Teléfono',
      value: '+34 900 123 456',
      link: 'tel:+34900123456',
      linkText: 'Llamar ahora'
    },
    {
      icon: '📍',
      title: 'Dirección',
      value: 'Calle Principal 123, Ciudad, País',
      link: 'https://maps.google.com',
      linkText: 'Ver en mapa'
    },
    {
      icon: '🕒',
      title: 'Horario',
      value: 'Lun-Vie: 9:00-18:00',
      link: null,
      linkText: null
    }
  ];

  mapMarkers = [
    {
      icon: '📍',
      title: 'Oficina Principal',
      address: 'Calle Principal 123, Ciudad'
    },
    {
      icon: '🏢',
      title: 'Sucursal Centro',
      address: 'Plaza Mayor 45, Ciudad'
    }
  ];

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^[\+]?[0-9\-\s\(\)]{10,}$/)]],
      contactMethod: ['email'],
      subject: [''],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;

      // Simulate API call
      setTimeout(() => {
        this.isSubmitting = false;
        this.showSuccess = true;

        // Reset form
        this.contactForm.reset();
        this.contactForm.patchValue({ contactMethod: 'email' });

        // Hide success message after 5 seconds
        setTimeout(() => {
          this.showSuccess = false;
        }, 5000);
      }, 2000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }
}
