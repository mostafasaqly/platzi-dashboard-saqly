import { Component, input } from '@angular/core';

export type StateCardTone = 'empty' | 'error' | 'info';

@Component({
  selector: 'app-state-card',
  imports: [],
  templateUrl: './state-card.html',
  styleUrl: './state-card.scss',
})
export class StateCard {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly icon = input('pi pi-info-circle');
  readonly tone = input<StateCardTone>('info');
}
