/**
 * Formats a number as a currency string
 * @param amount The numeric value to format
 * @param currencyCode The ISO 4217 currency code (e.g., 'USD', 'EUR', 'VND')
 * @param locale The BCP 47 language tag (e.g., 'en-US', 'vi-VN')
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number | null | undefined,
  currencyCode: string = "USD",
  locale: string = "en-US"
): string {
  // Handle null/undefined values
  if (amount === null || amount === undefined) {
    return "";
  }

  // Vietnamese Dong typically doesn't use decimal places
  const fractionDigits = currencyCode === "VND" ? 0 : 2;

  // Use Intl.NumberFormat for proper currency formatting
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
}
