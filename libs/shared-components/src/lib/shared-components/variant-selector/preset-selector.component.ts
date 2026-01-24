import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiStateService } from './ui-state.service';
import { VariantService } from '../../../services/variant.service';
import { ExporterService } from '../../services/exporter.service';

/**
 * Selector de presets visuales (Agencia, Clínica, Fitness).
 * Cada preset aplica una variante global predefinida y opcionalmente exporta el proyecto.
 */
@Component({
  selector: 'lib-preset-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preset-selector.component.html',
  styleUrls: ['./preset-selector.component.scss'],
})
export class PresetSelectorComponent {
  @Input() isCollapsed = false;

  presets = [
    { name: 'Prestige Corporate', id: 'prestige', variant: 'glass' },
    { name: 'Quantum Fitness', id: 'fitness', variant: 'neon' },
    { name: 'Midnight Agency', id: 'agency', variant: 'cyberpunk' },
    { name: 'Vogue Boutique', id: 'boutique', variant: 'minimal' }
  ];

  constructor(
    private uiState: UiStateService,
    private variantService: VariantService,
    private exporter: ExporterService,
  ) {}

  applyPreset(preset: any) {
    // Cambia la variante global del editor
    this.variantService.setGlobalVariant(preset.variant);
    // Opcional: actualizar UI
    this.uiState.activeTab = 'general';
  }

  async exportCurrent() {
    // Obtén la configuración completa del editor (simplificado)
    const config = this.variantService.getFullConfig();
    const blob = await this.exporter.exportProject(config);
    // Descarga el zip
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'antostudios-export.zip';
    a.click();
    URL.revokeObjectURL(url);
  }
}
