import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from './api-error.model';

export function mapHttpError(error: HttpErrorResponse): ApiError {
  return {
    status: error.status,
    message:
      error.error?.message ||
      error.message ||
      'Unexpected server error',
    details: error.error,
  };
}
