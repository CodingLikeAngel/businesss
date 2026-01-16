import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Page } from '../../models/editor.model';

@Component({
  selector: 'lib-page-selector-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-md">
        <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Seleccionar Página de Destino</h3>
        
        <div class="space-y-3 mb-6 max-h-64 overflow-y-auto">
          <div *ngFor="let page of pages"
               class="p-3 border rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
               [class.bg-blue-50]="selectedPageId === page.id"
               (click)="selectPage(page.id)">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ page.name }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ page.slug }}</p>
              </div>
              <div class="flex items-center space-x-2">
                <span *ngIf="page.isHomePage" class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Home</span>
                <span *ngIf="page.visibleInHeader" class="text-green-500">🔝</span>
                <span *ngIf="page.visibleInFooter" class="text-green-500">⧉</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3">
          <button class="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
                  (click)="onCancel()">
            Cancelar
          </button>
          <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
                  [disabled]="!selectedPageId"
                  (click)="onConfirm()">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  `
})

export class PageSelectorModalComponent {
  @Input() pages: Page[] = [];
  @Input() currentPageId: string | null = null;
  @Output() pageSelected = new EventEmitter<string>();
  @Output() cancelled = new EventEmitter<void>();
  
  selectedPageId: string | null = null;
  
  ngOnInit() {
    // Seleccionar la página actual por defecto si existe
    if (this.currentPageId && this.pages.some(p => p.id === this.currentPageId)) {
      this.selectedPageId = this.currentPageId;
    } else if (this.pages.length > 0) {
      // Seleccionar la primera página por defecto
      this.selectedPageId = this.pages[0].id;
    }
  }
  
  selectPage(pageId: string) {
    this.selectedPageId = pageId;
  }
  
  onConfirm() {
    if (this.selectedPageId) {
      this.pageSelected.emit(this.selectedPageId);
    }
  }
  
  onCancel() {
    this.cancelled.emit();
  }
}