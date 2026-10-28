import { CuisineBanner } from '../models/cuisine-banner';
import { Cuisine } from '../models/preferences';

/** Display sizes of the cuisine banners, the files are twice as large. */
export const CUISINE_BANNERS: Record<Cuisine, CuisineBanner> = {
  italian: { desktop: { width: 1146, height: 144 }, mobile: { width: 340, height: 94 } },
  german: { desktop: { width: 1143, height: 151 }, mobile: { width: 341, height: 91 } },
  japanese: { desktop: { width: 1143, height: 156 }, mobile: { width: 340, height: 90 } },
  gourmet: { desktop: { width: 1143, height: 165 }, mobile: { width: 341, height: 90 } },
  indian: { desktop: { width: 1143, height: 132 }, mobile: { width: 340, height: 91 } },
  fusion: { desktop: { width: 1143, height: 132 }, mobile: { width: 340, height: 91 } },
};
