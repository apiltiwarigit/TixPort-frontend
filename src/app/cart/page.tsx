'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PageContainer } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { EmptyCart } from '@/components/ui';
import {
  ShoppingCartIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  TruckIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

// Mock cart data - will be replaced with real cart state management later
const mockCartItems = [
  {
    id: 1,
    eventTitle: 'Taylor Swift - The Eras Tour',
    venue: 'MetLife Stadium',
    date: '2024-08-15',
    time: '8:00 PM',
    section: 'Floor',
    row: 'A',
    seat: '12',
    price: 299.00,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    eventType: 'Concert'
  },
  {
    id: 2,
    eventTitle: 'New York Yankees vs Boston Red Sox',
    venue: 'Yankee Stadium',
    date: '2024-08-25',
    time: '7:05 PM',
    section: 'Field Level',
    row: '15',
    seat: '8',
    price: 125.00,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=400&h=300&fit=crop',
    eventType: 'MLB Baseball'
  }
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(mockCartItems);
  const [promoCode, setPromoCode] = useState('');

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const serviceFee = subtotal * 0.1; // 10% service fee
  const deliveryFee = cartItems.length > 0 ? 4.99 : 0;
  const discount = promoCode === 'TIXPORT10' ? subtotal * 0.1 : 0; // 10% discount
  const total = subtotal + serviceFee + deliveryFee - discount;

  const handlePromoCode = () => {
    // Handle promo code validation here
    console.log('Applying promo code:', promoCode);
  };

  const handleCheckout = () => {
    // Handle checkout logic here
    console.log('Processing checkout...');
    alert('Checkout functionality would be implemented here!');
  };

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

        {cartItems.length === 0 ? (
          <EmptyCart
            title="Your cart is empty"
            description="Add some tickets to get started!"
            onBrowse={() => window.location.href = '/'}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="animate-fade-in-up">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Event Image */}
                        <div className="w-full sm:w-32 h-32 sm:h-24 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.eventTitle}
                            width={128}
                            height={96}
                            className="w-full h-full object-cover rounded-lg"
                          />
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
                                <p>{new Date(item.date).toLocaleDateString()} at {item.time}</p>
                                <p className="text-purple-400 font-medium">{item.eventType}</p>
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
                                  ${(item.price * item.quantity).toFixed(2)}
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
                              <span className="font-medium">Seat:</span> Section {item.section}, Row {item.row}, Seat {item.seat}
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
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>

                <CardContent>
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
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Service Fee</span>
                      <span>${serviceFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Delivery</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-400">
                        <span>Discount</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-600 pt-2">
                      <div className="flex justify-between text-white font-bold text-lg">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
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
                    disabled={cartItems.length === 0}
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
