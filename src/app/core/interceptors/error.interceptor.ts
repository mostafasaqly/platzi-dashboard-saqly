import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { mapHttpError } from '../api/api-response.mapper';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      const apiError = mapHttpError(error);

      notification.error(apiError.message);

      return throwError(() => apiError);

    })
  );
};
