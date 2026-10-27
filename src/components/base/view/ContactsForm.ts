import { Form } from './Form';
import { EventEmitter } from '../Events';
import { IFormData } from '../../../types/index';

export class ContactsForm extends Form {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container, events);
    this.emailInput = container.querySelector('input[name="email"]') as HTMLInputElement;
    this.phoneInput = container.querySelector('input[name="phone"]') as HTMLInputElement;

    this.emailInput.addEventListener('input', () => {
      this.events.emit('form:contacts:change', { email: this.emailInput.value });
    });
    this.phoneInput.addEventListener('input', () => {
      this.events.emit('form:contacts:change', { phone: this.phoneInput.value });
    });
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
