import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

type PageItem = number | 'gap';

/** Page navigation that switches the page query param of the current route. */
@Component({
  imports: [RouterLink],
  selector: 'app-pagination',
  styleUrl: './pagination.scss',
  templateUrl: './pagination.html',
})
export class Pagination {
  readonly page = input.required<number>();
  readonly pageCount = input.required<number>();

  protected readonly items = computed(() => visiblePages(this.page(), this.pageCount()));

  /** Returns the query params for a page, page 1 keeps the url clean. */
  protected paramsFor(page: number): { page: number | null } {
    return { page: page === 1 ? null : page };
  }
}

/** Lists the first, last and neighbouring page numbers, with gaps for skipped ranges. */
function visiblePages(page: number, count: number): PageItem[] {
  const candidates = [1, count, page - 1, page, page + 1, page <= 2 ? 3 : 0, page >= count - 1 ? count - 2 : 0];
  const pages = [...new Set(candidates)].filter((n) => n >= 1 && n <= count).sort((a, b) => a - b);
  return pages.flatMap((n, index): PageItem[] => {
    const distance = n - (pages[index - 1] ?? n);
    if (distance === 2) {
      return [n - 1, n];
    }
    return distance > 2 ? ['gap', n] : [n];
  });
}
