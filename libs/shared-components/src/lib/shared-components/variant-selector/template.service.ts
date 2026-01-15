import { Injectable } from '@angular/core';
import { VariantService } from '../../../services/variant.service';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  constructor(private variantService: VariantService) {}

  saveAsCustomTemplate() {
    const name = prompt('Nombre para tu plantilla personalizada:', 'Nueva Plantilla');
    if (name) {
      const config = this.variantService.getFullConfig();
      const templates = JSON.parse(localStorage.getItem('custom_templates') || '[]');
      templates.push({
        ...config,
        id: `custom_${new Date().getTime()}`,
        name,
        category: 'Personalizado',
        icon: '💎'
      });
      localStorage.setItem('custom_templates', JSON.stringify(templates));
      alert('Plantilla guardada correctamente en el navegador.');
    }
  }

  onTemplateApplied() {
    // Template has been applied, configurations will update automatically via subscriptions
    // No action needed as all configs are subscribed in ngOnInit
  }
}