import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExporterService } from '../../services/exporter.service';
import { VariantService } from '../../../services/variant.service';
import { DownloadService } from '../../services/download.service';

@Component({
  selector: 'lib-export-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './export-panel.component.html',
  styleUrls: ['./export-panel.component.scss'],
})
export class ExportPanelComponent {
  constructor(
    private exporter: ExporterService,
    private variantService: VariantService,
    private downloadService: DownloadService
  ) {}

  async exportProject() {
    const config = this.variantService.getFullConfig();
    const blob = await this.exporter.exportProject(config);
    this.downloadService.download(blob, 'antostudios-export.zip');
  }
}
