import { Form } from './Form';
import { EventEmitter } from '../Events';
import { IFormData } from '../../../types/index';

export class ContactsForm extends Form {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private emailError: HTMLElement | null;
  private phoneError: HTMLElement | null;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container, events);
    this.emailInput = container.querySelector('input[name="email"]') as HTMLInputElement;
    this.phoneInput = container.querySelector('input[name="phone"]') as HTMLInputElement;
    this.emailError = container.querySelector('.email-error');
    this.phoneError = container.querySelector('.phone-error');

    this.emailInput.addEventListener('input', () => {
      this.events.emit('form:contacts:change', { email: this.emailInput.value });
    });
    this.phoneInput.addEventListener('input', () => {
      this.events.emit('form:contacts:change', { phone: this.phoneInput.value });
    });
  }

  setErrors(errors: Record<string, string> | string): void {
    if (typeof errors === 'string') {
      if (this.emailError) this.emailError.textContent = errors;
      if (this.phoneError) this.phoneError.textContent = '';
      super.setErrors(errors);
      return;
    }
    if (this.emailError) this.emailError.textContent = errors.email ?? '';
    if (this.phoneError) this.phoneError.textContent = errors.phone ?? '';
    super.setErrors(errors);
  }

  render(data?: Partial<IFormData>): HTMLElement {
    if (data?.email !== undefined) {
      this.emailInput.value = data.email;
    }
    if (data?.phone !== undefined) {
      this.phoneInput.value = data.phone;
    }
    return super.render(data);
  }
}
