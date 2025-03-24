# Stripe Payment Integration

This module provides a basic integration with Stripe to handle one-time payments. It is designed to be independent of other modules in the project.

## Features
- Create payment intents
- Handle Stripe webhooks
- Log payment transactions
- Validate payment inputs
- Convert currencies

## Setup
1. **Install Dependencies**: Ensure all required packages are installed.
   ```bash
   npm install
   ```
2. **Environment Variables**: Set up your Stripe secret key and webhook secret in your environment variables.
   ```env
   STRIPE_SECRET_KEY=your-stripe-secret-key
   STRIPE_WEBHOOK_SECRET=your-webhook-secret
   ```

## Usage

### Creating a Payment Intent
POST `/stripe/create-payment-intent`

- **Body**:
  ```json
  {
    "amount": 1000,
    "currency": "usd",
    "targetCurrency": "eur"
  }
  ```

- **Response**:
  ```json
  {
    "clientSecret": "your-client-secret"
  }
  ```

### Webhook Handling
POST `/stripe/webhook`

- **Description**: Handles Stripe events like `payment_intent.succeeded` and `payment_intent.payment_failed`.

## Testing
Run the tests to ensure everything is working correctly.
```bash
npm test
```

## Security
- Input validation is performed using Joi.
- Ensure your Stripe keys are kept secure and not exposed in the codebase.

## Notes
- This integration is set up for one-time payments and can be extended for other payment types as needed.
- Ensure your database is configured to store transaction details.
