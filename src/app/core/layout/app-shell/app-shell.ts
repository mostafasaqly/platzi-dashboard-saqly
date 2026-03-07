import { Component, inject } from '@angular/core';
import { LoadingService } from '../../services/loading.service';
import { UI_PRIMENG } from '../../../shared/ui/ui-primeng';
import { SidebarComponent } from '../sidebar/sidebar';
import { TopbarComponent } from '../topbar/topbar';

@Component({
  selector: 'app-shell',
  imports: [SidebarComponent, TopbarComponent, ...UI_PRIMENG],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShell {
  protected readonly loadingService = inject(LoadingService);
}
