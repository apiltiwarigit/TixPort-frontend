declare module 'braintree-web-drop-in' {
  export interface DropinOptions {
    authorization: string
    container: HTMLElement | string
    threeDSecure?: boolean
    card?: {
      overrides?: {
        fields?: {
          number?: { placeholder?: string }
          cvv?: { placeholder?: string }
          expirationDate?: { placeholder?: string }
        }
      }
    }
  }

  export interface PaymentMethodRequestResult {
    nonce: string
    type: string
    details: {
      lastTwo?: string
      cardType?: string
    }
  }

  export interface DropinInstance {
    requestPaymentMethod(): Promise<PaymentMethodRequestResult>
    teardown(): Promise<void>
  }

  const dropin: {
    create(options: DropinOptions): Promise<DropinInstance>
  }

  export default dropin
}

declare module 'braintree-web' {
  // Add basic Braintree web types if needed in the future
  export = {}
}
