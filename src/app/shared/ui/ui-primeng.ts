import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

export const UI_PRIMENG = [
  CommonModule,
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  ButtonModule,
  CardModule,
  InputTextModule,
  PasswordModule,
  FloatLabelModule,
  DividerModule,
  AvatarModule,
  ProgressSpinnerModule,
  ToggleSwitchModule,
] as const;
