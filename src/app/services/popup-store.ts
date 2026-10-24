import { Service, signal } from '@angular/core';

export interface PopupAction {
  label: string;
  link: string;
}

// Title lines break on mobile and run as one line on desktop.
export interface PopupMessage {
  title: string[];
  text: string;
  action?: PopupAction;
}

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
