import { Component } from '../Component';
import { IProduct } from '../../../types/index';
import { categoryMap, CDN_URL } from '../../../utils/constants';

export abstract class Card extends Component<IProduct> {
  protected categoryElement: HTMLElement | null;
  protected titleElement: HTMLElement | null;
  protected imageElement: HTMLImageElement | null;
  protected priceElement: HTMLElement | null;
  protected _id = '';

  constructor(container: HTMLElement) {
    super(container);
    this.categoryElement = container.querySelector('.card__category');
    this.titleElement = container.querySelector('.card__title, .basket__item-title');
    this.imageElement =
      container.querySelector('img.card__image') ??
      container.querySelector('.card__image img');
    this.priceElement = container.querySelector('.card__price, .basket__item-price');
  }

  set id(value: string) {
    this._id = value;
  }

  get id(): string {
    return this._id;
  }

  set category(value: string) {
    if (!this.categoryElement) return;
    this.categoryElement.textContent = value;
    this.categoryElement.className = `card__category ${categoryMap[value as keyof typeof categoryMap] || ''}`;
  }

  set title(value: string) {
    if (!this.titleElement) return;
    this.titleElement.textContent = value;
  }

  set image(src: string) {
    if (!this.imageElement) return;
    const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
    this.setImage(this.imageElement, `${CDN_URL}/${cleanSrc}`);
  }

  set price(price: number | null) {
    if (!this.priceElement) return;
    this.priceElement.textContent = price === null ? 'Бесплатно' : `${price} синапсов`;
  }
}
