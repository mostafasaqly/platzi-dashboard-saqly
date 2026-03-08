import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatorModule } from 'primeng/paginator';
export const UI_PRIMENG = [
  CommonModule,
  FormsModule,
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  AvatarModule,
  ButtonModule,
  CardModule,
  ChartModule,
  DividerModule,
  FloatLabelModule,
  InputTextModule,
  PasswordModule,
  ProgressSpinnerModule,
  SkeletonModule,
  TagModule,
  ToastModule,
  ToggleSwitchModule,
  ConfirmDialogModule,
  PaginatorModule
] as const;
