import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ApiError } from '../../../core/api/api-error.model';
import { NotificationService } from '../../../core/services/notification.service';
import { RequestState } from '../../../shared/models/request-state.model';
import {
  errorState,
  idleState,
  loadingState,
  successState,
} from '../../../shared/state/request-state.factory';
import { FileUploadApiService } from '../data/file-upload-api.service';
import { UploadedFile } from '../models/uploaded-file.model';

@Injectable({ providedIn: 'root' })
export class FileUploadFacade {
  private readonly uploadApi = inject(FileUploadApiService);
  private readonly notification = inject(NotificationService);

  private readonly _state = signal<RequestState>(idleState());
  private readonly _selectedFile = signal<File | null>(null);
  private readonly _previewUrl = signal<string | null>(null);
  private readonly _uploadedFile = signal<UploadedFile | null>(null);

  readonly state = this._state.asReadonly();
  readonly selectedFile = this._selectedFile.asReadonly();
  readonly previewUrl = this._previewUrl.asReadonly();
  readonly uploadedFile = this._uploadedFile.asReadonly();

  readonly isUploading = computed(() => this._state().status === 'loading');
  readonly hasError = computed(() => this._state().status === 'error');
  readonly hasFile = computed(() => !!this._selectedFile());
  readonly hasUploadedFile = computed(() => !!this._uploadedFile());

  selectFile(file: File | null): void {
    this.resetResultOnly();
    this._selectedFile.set(file);

    if (!file) {
      this._previewUrl.set(null);
      return;
    }

    if (file.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(file);
      this._previewUrl.set(objectUrl);
      return;
    }

    this._previewUrl.set(null);
  }

  async upload(): Promise<void> {
    const file = this._selectedFile();

    if (!file) {
      this._state.set(errorState('Please select a file first.'));
      return;
    }

    this._state.set(loadingState());

    try {
      const result = await firstValueFrom(this.uploadApi.uploadFile(file));
      this._uploadedFile.set(result);
      this._state.set(successState());
      this.notification.success('File uploaded successfully.');
    } catch (error) {
      const apiError = error as ApiError;
      this._uploadedFile.set(null);
      this._state.set(errorState(apiError.message || 'Upload failed.'));
    }
  }

  clear(): void {
    this.revokePreviewIfNeeded();
    this._selectedFile.set(null);
    this._previewUrl.set(null);
    this._uploadedFile.set(null);
    this._state.set(idleState());
  }

  private resetResultOnly(): void {
    this._uploadedFile.set(null);
    this._state.set(idleState());
  }

  private revokePreviewIfNeeded(): void {
    const preview = this._previewUrl();

    if (preview?.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
  }
}
