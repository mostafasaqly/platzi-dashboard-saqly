import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { UI_PRIMENG } from '../../../shared/ui/ui-primeng';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-topbar',
  imports: [...UI_PRIMENG, FormsModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class TopbarComponent {
  protected readonly themeService = inject(ThemeService);
}
