import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApiService } from '../../../core/api/base-api.service';
import { UploadedFile } from '../models/uploaded-file.model';

@Injectable({ providedIn: 'root' })
export class FileUploadApiService extends BaseApiService {
  uploadFile(file: File): Observable<UploadedFile> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<UploadedFile>(this.url('files/upload'), formData);
  }
}
