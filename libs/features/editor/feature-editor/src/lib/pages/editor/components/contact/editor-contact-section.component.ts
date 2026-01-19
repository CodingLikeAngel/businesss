import { Component, Input, OnInit, ElementRef, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  TitleConfig,
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import {
  UITitleComponent
} from '@negocio/ui-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'lib-editor-contact-section',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UITitleComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective
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
export class EditorContactSectionComponent extends EnhancedBaseEditorSectionComponent implements OnInit, AfterViewInit {
  @Input() titleConfig!: TitleConfig;
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('contactElement', { static: true }) contactElement!: ElementRef;
  @ViewChild('titleElement', { static: false }) titleElement?: ElementRef;

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

  constructor(
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    super(platformId);
  }

  override ngOnInit() {
    super.ngOnInit();
    this.initForm();
  }

  ngAfterViewInit() {
    // Apply standardized visual editing to elements
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.contactElement, this.section.id + '_contact');
    if (this.titleElement) {
      this.applyElementVisualEditing(this.titleElement, this.section.id + '_title');
    }
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

  /**
   * Get configuration for the section container
   */
  getSectionConfig(): VisualEditingConfig {
    return this.createElementConfig('section', {
      constraints: {
        containment: 'parent',
        minDistance: { top: 10, right: 10, bottom: 10, left: 10 },
        collisionDetection: false,
        safeZones: []
      },
      styling: {
        selectionOutline: '2px solid #6366f1',
        hoverEffects: true,
        dimensionLabels: true,
        resizeHandles: true
      },
      interactions: {
        touchEnabled: true,
        multiSelect: false,
        snapToGrid: 0,
        animationDuration: 200,
        hapticFeedback: false
      }
    });
  }

  /**
   * Get configuration for the contact element
   */
  getContactConfig(): VisualEditingConfig {
    return this.createElementConfig('element', {
      interactions: {
        snapToGrid: 5,
        animationDuration: 150,
        touchEnabled: this.platformInfo.isTouch,
        multiSelect: true,
        hapticFeedback: true
      },
      constraints: {
        containment: 'parent',
        collisionDetection: true,
        minDistance: { top: 5, right: 5, bottom: 5, left: 5 },
        safeZones: []
      },
      styling: {
        selectionOutline: '2px solid #10b981',
        hoverEffects: !this.platformInfo.isMobile,
        dimensionLabels: !this.platformInfo.isMobile,
        resizeHandles: true
      }
    });
  }

  /**
   * Get configuration for the title element
   */
  getTitleConfig(): VisualEditingConfig {
    return this.createElementConfig('element', {
      interactions: {
        snapToGrid: 5,
        animationDuration: 150,
        touchEnabled: this.platformInfo.isTouch,
        multiSelect: true,
        hapticFeedback: true
      },
      constraints: {
        containment: 'parent',
        collisionDetection: true,
        minDistance: { top: 5, right: 5, bottom: 5, left: 5 },
        safeZones: []
      },
      styling: {
        selectionOutline: '2px solid #10b981',
        hoverEffects: !this.platformInfo.isMobile,
        dimensionLabels: !this.platformInfo.isMobile,
        resizeHandles: true
      }
    });
  }

  /**
   * Handle visual editing events
   */
  handleSectionEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id);
  }

  handleContactEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_contact');
  }

  handleTitleEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_title');
  }

  /**
   * Custom event handling for contact-specific logic
   */
  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (elementId === this.section.id + '_contact') {
      switch (event.type) {
        case 'selected':
          console.log('Contact element selected for editing');
          break;
        case 'moved':
          this.updateContactPosition(event.bounds);
          break;
        case 'resized':
          break;
      }
    } else if (elementId === this.section.id + '_title') {
      switch (event.type) {
        case 'selected':
          console.log('Title element selected for editing');
          break;
        case 'moved':
          this.updateTitlePosition(event.bounds);
          break;
        case 'resized':
          break;
      }
    }
  }

  /**
   * Update contact position in section data
   */
  private updateContactPosition(bounds: any): void {
    console.log('Contact position updated:', bounds);
  }

  /**
   * Update title position in section data
   */
  private updateTitlePosition(bounds: any): void {
    console.log('Title position updated:', bounds);
  }
}
