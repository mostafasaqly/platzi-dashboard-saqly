import { Component, input } from '@angular/core';

@Component({
  selector: 'app-logo',
  imports: [],
  templateUrl: './app-logo.html',
  styleUrl: './app-logo.scss',
})
export class AppLogo {
  readonly compact = input(false);
}
