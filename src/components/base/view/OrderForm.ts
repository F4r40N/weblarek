import { Form } from './Form';
import { EventEmitter } from '../Events';
import { IFormData, TPayment } from '../../../types/index';

export class OrderForm extends Form {
  private paymentButtons: HTMLButtonElement[];
  private addressInput: HTMLInputElement;
  private paymentError: HTMLElement | null;
  private addressError: HTMLElement | null;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container, events);
    this.paymentButtons = Array.from(container.querySelectorAll('.button_alt')) as HTMLButtonElement[];
    this.addressInput = container.querySelector('input[name="address"]') as HTMLInputElement;
    this.paymentError = container.querySelector('.payment-error');
    this.addressError = container.querySelector('.address-error');

    this.paymentButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.selectPayment(button.name as TPayment);
      });
    });

    this.addressInput.addEventListener('input', () => {
      this.events.emit('form:order:change', { address: this.addressInput.value });
    });
  }

  setErrors(errors: Record<string, string> | string): void {
    if (typeof errors === 'string') {
      if (this.paymentError) this.paymentError.textContent = errors;
      if (this.addressError) this.addressError.textContent = '';
      super.setErrors(errors);
      return;
    }
    if (this.paymentError) this.paymentError.textContent = errors.payment ?? '';
    if (this.addressError) this.addressError.textContent = errors.address ?? '';
    super.setErrors(errors);
  }

  render(data?: Partial<IFormData>): HTMLElement {
    if (data?.payment) {
      this.selectPayment(data.payment as TPayment, false);
    }
    if (data?.address !== undefined) {
      this.addressInput.value = data.address;
    }
    return super.render(data);
  }

  selectPayment(btnName: TPayment, emit = true): void {
    this.paymentButtons.forEach((button) => {
      button.classList.toggle('button_alt-active', button.name === btnName);
    });
    if (emit) {
      this.events.emit('form:order:change', { payment: btnName });
    }
  }
}
