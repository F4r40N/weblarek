import { Form } from './Form';
import { EventEmitter } from '../Events';

export class ContactsForm extends Form {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container, events);
    this.emailInput = container.querySelector('input[name="email"]') as HTMLInputElement;
    this.phoneInput = container.querySelector('input[name="phone"]') as HTMLInputElement;

    // Установка слушателей на ввод
    this.emailInput.addEventListener('input', () => {
      this.events.emit('form:contacts:change', { email: this.emailInput.value });
    });
    this.phoneInput.addEventListener('input', () => {
      this.events.emit('form:contacts:change', { phone: this.phoneInput.value });
    });
  }

  render(data?: Partial<IFormData>): HTMLElement {
    if (data?.email) {
      this.emailInput.value = data.email;
    }
    if (data?.phone) {
      this.phoneInput.value = data.phone;
    }
    super.render(data);
    return this.container;
  }

  validate(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanPhone = this.phoneInput.value.replace(/[\s-]/g, '');
    const phoneRegex = /^\+7\d{10}$/;
    return emailRegex.test(this.emailInput.value) && phoneRegex.test(cleanPhone);
  }
}
