import { Component } from '../Component';
import { IProduct } from '../../../types/index';
import { categoryMap, CDN_URL } from '../../../utils/constants';

export abstract class Card extends Component<IProduct> {
  private category: HTMLSpanElement;
  private title: HTMLHeadingElement;
  private image: HTMLImageElement;
  private price: HTMLSpanElement;

  constructor(container: HTMLElement) {
    super(container);
    this.category = container.querySelector('.card__category') as HTMLSpanElement;
    this.title = container.querySelector('.card__title') as HTMLHeadingElement;
    this.image = container.querySelector('.card__image') as HTMLImageElement;
    this.price = container.querySelector('.card__price') as HTMLSpanElement;
  }

  render(data?: Partial<IProduct>): HTMLElement {
    if (data) {
      if (data.category) this.setCategory(data.category);
      if (data.title) this.setTitle(data.title);
      if (data.image) this.setImage(data.image);
      if (data.price !== undefined) this.setPrice(data.price);
    }
    return this.container;
  }

  setCategory(category: string): void {
    if (this.category) {
      this.category.textContent = category;
      this.category.className = `card__category ${categoryMap[category as keyof typeof categoryMap] || ''}`;
    }
  }

  setTitle(title: string): void {
    this.title.textContent = title;
  }

  setImage(src: string): void {
    // Убираем ведущий слэш, если есть, чтобы корректно сконкатенировать URL
    const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
    super.setImage(this.image, `${CDN_URL}/${cleanSrc}`);
  }

  setPrice(price: number | null): void {
    this.price.textContent = price === null ? 'Бесплатно' : `${price} синапсов`;
  }
}
