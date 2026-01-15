import { isPlatformBrowser } from "@angular/common";
import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { Router } from "@angular/router";
import { UISpinnerComponent } from "@negocio/ui-components";


@Component({ 
      imports: [UISpinnerComponent],
    template: `
    <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-yellow-400 dark:from-purple-700 dark:via-pink-800 dark:to-yellow-700 transition-all duration-500">
      <div class="relative flex flex-col items-center gap-6 p-6 bg-white/30 dark:bg-black/30 rounded-2xl shadow-lg backdrop-blur-sm">
        <!-- Welcome message -->
        <h1 class="text-4xl font-bold text-white drop-shadow-md animate-bounce-in">
         Hola Bienvenido 
        </h1>
        <!-- Spinner from your library -->
        <lib-ui-spinner class="text-yellow-300"  aria-label="Loading"></lib-ui-spinner>
        <!-- Fun loading text -->
        <span class="text-lg font-semibold text-white drop-shadow-sm animate-pulse">
        Estamos Configurando todo para ti...:)
        </span>
      </div>
    </div>
  `,
  styles: [
    `
      @keyframes bounceIn {
        0% { opacity: 0; transform: scale(0.7); }
        50% { opacity: 0.5; transform: scale(1.1); }
        100% { opacity: 1; transform: scale(1); }
      }
      .animate-bounce-in {
        animation: bounceIn 0.8s ease-out forwards;
      }
    `,
  ], // Inline CSS for custom bounce animation
  
})

export class ShellRedirectComponent {
  constructor(router: Router, @Inject(PLATFORM_ID) platformId: object) {
    if (isPlatformBrowser(platformId)) {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      router.navigateByUrl(isMobile ? '/mobile' : '/desktop');
    }
  }
}