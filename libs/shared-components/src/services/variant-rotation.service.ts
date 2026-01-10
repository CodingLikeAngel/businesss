import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VariantRotationService {
  // Variantes originales para CardVariant
  private readonly variants = [
    'primary', 'secondary', 'outline', 'ghost', 'link', 'neon', 'cyberpunk', 'gradient', 'glass', 'retro',
    'pulse-gradient', 'holo', 'matrix', 'quantum', 'cybernetic', 'danger', 'success', 'nano', 'stellar', 'phoenix',
    'galactic', 'orbitron', 'cartoon', 'luma', 'platform', 'hero', 'coin', 'cloud', 'fire', 'water', 'leaf',
    'amber-glow', 'minimal-white', 'hex-teal', 'purple-edge', 'rose-radial', 'yellow-pulse', 'green-inset',
    'blue-skew', 'orange-dash', 'indigo-dots', 'bubble', 'electoon', 'jungle', 'joycon', 'neomorph', 'glitch', 'portal'
  ] as const;

  // Nuevas variantes para ForestAnimationComponent
  private readonly forestVariants = [
    'enchanted', 'mystic', 'ancient', 'twilight', 'frosty', 'jungle', 'desert', 'candy', 'oceanic', 'fiery'
  ] as const;

  // Sujeto y observable para las variantes originales
  private currentVariantSubject = new BehaviorSubject<string>('electoon');
  currentVariant$ = this.currentVariantSubject.asObservable();

  // Sujeto y observable para las variantes del bosque
  private currentForestVariantSubject = new BehaviorSubject<string>('enchanted');
  currentForestVariant$ = this.currentForestVariantSubject.asObservable();

  private isRotating = false; // Bandera para evitar múltiples intervalos en startRotation
  private isForestRotating = false; // Bandera para evitar múltiples intervalos en startForestRotation

  // Método original para rotar variantes de CardVariant
  startRotation(intervalMs = 5000) {
    if (this.isRotating) {
      return; // No inicia la rotación si ya está activa
    }

    this.isRotating = true;
    interval(intervalMs).subscribe(() => {
      const randomVariant = this.variants[Math.floor(Math.random() * this.variants.length)];
      this.currentVariantSubject.next(randomVariant);
    });
  }

  // Nuevo método para rotar variantes del ForestAnimationComponent
  startForestRotation(intervalMs = 10000) {
    if (this.isForestRotating) {
      return; // No inicia la rotación si ya está activa
    }

    this.isForestRotating = true;
    interval(intervalMs).subscribe(() => {
      const currentIndex = this.forestVariants.indexOf(this.currentForestVariantSubject.value as any);
      const nextIndex = (currentIndex + 1) % this.forestVariants.length; // Cicla al inicio
      const nextVariant = this.forestVariants[nextIndex];
      this.currentForestVariantSubject.next(nextVariant);
    });
  }

  // Método original para obtener la variante actual
  getCurrentVariant() {
    return this.currentVariantSubject.value;
  }

  // Nuevo método para obtener la variante actual del bosque
  getCurrentForestVariant() {
    return this.currentForestVariantSubject.value;
  }
}