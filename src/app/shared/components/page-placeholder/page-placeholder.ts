import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-placeholder',
  imports: [],
  templateUrl: './page-placeholder.html',
  styleUrl: './page-placeholder.scss',
})
export class PagePlaceholder {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
