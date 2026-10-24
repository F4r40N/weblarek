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
import { IProduct } from './types/index';

document.addEventListener('DOMContentLoaded', () => {
  const events = new EventEmitter();

  const catalog = new Catalog(events);
  const basket = new Basket(events);
  const buyer = new Buyer(events);

  const api = new Api(API_URL);
  const webApi = new WebLarekApi(api);

  const header = new Header(document.querySelector('.header') as HTMLElement, events);
  const gallery = new Gallery(document.querySelector('.gallery') as HTMLElement, events);
  const modal = new Modal(document.querySelector('.modal__container') as HTMLElement, events);

  const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
  const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
  const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
  const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

  const orderForm = new OrderForm(
    orderTemplate.content.querySelector('form')!.cloneNode(true) as HTMLElement,
    events
  );
  const contactsForm = new ContactsForm(
    contactsTemplate.content.querySelector('form')!.cloneNode(true) as HTMLElement,
    events
  );

  const basketView = new BasketView(
    basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement,
    events
  );
  const successView = new Success(
    successTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement,
    events
  );

  function createCardCatalog(product: IProduct): HTMLElement {
    const template = document.querySelector('#card-catalog') as HTMLTemplateElement;
    const clone = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    return new CardCatalog(clone, events).render(product);
  }

  function createCardPreview(product: IProduct): CardPreview {
    const template = document.querySelector('#card-preview') as HTMLTemplateElement;
    const clone = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const cardPreview = new CardPreview(clone, events);
    cardPreview.render({
      ...product,
      inBasket: basket.hasItem(product.id),
    });
    return cardPreview;
  }

  function createCardBasket(product: IProduct, index: number): HTMLElement {
    const template = document.querySelector('#card-basket') as HTMLTemplateElement;
    const clone = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const cardBasket = new CardBasket(clone, events);
    cardBasket.render(product);
    cardBasket.setIndex(index + 1);
    return clone;
  }

  let modalIsBasketOpen = false;
  let modalIsPreviewOpen = false;
  let currentPreviewCard: CardPreview | null = null;

  function syncOrderForm() {
    const errors = buyer.validateOrder();
    orderForm.setErrors(errors);
    orderForm.setSubmitEnabled(Object.keys(errors).length === 0);
  }

  function syncContactsForm() {
    const errors = buyer.validateContacts();
    contactsForm.setErrors(errors);
    contactsForm.setSubmitEnabled(Object.keys(errors).length === 0);
  }

  events.on('catalog:itemsChanged', () => {
    const items = catalog.getItems();
    gallery.render({ items: items.map(createCardCatalog) });
  });

  events.on<IProduct>('catalog:previewChanged', (item) => {
    modalIsPreviewOpen = true;
    currentPreviewCard = createCardPreview(item);
    modal.setContent(
      currentPreviewCard.render({
        ...item,
        inBasket: basket.hasItem(item.id),
      })
    );
    modal.open();
  });

  events.on('basket:changed', () => {
    const items = basket.getItems();
    const cards = items.map((item, idx) => createCardBasket(item, idx));
    if (modalIsBasketOpen) {
      modal.setContent(basketView.render({ items: cards, total: basket.getTotal() }));
    }
    header.setCount(basket.getCount());
    if (modalIsPreviewOpen && currentPreviewCard) {
      const preview = catalog.getPreview();
      if (preview) {
        currentPreviewCard.render({
          ...preview,
          inBasket: basket.hasItem(preview.id),
        });
      }
    }
  });

  events.on<{ id: string }>('card:catalog:select', (data) => {
    const item = catalog.getItem(data.id);
    if (item) {
      catalog.setPreview(item);
    }
  });

  events.on<{ id: string }>('card:preview:add', (data) => {
    const item = catalog.getItem(data.id);
    if (!item || item.price === null) return;

    if (basket.hasItem(data.id)) {
      basket.removeItem(item);
    } else {
      basket.addItem(item);
    }
    modal.close();
    modalIsPreviewOpen = false;
    currentPreviewCard = null;
  });

  events.on<{ id: string }>('card:basket:remove', (data) => {
    const item = basket.getItems().find((p) => p.id === data.id);
    if (item) {
      basket.removeItem(item);
    }
  });

  events.on('basket:open', () => {
    modal.close();
    modalIsBasketOpen = true;
    modalIsPreviewOpen = false;

    const items = basket.getItems();
    const cards = items.map((item, idx) => createCardBasket(item, idx));
    modal.setContent(basketView.render({ items: cards, total: basket.getTotal() }));
    modal.open();
  });

  events.on('basket:order', () => {
    modal.close();
    modalIsBasketOpen = false;
    modalIsPreviewOpen = false;

    orderForm.render({
      payment: buyer.getPayment() ?? undefined,
      address: buyer.getAddress(),
    });
    syncOrderForm();
    modal.setContent(orderForm.render());
    modal.open();
  });

  events.on<{ payment?: string; address?: string }>('form:order:change', (data) => {
    if (data.payment) buyer.setPayment(data.payment as 'card' | 'cash');
    if (data.address !== undefined) buyer.setAddress(data.address);
    syncOrderForm();
  });

  orderForm.onSubmit((e) => {
    e.preventDefault();
    const errors = buyer.validateOrder();
    if (Object.keys(errors).length > 0) {
      orderForm.setErrors(errors);
      orderForm.setSubmitEnabled(false);
      return;
    }
    modal.close();
    modalIsBasketOpen = false;
    modalIsPreviewOpen = false;

    contactsForm.render({ email: buyer.getEmail(), phone: buyer.getPhone() });
    syncContactsForm();
    modal.setContent(contactsForm.render());
    modal.open();
  });

  events.on<{ email?: string; phone?: string }>('form:contacts:change', (data) => {
    if (data.email !== undefined) buyer.setEmail(data.email);
    if (data.phone !== undefined) buyer.setPhone(data.phone);
    syncContactsForm();
  });

  contactsForm.onSubmit((e) => {
    e.preventDefault();
    const errors = buyer.validateContacts();
    if (Object.keys(errors).length > 0) {
      contactsForm.setErrors(errors);
      contactsForm.setSubmitEnabled(false);
      return;
    }
    const total = basket.getTotal();
    const orderData = {
      buyer: buyer.getBuyerData(),
      products: basket.getItems(),
    };
    webApi.sendOrder(orderData)
      .then(() => {
        basket.clear();
        buyer.clear();
        modal.close();
        modalIsBasketOpen = false;
        modalIsPreviewOpen = false;
        modal.setContent(successView.render({ total }));
        modal.open();
      })
      .catch((error) => {
        console.error('Order failed:', error);
        contactsForm.setErrors('Ошибка при оформлении заказа');
      });
  });

  events.on('modal:close', () => {
    modal.close();
    modalIsBasketOpen = false;
    modalIsPreviewOpen = false;
  });

  webApi.getProducts()
    .then((products) => {
      catalog.setItems(products);
    })
    .catch((error) => {
      console.error('Failed to load products:', error);
    });
});
