import { Component } from '../Component';
import { IFormData } from '../../../types/index';
import { EventEmitter } from '../Events';

export abstract class Form extends Component<IFormData> {
  private submitButton: HTMLButtonElement;
  private errors: HTMLSpanElement;

  constructor(container: HTMLElement, private events: EventEmitter) {
    super(container);
    this.submitButton = container.querySelector('.button[type="submit"]') as HTMLButtonElement;
    this.errors = container.querySelector('.form__errors') as HTMLSpanElement;
  }

  render(data?: Partial<IFormData>): HTMLElement {
    Object.assign(this as object, data ?? {});
    return this.container;
  }

  setSubmitEnabled(enabled: boolean): void {
    this.submitButton.disabled = !enabled;
  }

  setErrors(message: string): void {
    this.errors.textContent = message;
  }

  // Метод валидации (переопределяется в наследниках)
  validate(): boolean {
    return true; // Базовая реализация
  }
}
