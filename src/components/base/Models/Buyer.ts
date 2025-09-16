import { IBuyer, TPayment } from '../../../types/index'; // Импорт интерфейса IBuyer и типа TPayment

// Класс Buyer отвечает за хранение и управление данными о покупателе
export class Buyer {
    private _payment: TPayment | null; // Способ оплаты
    private _email: string; // Email покупателя
    private _phone: string; // Телефон покупателя
    private _address: string; // Адрес доставки

    // Конструктор инициализирует пустые поля для данных покупателя
    constructor() {
        this._payment = null;
        this._email = '';
        this._phone = '';
        this._address = '';
    }

    // Сохраняет способ оплаты в поле _payment
    setPayment(payment: TPayment): void {
        this._payment = payment;
    }

    // Возвращает способ оплаты из поля _payment
    getPayment(): TPayment | null {
        return this._payment;
    }

    // Сохраняет email в поле _email
    setEmail(email: string): void {
        this._email = email;
    }

    // Возвращает email из поля _email
    getEmail(): string {
        return this._email;
    }

    // Сохраняет телефон в поле _phone
    setPhone(phone: string): void {
        this._phone = phone;
    }

    // Возвращает телефон из поля _phone
    getPhone(): string {
        return this._phone;
    }

    // Сохраняет адрес в поле _address
    setAddress(address: string): void {
        this._address = address;
    }

    // Возвращает адрес из поля _address
    getAddress(): string {
        return this._address;
    }

    // Возвращает объект с данными покупателя в формате IBuyer
    getBuyerData(): IBuyer {
        if (!this._payment) {
            throw new Error('Payment method is not set');
        }
        return {
            payment: this._payment,
            email: this._email,
            phone: this._phone,
            address: this._address
        };
    }

    // Очищает все поля данных покупателя
    clear(): void {
        this._payment = null;
        this._email = '';
        this._phone = '';
        this._address = '';
    }

    // Проверяет корректность данных покупателя
    validate(): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/; // Простой regex для российского телефона
        return (
            this._payment !== null &&
            emailRegex.test(this._email) &&
            phoneRegex.test(this._phone) &&
            this._address.trim() !== ''
        );
    }
}
