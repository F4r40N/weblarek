import { Component } from '../Component';
import { IBasketData } from '../../../types/index';
import { EventEmitter } from '../Events';

export class Basket extends Component<IBasketData> {
  private list: HTMLUListElement;
  private total: HTMLSpanElement;
  private button: HTMLButtonElement;

  constructor(container: HTMLElement, private events: EventEmitter) {
    super(container);
    this.list = container.querySelector('.basket__list') as HTMLUListElement;
    this.total = container.querySelector('.basket__price') as HTMLSpanElement;
    this.button = container.querySelector('.basket__button') as HTMLButtonElement;

    // Установка слушателя на клик по кнопке оформления
    this.button.addEventListener('click', () => {
      this.events.emit('basket:order');
    });
  }

  render(data?: Partial<IBasketData>): HTMLElement {
    if (data?.items) {
      this.renderItems(data.items);
    }
    if (data?.total !== undefined) {
      this.setTotal(data.total);
    }
    // Блокировка кнопки, если корзина пуста
    const items = data?.items ?? [];
    this.button.disabled = items.length === 0;
    return this.container;
  }

  renderItems(items: HTMLElement[]): void {
    this.list.replaceChildren(...items);
  }

  setTotal(total: number): void {
    this.total.textContent = `${total} синапсов`;
  }
}
