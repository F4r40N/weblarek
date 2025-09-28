import { IProduct } from '../../../types/index';
import { EventEmitter } from '../Events';

export class Basket {
  private _items: IProduct[] = [];
  private events: EventEmitter;

  constructor(events: EventEmitter) {
    this.events = events;
  }

  getItems(): IProduct[] {
    return this._items;
  }

  addItem(item: IProduct): void {
    this._items.push(item);
    this.events.emit('basket:changed', this._items);
  }

  removeItem(item: IProduct): void {
    this._items = this._items.filter(product => product.id !== item.id);
    this.events.emit('basket:changed', this._items);
  }

  clear(): void {
    this._items = [];
    this.events.emit('basket:changed', this._items);
  }

  getTotal(): number {
    return this._items.reduce((total, item) => total + (item.price || 0), 0);
  }

  getCount(): number {
    return this._items.length;
  }

  hasItem(id: string): boolean {
    return this._items.some(product => product.id === id);
  }
}
