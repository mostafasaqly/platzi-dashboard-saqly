import { Component } from '@angular/core';
import { APP_ROUTES } from '../../constants/app-routes.const';
import { NavItem } from '../../models/nav-item.model';
import { UI_PRIMENG } from '../../../shared/ui/ui-primeng';
import { AppLogo } from '../../../shared/components/app-logo/app-logo';

@Component({
  selector: 'app-sidebar',
  imports: [AppLogo, ...UI_PRIMENG],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {
  protected readonly items: NavItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', route: `/${APP_ROUTES.dashboard}` },
    { label: 'Products', icon: 'pi pi-box', route: `/${APP_ROUTES.products}` },
    { label: 'Categories', icon: 'pi pi-tags', route: `/${APP_ROUTES.categories}` },
    { label: 'Users', icon: 'pi pi-users', route: `/${APP_ROUTES.users}` },
    { label: 'File Upload', icon: 'pi pi-upload', route: `/${APP_ROUTES.files}` },
    { label: 'Settings', icon: 'pi pi-cog', route: `/${APP_ROUTES.settings}` },
  ];
}
