import { mockPaymentProvider } from "./mock";
import type { PaymentProvider, PaymentProviderName } from "./types";

function notConfigured(name: Exclude<PaymentProviderName, "mock">): PaymentProvider {
  return {
    name,
    async createCheckout() {
      throw new Error(
        `${name} is not configured yet. Set the provider credentials or use PAYMENT_PROVIDER=mock during development.`,
      );
    },
    async confirmPayment() {
      throw new Error(`${name} is not configured yet.`);
    },
  };
}

export function getPaymentProvider(): PaymentProvider {
  const name = (process.env.PAYMENT_PROVIDER ?? "mock") as PaymentProviderName;

  switch (name) {
    case "stripe":
      return notConfigured("stripe");
    case "paystack":
      return notConfigured("paystack");
    case "flutterwave":
      return notConfigured("flutterwave");
    default:
      return mockPaymentProvider;
  }
}

export type { CheckoutItem, CheckoutSession, CreateCheckoutInput, PaymentResult } from "./types";
