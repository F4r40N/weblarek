import { Form } from './Form';
import { EventEmitter } from '../Events';
import { TPayment } from '../../../types/index';

export class OrderForm extends Form {
  private paymentButtons: HTMLButtonElement[];
  private addressInput: HTMLInputElement;
  private addressHint: HTMLSpanElement;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container, events);
    this.paymentButtons = Array.from(container.querySelectorAll('.button_alt')) as HTMLButtonElement[];
    this.addressInput = container.querySelector('input[name="address"]') as HTMLInputElement;
    this.addressHint = container.querySelector('.address-hint') as HTMLSpanElement;

    console.log('Container:', container);
    console.log('AddressHint element:', this.addressHint);
    if (!this.addressHint) {
      console.error('Элемент .address-hint не найден в DOM! Проверьте index.html.');
    }

    // Установка слушателей на кнопки оплаты
    this.paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.selectPayment(button.name as TPayment);
      });
    });

    // Установка слушателя на ввод адреса
    this.addressInput.addEventListener('input', () => {
      this.events.emit('form:order:change', { address: this.addressInput.value });
      this.hideAddressHint();
    });
  }

  render(data?: Partial<IFormData>): HTMLElement {
    if (data?.payment) {
      this.selectPayment(data.payment);
    }
    if (data?.address) {
      this.addressInput.value = data.address;
      this.hideAddressHint();
    }
    super.render(data);
    return this.container;
  }

  selectPayment(btnName: TPayment): void {
    this.paymentButtons.forEach(button => {
      button.classList.toggle('button_alt-active', button.name === btnName);
    });
    this.events.emit('form:order:change', { payment: btnName });
    if (this.addressInput.value.trim() === '') {
      this.showAddressHint();
    } else {
      this.hideAddressHint();
    }
  }

  private showAddressHint(): void {
    if (this.addressHint) {
      this.addressHint.textContent = 'Необходимо указать адрес';
      this.addressHint.style.display = 'block';
    }
  }

  private hideAddressHint(): void {
    if (this.addressHint) {
      this.addressHint.style.display = 'none';
    }
  }

  validate(): boolean {
    const paymentSelected = this.paymentButtons.some(btn => btn.classList.contains('button_alt-active'));
    const addressValid = this.addressInput.value.trim() !== '';
    return paymentSelected && addressValid;
  }
}
