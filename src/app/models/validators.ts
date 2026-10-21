import { FieldValidator } from '@angular/forms/signals';

/** Fails unless the amount is a number greater than zero. */
export const positiveAmount: FieldValidator<number | null> = ({ value }) =>
  (value() ?? 0) > 0 ? undefined : { kind: 'min' };
