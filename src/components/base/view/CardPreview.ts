import { Card } from './Card';
import { EventEmitter } from '../Events';
import { Basket } from '../Models/Basket';

export class CardPreview extends Card {
  private button: HTMLButtonElement;
  private description: HTMLParagraphElement;
  private basket: Basket;

  constructor(container: HTMLElement, private events: EventEmitter, basket: Basket) {
    super(container);
    this.button = container.querySelector('.card__button') as HTMLButtonElement;
    this.description = container.querySelector('.card__text') as HTMLParagraphElement;
    this.basket = basket;

    // В обработчик добавляем параметр event и предотвращаем всплытие
    this.button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.events.emit('card:preview:add', this.container.dataset);
    });
  }

  render(data?: Partial<IProduct>): HTMLElement {
    if (data?.description) {
      this.setDescription(data.description);
    }
    super.render(data);

    // Логика для кнопки: проверка наличия в корзине и цены
    const id = this.container.dataset.id;
    const price = data?.price ?? null;
    if (price === null) {
      this.button.textContent = 'Недоступно';
      this.button.disabled = true;
    } else {
      if (this.basket.hasItem(id!)) {
        this.button.textContent = 'Удалить из корзины';
      } else {
        this.button.textContent = 'В корзину';
      }
      this.button.disabled = false;
    }

    return this.container;
  }

  setDescription(description: string): void {
    this.description.textContent = description;
  }
}
