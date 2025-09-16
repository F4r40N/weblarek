import { IProduct } from '../../../types/index'; // Импорт интерфейса IProduct

// Класс Basket отвечает за хранение и управление данными о товарах в корзине покупателя
export class Basket {
    private _items: IProduct[]; // Массив товаров в корзине

    // Конструктор инициализирует пустой массив для хранения товаров в корзине
    constructor() {
        this._items = [];
    }

    // Возвращает массив товаров в корзине
    getItems(): IProduct[] {
        return this._items;
    }

    // Добавляет товар в массив _items
    addItem(item: IProduct): void {
        this._items.push(item);
    }

    // Удаляет товар из массива _items
    removeItem(item: IProduct): void {
        const index = this._items.indexOf(item);
        if (index > -1) {
            this._items.splice(index, 1);
        }
    }

    // Очищает массив _items
    clear(): void {
        this._items = [];
    }

    // Рассчитывает и возвращает общую стоимость товаров в корзине
    getTotal(): number {
        return this._items.reduce((total, item) => total + (item.price || 0), 0);
    }

    // Возвращает количество товаров в корзине
    getCount(): number {
        return this._items.length;
    }

    // Проверяет наличие товара по идентификатору
    hasItem(id: string): boolean {
        return this._items.some(item => item.id === id);
    }
}
