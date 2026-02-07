import { Injectable, signal } from '@angular/core';

export interface GoogleFont {
  family: string;
  category: string;
  variants: string[];
  subsets: string[];
}

@Injectable({
  providedIn: 'root'
})
export class GoogleFontsService {
  private loadedFonts = new Set<string>();
  
  // High-end curated font list to avoid overloading
  availableFonts = signal<GoogleFont[]>([
    { family: 'Inter', category: 'sans-serif', variants: ['400', '700', '900'], subsets: ['latin'] },
    { family: 'Outfit', category: 'sans-serif', variants: ['400', '700', '900'], subsets: ['latin'] },
    { family: 'Playfair Display', category: 'serif', variants: ['400', '700', '900'], subsets: ['latin'] },
    { family: 'Montserrat', category: 'sans-serif', variants: ['400', '700', '900'], subsets: ['latin'] },
    { family: 'Roboto', category: 'sans-serif', variants: ['400', '700', '900'], subsets: ['latin'] },
    { family: 'Syne', category: 'display', variants: ['400', '700', '800'], subsets: ['latin'] },
    { family: 'Bebas Neue', category: 'display', variants: ['400'], subsets: ['latin'] },
    { family: 'Space Grotesk', category: 'sans-serif', variants: ['400', '700'], subsets: ['latin'] },
    { family: 'Fraunces', category: 'serif', variants: ['400', '700', '900'], subsets: ['latin'] },
    { family: 'Epilogue', category: 'sans-serif', variants: ['400', '700', '900'], subsets: ['latin'] },
    { family: 'Bungee', category: 'display', variants: ['400'], subsets: ['latin'] },
    { family: 'JetBrains Mono', category: 'monospace', variants: ['400', '700'], subsets: ['latin'] }
  ]);

  loadFont(family: string) {
    if (this.loadedFonts.has(family)) return;

    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    const fontName = family.replace(/\s+/g, '+');
    link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@400;700;900&display=swap`;
    
    head.appendChild(link);
    this.loadedFonts.add(family);
  }

  getFontFamily(family: string): string {
    return `'${family}', sans-serif`;
  }
}
