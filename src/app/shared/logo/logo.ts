import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** App logo that links back to the landing page. */
@Component({
  imports: [NgOptimizedImage, RouterLink],
  selector: 'app-logo',
  styleUrl: './logo.scss',
  template: `
    <a class="logo" routerLink="/">
      <img class="logo__image" [ngSrc]="'icons/logo-' + variant() + '.svg'" alt="Code à Cuisine home"
        width="142" height="48" priority />
    </a>
  `,
})
export class Logo {
  readonly variant = input<'creamy' | 'dark-green'>('dark-green');
}
