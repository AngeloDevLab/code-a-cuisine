import { Component, input } from '@angular/core';
import { Logo } from '../logo/logo';
import { CookingAnimation } from './cooking-animation/cooking-animation';

/** Full page loading view with the cooking animation and a label with animated dots. */
@Component({
  imports: [CookingAnimation, Logo],
  selector: 'app-loading-screen',
  styleUrl: './loading-screen.scss',
  template: `
    <main class="loading-screen">
      <app-logo variant="creamy" />
      <div class="loading-screen__content">
        <div class="loading-screen__card">
          <app-cooking-animation class="loading-screen__animation" />
        </div>
        <h1 class="loading-screen__label" aria-live="polite">
          {{ label() }}
          <span class="loading-screen__dots" aria-hidden="true">
            <span class="loading-screen__dot">.</span><span class="loading-screen__dot">.</span><span
              class="loading-screen__dot">.</span>
          </span>
        </h1>
      </div>
    </main>
  `,
})
export class LoadingScreen {
  readonly label = input.required<string>();
}
