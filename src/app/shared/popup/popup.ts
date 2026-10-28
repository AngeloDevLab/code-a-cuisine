import { Component, ElementRef, afterRenderEffect, inject, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PopupStore } from '../../services/popup-store';
import { Button } from '../button/button';

/** Shared modal popup for messages, shown on top of every page while the store holds a message. */
@Component({
  imports: [Button, RouterLink],
  selector: 'app-popup',
  styleUrl: './popup.scss',
  templateUrl: './popup.html',
})
export class Popup {
  protected readonly store = inject(PopupStore);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  /** Opens or closes the native dialog whenever the message changes. */
  constructor() {
    afterRenderEffect(() => {
      const dialog = this.dialog().nativeElement;
      const hasMessage = this.store.message() !== null;
      if (hasMessage && !dialog.open) {
        dialog.showModal();
      } else if (!hasMessage && dialog.open) {
        dialog.close();
      }
    });
  }

  /**
   * Closes the popup when the click landed on the backdrop instead of the content.
   * @param event - The click event on the dialog.
   */
  protected closeOnBackdrop(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) {
      this.store.close();
    }
  }
}
