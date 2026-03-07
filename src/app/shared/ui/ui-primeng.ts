import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

export const UI_PRIMENG = [
  CommonModule,
  FormsModule,
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  AvatarModule,
  ButtonModule,
  CardModule,
  DividerModule,
  FloatLabelModule,
  InputTextModule,
  PasswordModule,
  ProgressSpinnerModule,
  ToastModule,
  ToggleSwitchModule,
] as const;
