import { Card } from './Card';
import { EventEmitter } from '../Events';

export class CardBasket extends Card {
  private deleteButton: HTMLButtonElement;
  private indexElement: HTMLSpanElement;

  constructor(container: HTMLElement, private events: EventEmitter) {
    super(container);
    this.deleteButton = container.querySelector('.basket__item-delete') as HTMLButtonElement;
    this.indexElement = container.querySelector('.basket__item-index') as HTMLSpanElement;

    this.deleteButton.addEventListener('click', () => {
      this.events.emit('card:basket:remove', { id: this.id });
    });
  }

  setIndex(index: number): void {
    this.indexElement.textContent = index.toString();
  }
}
