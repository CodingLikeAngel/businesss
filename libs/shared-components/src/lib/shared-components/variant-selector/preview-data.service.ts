import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreviewDataService {

  getDefaultTestimonials() {
    return [
      { quote: 'Excelente servicio, muy recomendado.', author: 'María García' },
      { quote: 'La calidad supera las expectativas.', author: 'Carlos López' }
    ];
  }

  getDefaultServices() {
    return [
      {
        routeName: 'Servicio Premium',
        imageUrl: '',
        difficulty: 'Fácil',
        rating: 4.8,
        reviews: 25,
        duration: 2,
        distance: 5,
        ascent: 200,
        description: 'Descripción del servicio premium con todas las características.',
        features: ['Característica 1', 'Característica 2'],
        link: '#'
      }
    ];
  }

  getDefaultProducts() {
    return [
      { name: 'Producto Destacado', description: 'Descripción del producto con detalles.', image: '', price: '29.99€' }
    ];
  }

  getDefaultFaq() {
    return [
      { title: '¿Cómo funciona?', content: 'Nuestro servicio funciona de manera sencilla y eficiente.', expanded: false }
    ];
  }

  getDefaultGallery() {
    return [
      { src: 'https://via.placeholder.com/300x200', alt: 'Imagen de ejemplo' }
    ];
  }

  getDefaultPricing() {
    return [
      { service: 'Plan Básico', description: 'Ideal para empezar', price: '9.99€' }
    ];
  }
}