import './scss/styles.scss';

import { Catalog } from './components/base/Models/Catalog';
import { Basket } from './components/base/Models/Basket';
import { Buyer } from './components/base/Models/Buyer';

import { WebLarekApi } from './components/base/WebLarekApi';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';

import { Header } from './components/base/view/Header';
import { Gallery } from './components/base/view/Gallery';
import { Modal } from './components/base/view/Modal';
import { CardCatalog } from './components/base/view/CardCatalog';
import { CardPreview } from './components/base/view/CardPreview';
import { CardBasket } from './components/base/view/CardBasket';
import { OrderForm } from './components/base/view/OrderForm';
import { ContactsForm } from './components/base/view/ContactsForm';
import { Basket as BasketView } from './components/base/view/Basket';
import { Success } from './components/base/view/Success';

import { EventEmitter } from './components/base/Events';
import { IProduct, IBuyer } from './types/index';

// --- Создаём единый брокер событий ---
const events = new EventEmitter();

// --- Создаём модели и передаём им событийный брокер ---
const catalog = new Catalog(events);
const basket = new Basket(events);
const buyer = new Buyer(events);

// --- Создаём экземпляры API на уровне модуля ---
const api = new Api(API_URL);
const webApi = new WebLarekApi(api);

// --- Создаём View-компоненты, передаём контейнеры и событийный брокер ---
const header = new Header(document.querySelector('.header') as HTMLElement, events);
const gallery = new Gallery(document.querySelector('.gallery') as HTMLElement, events);
const modal = new Modal(document.querySelector('.modal__container') as HTMLElement, events);

const orderForm = new OrderForm(document.querySelector('template#order')!.content.querySelector('form')!.cloneNode(true) as HTMLElement, events);
const contactsForm = new ContactsForm(document.querySelector('template#contacts')!.content.querySelector('form')!.cloneNode(true) as HTMLElement, events);

const basketView = new BasketView(document.querySelector('template#basket')!.content.firstElementChild!.cloneNode(true) as HTMLElement, events);
const successView = new Success(document.querySelector('template#success')!.content.firstElementChild!.cloneNode(true) as HTMLElement, events);

// --- Вспомогательные функции ---

// Создать карточку каталога из шаблона и данных
function createCardCatalog(product: IProduct): HTMLElement {
  const template = document.querySelector('#card-catalog') as HTMLTemplateElement;
  const clone = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

  // Устанавливаем dataset для передачи данных через события
  clone.dataset.id = product.id;
  clone.dataset.title = product.title;
  clone.dataset.category = product.category;
  clone.dataset.price = product.price !== null ? product.price.toString() : '';
  clone.dataset.image = product.image;
  clone.dataset.description = product.description;

  // Создаём экземпляр CardCatalog для функционала
  new CardCatalog(clone, events).render(product);

  return clone;
}

// Создаём карточку предпросмотра
function createCardPreview(product: IProduct): CardPreview {
  const template = document.querySelector('#card-preview') as HTMLTemplateElement;
  const clone = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

  clone.dataset.id = product.id;
  clone.dataset.title = product.title;
  clone.dataset.category = product.category;
  clone.dataset.price = product.price !== null ? product.price.toString() : '';
  clone.dataset.image = product.image;
  clone.dataset.description = product.description;

  const cardPreview = new CardPreview(clone, events, basket);
  cardPreview.render(product);

  return cardPreview;
}

// Создаём карточку товара в корзине
function createCardBasket(product: IProduct, index: number): HTMLElement {
  const template = document.querySelector('#card-basket') as HTMLTemplateElement;
  const clone = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

  clone.dataset.id = product.id;
  clone.dataset.title = product.title;
  clone.dataset.category = product.category;
  clone.dataset.price = product.price !== null ? product.price.toString() : '';
  clone.dataset.description = product.description;

  const cardBasket = new CardBasket(clone, events);
  cardBasket.render(product);
  cardBasket.setIndex(index + 1);

  return clone;
}

// --- Обработчики событий ---

// 1. Обработка изменения каталога товаров
events.on<{ items: IProduct[] }>('catalog:itemsChanged', () => {
  const items = catalog.getItems();
  const cards = items.map(createCardCatalog);
  gallery.render({ items: cards });
});

// 2. Обработка изменения выбранного товара для предпросмотра
events.on<IProduct | null>('catalog:previewChanged', (item) => {
  if (!item) {
    modal.close();
    modalIsPreviewOpen = false;
    currentPreviewCard = null;
    return;
  }
  modalIsPreviewOpen = true;
  currentPreviewCard = createCardPreview(item);
  modal.setContent(currentPreviewCard.container);
  modal.open();
});

// 3. Обработка изменения корзины
events.on<IProduct[]>('basket:changed', () => {
  const items = basket.getItems();
  const cards = items.map((item, idx) => createCardBasket(item, idx));
  basketView.render({ items, total: basket.getTotal() });
  // Обновляем корзину в модальном окне, если она открыта
  if (modalIsBasketOpen) {
    modal.setContent(basketView.render({ items: cards, total: basket.getTotal() }));
  }
  // Обновляем счетчик в хедере
  header.setCount(basket.getCount());
});

// 4. Обработка изменения данных покупателя (можно обновлять формы, если нужно)
events.on<IBuyer>('buyer:changed', () => {
  // Можно реализовать обновление форм, если требуется
});

// --- Флаги для состояния модального окна ---
let modalIsBasketOpen = false;
let modalIsOrderOpen = false;
let modalIsSuccessOpen = false;
let modalIsPreviewOpen = false;
let currentPreviewCard: CardPreview | null = null;

// --- Обработка событий из View ---

// Выбор товара из каталога (открыть предпросмотр)
events.on<{ id: string }>('card:catalog:select', (data) => {
  const item = catalog.getItem(data.id);
  if (item) {
    catalog.setPreview(item);
  }
});

// Добавление товара в корзину из предпросмотра
events.on<{ id: string }>('card:preview:add', (data) => {
  const item = catalog.getItem(data.id);
  if (item) {
    if (item.price !== null) { // Проверка на бесплатный товар
      if (basket.hasItem(data.id)) {
        basket.removeItem(item);
      } else {
        basket.addItem(item);
      }
      // Обновляем CardPreview сразу после изменения корзины, если модальное окно открыто
      if (modalIsPreviewOpen && currentPreviewCard) {
        currentPreviewCard.render(catalog.getPreview());
      }
    }
  }
});

// Удаление товара из корзины
events.on<{ id: string }>('card:basket:remove', (data) => {
  const item = basket.getItems().find(p => p.id === data.id);
  if (item) {
    basket.removeItem(item);
  }
});

// Открытие корзины
events.on('basket:open', () => {
  modal.close(); // Закрываем предыдущее модальное окно перед открытием нового
  modalIsBasketOpen = true;
  modalIsOrderOpen = false;
  modalIsSuccessOpen = false;
  modalIsPreviewOpen = false;

  const items = basket.getItems();
  const cards = items.map((item, idx) => createCardBasket(item, idx));
  // Вызываем render один раз и сохраняем результат в переменную
  const basketElement = basketView.render({ items: cards, total: basket.getTotal() });
  modal.setContent(basketElement);
  modal.open();
});

// Оформление заказа (переход к форме заказа)
events.on('basket:order', () => {
  modal.close(); // Закрываем предыдущее модальное окно перед открытием нового
  modalIsBasketOpen = false;
  modalIsOrderOpen = true;
  modalIsSuccessOpen = false;
  modalIsPreviewOpen = false;

  orderForm.render({ payment: buyer.getPayment() ?? undefined, address: buyer.getAddress() });
  modal.setContent(orderForm.render());
  modal.open();
});

// Обработка изменений в форме заказа
events.on<{ payment?: string; address?: string }>('form:order:change', (data) => {
  if (data.payment) buyer.setPayment(data.payment as 'card' | 'cash');
  if (data.address !== undefined) buyer.setAddress(data.address);
  checkOrderFormValidity();
});

// Обработка отправки формы заказа (переход к контактам)
orderForm.container.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!orderForm.validate() || buyer.getPayment() === null) {
    orderForm.setErrors('Заполните все поля корректно, включая способ оплаты');
    return;
  }
  modal.close();
  modalIsOrderOpen = false;
  modalIsSuccessOpen = false;
  modalIsBasketOpen = false;
  modalIsPreviewOpen = false;

  contactsForm.render({ email: buyer.getEmail(), phone: buyer.getPhone() });
  modal.setContent(contactsForm.render());
  modal.open();
});

// Обработка изменений в форме контактов
events.on<{ email?: string; phone?: string }>('form:contacts:change', (data) => {
  if (data.email !== undefined) buyer.setEmail(data.email);
  if (data.phone !== undefined) buyer.setPhone(data.phone);
  checkContactsFormValidity();
});

// Обработка отправки формы контактов (завершение заказа)
contactsForm.container.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!contactsForm.validate() || buyer.getPayment() === null) {
    contactsForm.setErrors('Заполните все поля корректно, включая способ оплаты');
    return;
  }
  const total = basket.getTotal(); // Сохраняем сумму перед очисткой
  const orderData = { 
    ...buyer.getBuyerData(), 
    items: basket.getItems().map(item => item.id), // Массив ID товаров
    total // Добавляем сумму
  };
  webApi.sendOrder(orderData)
    .then(() => {
      // Успех: очистка корзины, показ успеха
      basket.clear();
      modal.close();
      modalIsOrderOpen = false;
      modalIsSuccessOpen = true;
      modalIsBasketOpen = false;
      modalIsPreviewOpen = false;
      successView.render({ total }); // Используем сохранённую сумму
      modal.setContent(successView.render());
      modal.open();
    })
    .catch((error) => {
      console.error('Order failed:', error);
      contactsForm.setErrors('Ошибка при оформлении заказа');
    });
});

// Закрытие модального окна
events.on('modal:close', () => {
  modal.close();
  modalIsBasketOpen = false;
  modalIsOrderOpen = false;
  modalIsSuccessOpen = false;
  modalIsPreviewOpen = false;
  catalog.setPreview(null); // Сброс предпросмотра
});

// Закрытие окна успеха
events.on('success:close', () => {
  modal.close();
  modalIsSuccessOpen = false;
});

// --- Вспомогательные функции проверки валидности форм ---

function checkOrderFormValidity() {
  const valid = buyer.getPayment() !== null && buyer.getAddress().trim() !== '';
  orderForm.setSubmitEnabled(valid);
}

function checkContactsFormValidity() {
  const valid = buyer.validateContacts() && basket.getCount() > 0 && buyer.getPayment() !== null;  // Проверка оплаты
  contactsForm.setSubmitEnabled(valid);
}

// --- Запрос товаров с сервера и инициализация каталога ---
(async () => {
  try {
    const products = await webApi.getProducts();
    catalog.setItems(products);
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error);
  }
})();
