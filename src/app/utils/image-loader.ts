import { ImageLoaderConfig } from '@angular/common';

const VARIANT_WIDTHS = [480, 640];

/**
 * Returns the smaller variant like `hero-1-480.webp` for responsive images, otherwise the original file.
 * @param config - The image source, requested width and loader params of NgOptimizedImage.
 * @returns The url of the image file to load.
 */
export function imageLoader(config: ImageLoaderConfig): string {
  const isVariant = config.loaderParams?.['responsive'] && VARIANT_WIDTHS.includes(config.width ?? 0);
  return isVariant ? config.src.replace(/\.webp$/, `-${config.width}.webp`) : config.src;
}
