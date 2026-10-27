import { Form } from './Form';
import { EventEmitter } from '../Events';
import { IFormData, TPayment } from '../../../types/index';

export class OrderForm extends Form {
  private paymentButtons: HTMLButtonElement[];
  private addressInput: HTMLInputElement;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container, events);
    this.paymentButtons = Array.from(container.querySelectorAll('.button_alt')) as HTMLButtonElement[];
    this.addressInput = container.querySelector('input[name="address"]') as HTMLInputElement;

    this.paymentButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.selectPayment(button.name as TPayment);
      });
    });

    this.addressInput.addEventListener('input', () => {
      this.events.emit('form:order:change', { address: this.addressInput.value });
    });
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
