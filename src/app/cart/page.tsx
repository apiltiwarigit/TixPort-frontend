'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PageContainer } from '@/components/layout';
import { Card, CardContent } from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { EmptyCart } from '@/components/ui';
import { useCart } from '@/contexts/CartContext';
import BraintreeProvider from '@/components/BraintreeProvider';
import CartCheckoutFormV9 from '@/components/CartCheckoutFormV9';
import {
  ShoppingCartIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  TruckIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function CartPage() {
  const router = useRouter();
  const { items, summary, updateQuantity, removeItem, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [currentStep, setCurrentStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [orderData, setOrderData] = useState<Record<string, unknown> | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Calculate totals with promo code
  const finalDiscount = promoCode === 'TIXPORT10' ? summary.subtotal * 0.1 : discount;
  const finalTotal = summary.subtotal + summary.serviceFee + summary.deliveryFee - finalDiscount;

  const handlePromoCode = () => {
    if (promoCode === 'TIXPORT10') {
      setDiscount(summary.subtotal * 0.1);
    } else {
      setDiscount(0);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    setCurrentStep('checkout');
  };

  const handleCheckoutSuccess = (orderResult: unknown) => {
    setOrderData(orderResult as Record<string, unknown>);
    clearCart(); // Clear cart after successful checkout
    setCurrentStep('success');
  };

  const handleCheckoutError = (error: string) => {
    setCheckoutError(error);
  };

  const handleBackToCart = () => {
    setCurrentStep('cart');
    setCheckoutError(null);
  };

  // Convert cart items to checkout data format
  const getCheckoutData = () => {
    if (items.length === 0) return null;
    
    return {
      items: items.map(item => ({
        ticketGroupId: item.ticketGroupId,
        eventId: item.eventId,
        eventTitle: item.eventTitle,
        eventDate: item.eventDate,
        venue: item.venue,
        section: item.section,
        row: item.row,
        quantity: item.quantity,
        pricePerTicket: item.pricePerTicket,
        totalPrice: item.totalPrice,
        format: item.format
      })),
      summary: {
        subtotal: summary.subtotal,
        serviceFee: summary.serviceFee,
        deliveryFee: summary.deliveryFee,
        discount: finalDiscount,
        total: finalTotal
      }
    };
  };

  // Success Step
  if (currentStep === 'success' && orderData) {
    return (
      <PageContainer showSidebar={true}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-8">
            <CheckCircleIcon className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-4">Order Confirmed!</h1>
            <p className="text-gray-300 mb-6">
              Your tickets have been successfully purchased.
            </p>
            
            <div className="bg-gray-700/30 rounded-lg p-4 mb-6">
              <div className="text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Order ID:</span>
                  <span className="text-white font-mono">{orderData.orderId as string}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-green-400 font-semibold">${(orderData.total as number)?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-blue-400 capitalize">{orderData.status as string}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-400">
                You will receive a confirmation email with your ticket details shortly.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/" className="btn-primary">
                  <Button variant="primary">Return Home</Button>
                </Link>
                <Link href="/profile/orders" className="btn-secondary">
                  <Button variant="secondary">View My Orders</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  // Checkout Step
  if (currentStep === 'checkout') {
    const checkoutData = getCheckoutData();
    if (!checkoutData) {
      setCurrentStep('cart');
      return null;
    }

    return (
      <PageContainer showSidebar={true}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button
              onClick={handleBackToCart}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back to Cart</span>
            </button>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Complete Your Purchase</h1>
            
            {checkoutError && (
              <div className="mb-6 bg-red-900/20 border border-red-800 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                  <div className="text-red-300">{checkoutError}</div>
                </div>
              </div>
            )}
            
            <BraintreeProvider>
              <CartCheckoutFormV9
                cartData={checkoutData}
                onSuccess={handleCheckoutSuccess}
                onError={handleCheckoutError}
              />
            </BraintreeProvider>
          </div>
        </div>
      </PageContainer>
    );
  }

  // Main Cart View
  return (
    <PageContainer showSidebar={true}>
      <div>
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ShoppingCartIcon className="h-8 w-8 mr-3 text-purple-500" />
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Shopping Cart
              </h1>
            </div>
            <Link
              href="/"
              className="text-purple-400 hover:text-purple-300 transition-colors flex items-center text-sm sm:text-base"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {items.length === 0 ? (
          <EmptyCart
            title="Your cart is empty"
            description="Add some tickets to get started!"
            onBrowse={() => router.push('/')}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="animate-fade-in-up">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Event Image */}
                        <div className="w-full sm:w-32 h-32 sm:h-24 flex-shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.eventTitle}
                              width={128}
                              height={96}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-700 rounded-lg flex items-center justify-center">
                              <ShoppingCartIcon className="h-8 w-8 text-gray-500" />
                            </div>
                          )}
                        </div>

                        {/* Event Details */}
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                            <div className="flex-1">
                              <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                                {item.eventTitle}
                              </h3>
                              <div className="text-sm text-gray-400 space-y-1">
                                <p>{item.venue}</p>
                                <p>{new Date(item.eventDate).toLocaleDateString()} at {new Date(item.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                {item.eventType && (
                                  <p className="text-purple-400 font-medium">{item.eventType}</p>
                                )}
                              </div>
                            </div>

                            {/* Quantity and Price */}
                            <div className="flex items-center justify-between sm:flex-col sm:items-end gap-4 sm:gap-2">
                              <div className="flex items-center space-x-2">
                                <Button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  variant="ghost"
                                  size="sm"
                                  className="w-8 h-8 p-0 rounded-full"
                                >
                                  <MinusIcon className="h-4 w-4" />
                                </Button>
                                <span className="text-white font-semibold w-8 text-center">
                                  {item.quantity}
                                </span>
                                <Button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  variant="ghost"
                                  size="sm"
                                  className="w-8 h-8 p-0 rounded-full"
                                >
                                  <PlusIcon className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="text-right">
                                <p className="text-green-400 font-bold text-lg">
                                  ${item.totalPrice.toFixed(2)}
                                </p>
                                <Button
                                  onClick={() => removeItem(item.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-400 hover:text-red-300 p-0 h-auto"
                                >
                                  <TrashIcon className="h-4 w-4 mr-1" />
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Seat Information */}
                          <div className="mt-3 pt-3 border-t border-gray-700">
                            <p className="text-sm text-gray-300">
                              <span className="font-medium">Seat:</span> Section {item.section}, Row {item.row}
                              {item.seat && `, Seat ${item.seat}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>

                  {/* Promo Code */}
                  <div className="mb-4">
                    <label htmlFor="promo" className="block text-sm font-medium text-gray-300 mb-2">
                      Promo Code
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="promo"
                        type="text"
                        value={promoCode}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPromoCode(e.target.value)}
                        placeholder="Enter code"
                        className="flex-1"
                        fullWidth={false}
                      />
                      <Button
                        onClick={handlePromoCode}
                        size="sm"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal ({summary.itemCount} items)</span>
                      <span>${summary.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Service Fee</span>
                      <span>${summary.serviceFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Delivery</span>
                      <span>${summary.deliveryFee.toFixed(2)}</span>
                    </div>
                    {finalDiscount > 0 && (
                      <div className="flex justify-between text-green-400">
                        <span>Discount</span>
                        <span>-${finalDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-600 pt-2">
                      <div className="flex justify-between text-white font-bold text-lg">
                        <span>Total</span>
                        <span>${finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    fullWidth
                    variant="primary"
                    leftIcon={<CreditCardIcon className="h-5 w-5" />}
                    className="mb-4"
                    onClick={handleCheckout}
                    disabled={items.length === 0}
                  >
                    Checkout
                  </Button>

                  {/* Trust Badges */}
                  <div className="space-y-3 pt-4 border-t border-gray-700">
                    <div className="flex items-center text-gray-400 text-sm">
                      <ShieldCheckIcon className="h-4 w-4 mr-2 text-green-500" />
                      <span>100% Secure Payment</span>
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <TruckIcon className="h-4 w-4 mr-2 text-blue-500" />
                      <span>Instant E-Tickets</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
