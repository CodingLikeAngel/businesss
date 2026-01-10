import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-ui-components-deep-footer',
  imports: [CommonModule],
  templateUrl: './deep-footer.component.html',
  styleUrl: './deep-footer.component.scss',
})
export class UIDeepFooterComponent {

  @Input() theme = 'theme-mario'; // Tema por defecto

  /*<footer class="footer" [ngClass]="theme">
  <!-- Resto del código -->
</footer>*/

}
