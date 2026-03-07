import { Component } from '@angular/core';
import { UI_PRIMENG } from '../../../../shared/ui/ui-primeng';
import { AppLogo } from '../../../../shared/components/app-logo/app-logo';

@Component({
  selector: 'app-login-page',
  imports: [AppLogo, ...UI_PRIMENG],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {}
