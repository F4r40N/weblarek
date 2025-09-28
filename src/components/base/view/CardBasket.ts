import { Card } from './Card';
import { EventEmitter } from '../Events';

export class CardBasket extends Card {
  private deleteButton: HTMLButtonElement;
  private index: HTMLSpanElement;

  constructor(container: HTMLElement, private events: EventEmitter) {
    super(container);
    this.deleteButton = container.querySelector('.basket__item-delete') as HTMLButtonElement;
    this.index = container.querySelector('.basket__item-index') as HTMLSpanElement;

    // Установка слушателя на клик по кнопке удаления
    this.deleteButton.addEventListener('click', () => {
      this.events.emit('card:basket:remove', this.container.dataset);
    });
  }

  render(data?: Partial<IProduct>): HTMLElement {
    super.render(data);
    return this.container;
  }

  setIndex(index: number): void {
    this.index.textContent = index.toString();
  }
}
