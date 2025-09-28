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
    this.events.emit('buyer:changed', this.getBuyerData());
  }

  getPayment(): TPayment | null {
    return this._payment;
  }

  setEmail(email: string): void {
    this._email = email;
    if (this._payment !== null) {
      this.events.emit('buyer:changed', this.getBuyerData());
    }
  }

  getEmail(): string {
    return this._email;
  }

  setPhone(phone: string): void {
    this._phone = phone;
    if (this._payment !== null) {
      this.events.emit('buyer:changed', this.getBuyerData());
    }
  }

  getPhone(): string {
    return this._phone;
  }

  setAddress(address: string): void {
    this._address = address;
    if (this._payment !== null) {
      this.events.emit('buyer:changed', this.getBuyerData());
    }
  }

  getAddress(): string {
    return this._address;
  }

  getBuyerData(): IBuyer {
    if (this._payment === null) {
      throw new Error('Не указан способ оплаты');
    }
    return {
      payment: this._payment,
      email: this._email,
      phone: this._phone,
      address: this._address
    };
  }

  validate(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanPhone = this._phone.replace(/[\s-]/g, '');
    const phoneRegex = /^\+7\d{10}$/;
    return (
      this._payment !== null &&
      emailRegex.test(this._email) &&
      phoneRegex.test(cleanPhone) &&
      this._address.trim() !== ''
    );
  }

  validateContacts(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanPhone = this._phone.replace(/[\s-]/g, '');
    const phoneRegex = /^\+7\d{10}$/;
    return emailRegex.test(this._email) && phoneRegex.test(cleanPhone);
  }

  clear(): void {
    this._payment = null;
    this._email = '';
    this._phone = '';
    this._address = '';
    // Не emit'им после clear
  }
}
