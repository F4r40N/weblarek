import { Component } from '../Component';
import { ISuccessData } from '../../../types/index';
import { EventEmitter } from '../Events';

export class Success extends Component<ISuccessData> {
  private description: HTMLParagraphElement;
  private closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, private events: EventEmitter) {
    super(container);
    this.description = container.querySelector('.order-success__description') as HTMLParagraphElement;
    this.closeButton = container.querySelector('.order-success__close') as HTMLButtonElement;

    // Установка слушателя на клик по кнопке закрытия
    this.closeButton.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }

  render(data?: Partial<ISuccessData>): HTMLElement {
    if (data?.total !== undefined) {
      this.setTotal(data.total);
    }
    return this.container;
  }

  setTotal(total: number): void {
    this.description.textContent = `Списано ${total} синапсов`;
  }
}
