import { Card } from './Card';
import { EventEmitter } from '../Events';
import { IProduct } from '../../../types/index';

export class CardPreview extends Card {
  private button: HTMLButtonElement;
  private descriptionElement: HTMLParagraphElement;

  constructor(container: HTMLElement, private events: EventEmitter) {
    super(container);
    this.button = container.querySelector('.card__button') as HTMLButtonElement;
    this.descriptionElement = container.querySelector('.card__text') as HTMLParagraphElement;

    this.button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.events.emit('card:preview:add', { id: this.id });
    });
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  render(data?: Partial<IProduct> & { inBasket?: boolean }): HTMLElement {
    const inBasket = data?.inBasket ?? false;
    const { inBasket: _inBasket, ...productData } = data ?? {};
    super.render(productData);

    const price = data?.price ?? null;
    if (price === null) {
      this.button.textContent = 'Недоступно';
      this.button.disabled = true;
    } else {
      this.button.textContent = inBasket ? 'Удалить из корзины' : 'В корзину';
      this.button.disabled = false;
    }

    return this.container;
  }
}
