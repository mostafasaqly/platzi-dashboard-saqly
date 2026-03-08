import { Component, ElementRef, ViewChild, inject } from '@angular/core';

import { UI_PRIMENG } from '../../../../shared/ui/ui-primeng';
import { FileUploadFacade } from '../../facades/file-upload.facade';

@Component({
  selector: 'app-file-upload-page',
  imports: [...UI_PRIMENG],
  templateUrl: './file-upload-page.html',
  styleUrl: './file-upload-page.scss',
})
export class FileUploadPage {
  @ViewChild('fileInput')
  private readonly fileInputRef?: ElementRef<HTMLInputElement>;

  protected readonly fileUploadFacade = inject(FileUploadFacade);

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    this.fileUploadFacade.selectFile(file);
  }

  protected async upload(): Promise<void> {
    await this.fileUploadFacade.upload();
  }

  protected clear(): void {
    this.fileUploadFacade.clear();

    if (this.fileInputRef?.nativeElement) {
      this.fileInputRef.nativeElement.value = '';
    }
  }
}
