import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Links to the imprint and the privacy policy at the bottom of a page. */
@Component({
  imports: [RouterLink],
  selector: 'app-legal-links',
  styleUrl: './legal-links.scss',
  template: `
    <nav class="legal-links" aria-label="Legal">
      <a class="legal-links__link" routerLink="/imprint">Imprint</a>
      <a class="legal-links__link" routerLink="/privacy">Privacy policy</a>
    </nav>
  `,
})
export class LegalLinks {}
