import { Component } from '../Component';
import { EventEmitter } from '../Events';
import { IFormData } from '../../../types/index';

export abstract class Form extends Component<IFormData> {
  protected submitButton: HTMLButtonElement;
  protected errors: HTMLElement | null;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);
    this.submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
    this.errors = container.querySelector('.form__errors');
  }

  setSubmitEnabled(enabled: boolean): void {
    this.submitButton.disabled = !enabled;
  }

  /** Показать ошибки полей из модели (Record) или служебную строку. */
  setErrors(errors: Record<string, string> | string): void {
    if (!this.errors) return;
    if (typeof errors === 'string') {
      this.errors.textContent = errors;
      return;
    }
    this.errors.textContent = Object.values(errors).join('; ');
  }

  clearErrors(): void {
    this.setErrors({});
  }

  onSubmit(handler: (event: Event) => void): void {
    this.container.addEventListener('submit', handler);
  }

  render(data?: Partial<IFormData>): HTMLElement {
    super.render(data ?? {});
    return this.container;
  }
}
