import { IProduct } from '../../../types/index'; // Импорт интерфейса IProduct

// Класс Catalog отвечает за хранение и управление данными о товарах в каталоге
export class Catalog {
    private _items: IProduct[]; // Массив всех товаров в каталоге
    private _preview: IProduct | null; // Текущий товар для подробного отображения

    // Конструктор инициализирует пустые массивы для хранения данных
    constructor() {
        this._items = [];
        this._preview = null;
    }

    // Сохраняет массив товаров в поле _items
    setItems(items: IProduct[]): void {
        this._items = items;
    }

    // Возвращает массив всех товаров из поля _items
    getItems(): IProduct[] {
        return this._items;
    }

    // Возвращает товар по идентификатору или undefined, если не найден
    getItem(id: string): IProduct | undefined {
        return this._items.find(item => item.id === id);
    }

    // Сохраняет товар для подробного отображения в поле _preview
    setPreview(item: IProduct): void {
        this._preview = item;
    }

    // Возвращает текущий товар для подробного отображения или null
    getPreview(): IProduct | null {
        return this._preview;
    }
}
