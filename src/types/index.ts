export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'online' | 'cash';

export interface IProduct {
    id: string; // Уникальный идентификатор товара
    description: string; // Описание товара
    image: string; // Ссылка на изображение товара
    title: string; // Название товара
    category: string; // Категория товара
    price: number | null; // Цена товара (может быть null, если товар бесплатный)
}

export interface IBuyer {
    payment: TPayment; // Способ оплаты
    email: string; // Email покупателя
    phone: string; // Телефон покупателя
    address: string; // Адрес доставки
}

// Новый интерфейс для отправки заказа (собирает данные из существующих типов)
export interface IOrderData {
    buyer: IBuyer;       // Данные покупателя
    products: IProduct[]; // Массив заказанных товаров
}

// Интерфейс ответа сервера при оформлении заказа
export interface IOrderResponse {
    orderId: string;     // Идентификатор созданного заказа
    status: string;      // Статус ответа, например "success"
}
