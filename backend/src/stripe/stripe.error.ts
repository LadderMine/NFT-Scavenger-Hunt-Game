export class StripeError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'StripeError';
  }
}

export const StripeErrorCodes = {
  PAYMENT_INTENT_CREATION_FAILED: 'PAYMENT_INTENT_CREATION_FAILED',
  WEBHOOK_HANDLING_FAILED: 'WEBHOOK_HANDLING_FAILED',
};
