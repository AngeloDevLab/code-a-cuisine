import { Component, input } from '@angular/core';

/** Decorated section heading: a banner image with the title on top. */
@Component({
  selector: 'app-section-banner',
  styleUrl: './section-banner.scss',
  host: { '[class]': "'section-banner--' + variant()" },
  template: `<h2 class="section-banner__title">{{ heading() }}</h2>`,
})
export class SectionBanner {
  readonly heading = input.required<string>();
  readonly variant = input.required<'ingredients' | 'directions'>();
}
