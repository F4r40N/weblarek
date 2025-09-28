import { Component } from '../Component';
import { IModalData } from '../../../types/index';
import { EventEmitter } from '../Events';

export class Modal extends Component<IModalData> {
  private closeButton: HTMLButtonElement;
  private content: HTMLDivElement;

  constructor(container: HTMLElement, private events: EventEmitter) {
    super(container);
    this.closeButton = container.querySelector('.modal__close') as HTMLButtonElement;
    this.content = container.querySelector('.modal__content') as HTMLDivElement;

    // Установка слушателя на клик по кнопке закрытия
    this.closeButton.addEventListener('click', () => {
      this.events.emit('modal:close');
    });

    // Добавляем обработчик для клика вне модального окна
    this.container.parentElement?.addEventListener('click', (event) => {
      if (event.target === this.container.parentElement) {
        this.events.emit('modal:close');
      }
    });

    // Добавляем обработчик для клавиши Esc
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.events.emit('modal:close');
      }
    });
  }

  render(data?: Partial<IModalData>): HTMLElement {
    if (data?.content) {
      this.setContent(data.content);
    }
    return this.container;
  }

  open(): void {
    // Добавляем класс modal_active родителю container, т.е. элементу с классом 'modal'
    this.container.parentElement?.classList.add('modal_active');
  }

  close(): void {
    this.container.parentElement?.classList.remove('modal_active');
  }

  setContent(element: HTMLElement): void {
    this.content.replaceChildren(element);
  }
}
