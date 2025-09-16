import { IApi, IProduct, IOrderData, IOrderResponse } from '../../types/index';

// Класс WebLarekApi отвечает за коммуникацию с сервером.
// Использует композицию: принимает IApi в конструктор для выполнения запросов.
export class WebLarekApi {
    private api: IApi;

    // Конструктор принимает объект, реализующий IApi (например, экземпляр Api).
    constructor(api: IApi) {
        this.api = api;
    }

    // Метод для получения товаров с сервера (GET /product/).
    // Возвращает массив товаров IProduct[].
    async getProducts(): Promise<IProduct[]> {
        const response = await this.api.get<{ items: IProduct[] }>('/product');
        return response.items; // Предполагаем, что сервер возвращает { items: IProduct[] }.
    }

    // Метод для отправки заказа на сервер (POST /order/).
    // Принимает данные заказа IOrderData и возвращает ответ IOrderResponse.
    async sendOrder(data: IOrderData): Promise<IOrderResponse> {
        return await this.api.post<IOrderResponse>('/order', data);
    }
}
