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
    this.downloadBlob(blob, `project-antostudios-${new Date().getTime()}.json`);
  }

  exportAsHtml() {
    const fullConfig = this.variantService.getFullConfig();
    const html = this.generateStaticHtml(fullConfig);
    const blob = new Blob([html], { type: 'text/html' });
    this.downloadBlob(blob, `preview-antostudios-${new Date().getTime()}.html`);
  }

  private downloadBlob(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private generateStaticHtml(config: any): string {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Website - Anto Studios</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
    <style>
        :root { --primary: #3b82f6; --accent: #6366f1; }
        body { font-family: 'Outfit', sans-serif; background: #030712; color: white; }
        .glass { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); }
    </style>
</head>
<body>
    <div id="root">
       <!-- 
          NOTE: This is a JSON mapping of your project. 
          To convert this to a live site, use the Anto Studios CLI or 
          import this into a standard Angular Business Template project.
       -->
       <div class="flex flex-col items-center justify-center min-h-screen text-center p-10">
          <h1 class="text-5xl font-bold mb-6">Proyecto Listo para Producción</h1>
          <p class="text-xl text-gray-400 max-w-2xl">
             Has exportado satisfactoriamente la configuración de tu web. 
             El archivo JSON adjunto contiene toda la estructura de bloques, estilos y variantes.
          </p>
          <div class="mt-8 p-6 bg-gray-900 rounded-xl border border-gray-800 text-left overflow-auto max-w-4xl max-h-[400px]">
             <pre class="text-sm text-cyan-400">\${JSON.stringify(config, null, 2)}</pre>
          </div>
          <p class="mt-10 text-gray-500 font-mono">Anto Studios Editor v2.0 - Final MVP</p>
       </div>
    </div>
</body>
</html>`;
  }
}