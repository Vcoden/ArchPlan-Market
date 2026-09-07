import type { CreateCheckoutInput, PaymentProvider, PaymentResult } from "./types";

/**
 * Development payment provider.
 * Replace with Stripe, Paystack, or Flutterwave in production by
 * setting PAYMENT_PROVIDER and implementing the same interface.
 */
export const mockPaymentProvider: PaymentProvider = {
  name: "mock",
  async createCheckout(input) {
    const reference = `mock_${input.orderId}`;
    const url = new URL(input.successUrl);
    url.searchParams.set("provider", "mock");
    url.searchParams.set("reference", reference);
    url.searchParams.set("order", input.orderId);
    return {
      provider: "mock",
      checkoutUrl: url.toString(),
      providerReference: reference,
    };
  },
  async confirmPayment(reference): Promise<PaymentResult> {
    return {
      success: reference.startsWith("mock_"),
      provider: "mock",
      providerReference: reference,
      amount: 0,
    };
  },
};
