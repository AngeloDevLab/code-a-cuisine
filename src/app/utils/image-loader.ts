import { ImageLoaderConfig } from '@angular/common';

const VARIANT_WIDTHS = [480, 640];

/** Returns the smaller variant like `hero-1-480.webp` for responsive images, otherwise the original file. */
export function imageLoader(config: ImageLoaderConfig): string {
  const isVariant = config.loaderParams?.['responsive'] && VARIANT_WIDTHS.includes(config.width ?? 0);
  return isVariant ? config.src.replace(/\.webp$/, `-${config.width}.webp`) : config.src;
}
