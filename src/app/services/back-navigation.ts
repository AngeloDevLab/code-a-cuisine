import { Location } from '@angular/common';
import { Service, inject } from '@angular/core';
import { Router } from '@angular/router';

/** Steps back through the app history, with a fallback for pages that were opened directly. */
@Service()
export class BackNavigation {
  private readonly location = inject(Location);
  private readonly router = inject(Router);

  /** Goes to the previous page, or to the fallback url if this page was the first one in the app. */
  back(fallbackUrl: string): void {
    const state = this.location.getState() as { navigationId?: number } | null;
    if ((state?.navigationId ?? 1) > 1) {
      this.location.back();
    } else {
      this.router.navigateByUrl(fallbackUrl);
    }
  }
}
