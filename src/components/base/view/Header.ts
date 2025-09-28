import { Component } from '../Component';
import { IHeaderData } from '../../../types/index';
import { EventEmitter } from '../Events';

export class Header extends Component<IHeaderData> {
  private headerButton: HTMLButtonElement;
  private counter: HTMLSpanElement;

  constructor(container: HTMLElement, private events: EventEmitter) {
    super(container);
    this.headerButton = container.querySelector('.header__basket') as HTMLButtonElement;
    this.counter = container.querySelector('.header__basket-counter') as HTMLSpanElement;

    // Установка слушателя на клик по кнопке корзины
    this.headerButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  render(data?: Partial<IHeaderData>): HTMLElement {
    if (data?.count !== undefined) {
      this.setCount(data.count);
    }
    return this.container;
  }

  setCount(count: number): void {
    this.counter.textContent = count.toString();
  }
}
