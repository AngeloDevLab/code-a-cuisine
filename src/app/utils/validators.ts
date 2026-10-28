import { FieldValidator } from '@angular/forms/signals';

/**
 * Fails unless the amount is a number greater than zero.
 * @param field - The field context with the current amount.
 * @returns A min error, or undefined if the amount is valid.
 */
export const positiveAmount: FieldValidator<number | null> = ({ value }) =>
  (value() ?? 0) > 0 ? undefined : { kind: 'min' };
