import { Card } from './Card';
import { EventEmitter } from '../Events';

export class CardCatalog extends Card {
  constructor(container: HTMLElement, private events: EventEmitter) {
    super(container);
    container.addEventListener('click', () => {
      this.events.emit('card:catalog:select', { id: this.id });
    });
  }
}
