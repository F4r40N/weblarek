import { Component } from '../Component';
import { IGalleryData } from '../../../types/index';
import { EventEmitter } from '../Events';

export class Gallery extends Component<IGalleryData> {
  constructor(container: HTMLElement, private events: EventEmitter) {
    super(container);
  }

  render(data?: Partial<IGalleryData>): HTMLElement {
    if (data?.items) {
      this.renderItems(data.items);
    }
    return this.container;
  }

  renderItems(items: HTMLElement[]): void {
    this.container.replaceChildren(...items);
  }

  clear(): void {
    this.container.replaceChildren();
  }
}
