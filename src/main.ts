import './scss/styles.scss';

// Импорт классов моделей данных
import { Catalog } from './components/base/Models/Catalog';
import { Basket } from './components/base/Models/Basket';
import { Buyer } from './components/base/Models/Buyer';

// Импорт коммуникационного слоя
import { WebLarekApi } from './components/base/WebLarekApi';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';

// Импорт интерфейсов и тестовых данных
import { apiProducts } from './utils/data';

// Создание экземпляра модели Catalog и тестирование методов
console.log('=== Тестирование модели Catalog ===');
const catalogInstance = new Catalog();
catalogInstance.setItems(apiProducts.items);
console.log('Массив товаров из каталога:', catalogInstance.getItems());

const testItemId = '854cef69-976d-4c2a-a18c-2aa45046c390'; // ID первого товара из apiProducts
const foundItem = catalogInstance.getItem(testItemId);
console.log('Найденный товар по ID:', foundItem);

catalogInstance.setPreview(foundItem!);
console.log('Текущий товар для предварительного просмотра:', catalogInstance.getPreview());

// Создание экземпляра модели Basket и тестирование методов
console.log('=== Тестирование модели Basket ===');
const basketInstance = new Basket();
const testProduct1 = apiProducts.items[0]; // Первый товар
const testProduct2 = apiProducts.items[1]; // Второй товар

basketInstance.addItem(testProduct1);
basketInstance.addItem(testProduct2);
console.log('Товары в корзине:', basketInstance.getItems());
console.log('Общая стоимость товаров в корзине:', basketInstance.getTotal());
console.log('Количество товаров в корзине:', basketInstance.getCount());
console.log('Есть ли товар с ID в корзине:', basketInstance.hasItem(testItemId));

basketInstance.removeItem(testProduct1);
console.log('После удаления товара:', basketInstance.getItems());
console.log('Общая стоимость после удаления:', basketInstance.getTotal());

basketInstance.clear();
console.log('После очистки корзины:', basketInstance.getItems());

// Создание экземпляра модели Buyer и тестирование методов
console.log('=== Тестирование модели Buyer ===');
const buyerInstance = new Buyer();
buyerInstance.setPayment('online');
buyerInstance.setEmail('test@example.com');
buyerInstance.setPhone('+7 (123) 456-78-90');
buyerInstance.setAddress('ул. Тестовая, д. 1');

console.log('Способ оплаты:', buyerInstance.getPayment());
console.log('Email:', buyerInstance.getEmail());
console.log('Телефон:', buyerInstance.getPhone());
console.log('Адрес:', buyerInstance.getAddress());
console.log('Данные покупателя:', buyerInstance.getBuyerData());
console.log('Валидация данных покупателя:', buyerInstance.validate());

// Тестирование валидации с некорректными данными
buyerInstance.setEmail('invalid-email');
console.log('Валидация с некорректным email:', buyerInstance.validate());

buyerInstance.setEmail('test@example.com'); // Вернем корректный email
buyerInstance.setPhone('no-digits');
console.log('Валидация с телефоном без цифр:', buyerInstance.validate());

// Интеграция с сервером: получение каталога товаров
console.log('=== Интеграция с сервером: получение товаров ===');
const apiInstance = new Api(API_URL); // Создаем экземпляр Api с базовым URL
const webLarekApiInstance = new WebLarekApi(apiInstance); // Создаем экземпляр WebLarekApi

// Асинхронный запрос товаров
(async () => {
    try {
        const products = await webLarekApiInstance.getProducts(); // Запрос товаров с сервера
        catalogInstance.setItems(products); // Сохраняем в модель Catalog
        console.log('Каталог товаров из сервера:', catalogInstance.getItems()); // Выводим в консоль
    } catch (error) {
        console.error('Ошибка при получении товаров с сервера:', error);
    }
})();
