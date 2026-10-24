import { IProduct } from '../../../types/index';
import { EventEmitter } from '../Events';

export class Basket {
  private _items: IProduct[] = [];
  private events: EventEmitter;

  constructor(events: EventEmitter) {
    this.events = events;
  }

  addItem(item: IProduct): void {
    if (!this._items.includes(item)) {
      this._items.push(item);
      this.events.emit('basket:changed', this._items);
    }
  }

  removeItem(item: IProduct): void {
    const index = this._items.indexOf(item);
    if (index !== -1) {
      this._items.splice(index, 1);
      this.events.emit('basket:changed', this._items);
    }
  }

  hasItem(id: string): boolean {
    return this._items.some(item => item.id === id);
  }

  getItems(): IProduct[] {
    return this._items;
  }

  getCount(): number {
    return this._items.length;
  }

  getTotal(): number {
    return this._items.reduce((total, item) => total + (item.price ?? 0), 0);
  }

  clear(): void {
    this._items = [];
    this.events.emit('basket:changed', this._items);
  }
}
