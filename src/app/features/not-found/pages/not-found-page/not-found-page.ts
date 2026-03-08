import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { UI_PRIMENG } from '../../../../shared/ui/ui-primeng';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink, ...UI_PRIMENG],
  templateUrl: './not-found-page.html',
  styleUrl: './not-found-page.scss',
})
export class NotFoundPage {}
