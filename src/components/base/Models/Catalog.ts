import { IProduct } from '../../../types/index';
import { EventEmitter } from '../Events';

export class Catalog {
  private _items: IProduct[];
  private _preview: IProduct | null;
  private events: EventEmitter;

  constructor(events: EventEmitter) {
    this._items = [];
    this._preview = null;
    this.events = events;
  }

  setItems(items: IProduct[]): void {
    this._items = items;
    this.events.emit('catalog:itemsChanged', this._items);
  }

  getItems(): IProduct[] {
    return this._items;
  }

  getItem(id: string): IProduct | undefined {
    return this._items.find(item => item.id === id);
  }

  setPreview(item: IProduct): void {
    this._preview = item;
    this.events.emit('catalog:previewChanged', this._preview);
  }

  getPreview(): IProduct | null {
    return this._preview;
  }
}
