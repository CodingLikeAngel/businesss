import { Injectable } from '@angular/core';
import { VariantService } from '../../../services/variant.service';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor(private variantService: VariantService) {}

  exportProject() {
    const fullConfig = this.variantService.getFullConfig();
    const blob = new Blob([JSON.stringify(fullConfig, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `config-antostudios-${new Date().getTime()}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}