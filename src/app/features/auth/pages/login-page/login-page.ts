import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UI_PRIMENG } from '../../../../shared/ui/ui-primeng';
import { AppLogo } from '../../../../shared/components/app-logo/app-logo';

@Component({
  selector: 'app-login-page',
  imports: [AppLogo, ...UI_PRIMENG],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {

  private http = inject(HttpClient);

  login() {
    this.http.post('https://api.escuelajs.co/api/v1/auth/login', {
      email: 'mostafasaqly1@gmail.com',
      password: 'Passw0rd'
    }).subscribe({
      next: (res) => {
        console.log('Login Success:', res);
      },
      error: (err) => {
        console.error('Login Error:', err);
      }
    });
  }

}
