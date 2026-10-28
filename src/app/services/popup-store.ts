import { Service, signal } from '@angular/core';
import { PopupMessage } from '../models/popup';

/** Holds the message of the shared popup; null means the popup is closed. */
@Service()
export class PopupStore {
  readonly message = signal<PopupMessage | null>(null);

  /** Opens the popup with the given message. */
  show(message: PopupMessage): void {
    this.message.set(message);
  }

  /** Closes the popup. */
  close(): void {
    this.message.set(null);
  }
}
