import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyboardService } from '../../../../services/keyboard.service';

@Component({
  selector: 'lib-shortcuts-guide',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shortcuts-guide.component.html',
  styleUrls: ['./shortcuts-guide.component.scss']
})
export class ShortcutsGuideComponent {
  @Output() close = new EventEmitter<void>();
  
  private keyboardService = inject(KeyboardService);
  
  shortcutsByCategory = this.keyboardService.getShortcutsByCategory();
  categories = Object.keys(this.shortcutsByCategory);

  getDisplay(shortcut: any) {
    return this.keyboardService.getShortcutDisplay(shortcut);
  }

  closeGuide() {
    this.close.emit();
  }
}
