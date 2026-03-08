import { Injectable, inject } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private readonly confirmationService = inject(ConfirmationService);

  confirmDelete(options: {
    target?: EventTarget | null;
    entityName: string;
    onAccept: () => void | Promise<void>;
  }): void {
    this.confirmationService.confirm({
      target: options.target instanceof HTMLElement ? options.target : undefined,
      message: `Are you sure you want to delete "${options.entityName}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },
      accept: () => {
        void options.onAccept();
      },
    });
  }
}
