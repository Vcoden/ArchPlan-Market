export type PaymentProviderName = "mock" | "stripe" | "paystack" | "flutterwave";

export interface CheckoutItem {
  planId: string;
  title: string;
  architectName: string;
  price: number;
}

export interface CreateCheckoutInput {
  orderId: string;
  buyerId: string;
  buyerEmail: string;
  items: CheckoutItem[];
  amount: number;
  currency: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutSession {
  provider: PaymentProviderName;
  checkoutUrl: string;
  providerReference: string;
}

export interface PaymentResult {
  success: boolean;
  provider: PaymentProviderName;
  providerReference: string;
  amount: number;
  raw?: unknown;
}

export interface PaymentProvider {
  name: PaymentProviderName;
  createCheckout(input: CreateCheckoutInput): Promise<CheckoutSession>;
  confirmPayment(reference: string): Promise<PaymentResult>;
}
