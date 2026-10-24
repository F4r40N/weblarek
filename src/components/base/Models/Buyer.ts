import { IBuyer, TPayment } from '../../../types/index';
import { EventEmitter } from '../Events';

export class Buyer {
  private _payment: TPayment | null;
  private _email: string;
  private _phone: string;
  private _address: string;
  private events: EventEmitter;

  constructor(events: EventEmitter) {
    this._payment = null;
    this._email = '';
    this._phone = '';
    this._address = '';
    this.events = events;
  }

  setPayment(payment: TPayment): void {
    this._payment = payment;
    this.events.emit('buyer:changed', {});
  }

  getPayment(): TPayment | null {
    return this._payment;
  }

  setEmail(email: string): void {
    this._email = email;
    this.events.emit('buyer:changed', {});
  }

  getEmail(): string {
    return this._email;
  }

  setPhone(phone: string): void {
    this._phone = phone;
    this.events.emit('buyer:changed', {});
  }

  getPhone(): string {
    return this._phone;
  }

  setAddress(address: string): void {
    this._address = address;
    this.events.emit('buyer:changed', {});
  }

  getAddress(): string {
    return this._address;
  }

  getBuyerData(): IBuyer {
    return {
      payment: this._payment,
      email: this._email,
      phone: this._phone,
      address: this._address
    };
  }

  /** Ошибки шага 1: способ оплаты и адрес. */
  validateOrder(): Record<string, string> {
    const errors: Record<string, string> = {};
    if (this._payment === null) {
      errors.payment = 'Необходимо указать способ оплаты';
    }
    if (this._address.trim() === '') {
      errors.address = 'Необходимо указать адрес';
    }
    return errors;
  }

  /** Ошибки шага 2: email и телефон. */
  validateContacts(): Record<string, string> {
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanPhone = this._phone.replace(/[\s-]/g, '');
    const phoneRegex = /^\+7\d{10}$/;

    if (this._email.trim() === '' || !emailRegex.test(this._email)) {
      errors.email = 'Необходимо указать email';
    }
    if (this._phone.trim() === '' || !phoneRegex.test(cleanPhone)) {
      errors.phone = 'Необходимо указать телефон';
    }
    return errors;
  }

  /** Полная проверка всех полей (для совместимости / финальной сборки). */
  validate(): Record<string, string> {
    return { ...this.validateOrder(), ...this.validateContacts() };
  }

  clear(): void {
    this._payment = null;
    this._email = '';
    this._phone = '';
    this._address = '';
  }
}
