import { Card } from './Card';
import { EventEmitter } from '../Events';

export class CardCatalog extends Card {
  constructor(container: HTMLElement, private events: EventEmitter) {
    super(container);

    // Установка слушателя на клик по карточке
    container.addEventListener('click', () => {
      this.events.emit('card:catalog:select', this.container.dataset);
    });
  }

  render(data?: Partial<IProduct>): HTMLElement {
    super.render(data);
    return this.container;
  }
}
