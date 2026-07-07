/** True when Stripe donation checkout can be started (payment link or secret + price). */
export function isDonationsConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_DONATION_PAYMENT_LINK ||
      (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_DONATION_PRICE_ID),
  )
}
