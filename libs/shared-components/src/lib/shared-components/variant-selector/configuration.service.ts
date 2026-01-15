import { Injectable } from '@angular/core';
import { VariantService } from '../../../services/variant.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(private variantService: VariantService) {}

  updateHeaderConfig(config: any) {
    this.variantService.setHeaderConfig(config);
  }

  updateFooterConfig(config: any) {
    this.variantService.setFooterConfig(config);
  }

  updateNavBarConfig(config: any) {
    this.variantService.setNavBarConfig(config);
  }

  updateHeroConfig(config: any) {
    this.variantService.setHeroConfig(config);
  }

  updateBubbleConfig(config: any) {
    this.variantService.setBubbleConfig(config);
  }

  updateCardConfig(config: any) {
    this.variantService.setCardConfig(config);
  }

  updateTitleConfig(config: any) {
    this.variantService.setTitleConfig(config);
  }

  resetConfiguration() {
    if (confirm('¿Estás seguro de que quieres restablecer toda la configuración? Se perderán todos los cambios.')) {
      this.variantService.resetConfig();
    }
  }

  setGlobalVariant(variant: string) {
    this.variantService.setGlobalVariant(variant);
  }

  setComponentVariant(componentId: string, variant: string | null) {
    this.variantService.setComponentVariant(componentId, variant);
  }

  clearAllComponentVariants() {
    this.variantService.clearAllComponentVariants();
  }
}