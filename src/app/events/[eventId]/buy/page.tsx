'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopCounters from '@/components/TopCounters';
import {
  MapPinIcon,
  CalendarDaysIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ShoppingCartIcon,
  ChevronLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  TicketIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

// Mock event data - would be fetched based on eventId
const mockEvent = {
  id: '1',
  title: 'Taylor Swift - The Eras Tour',
  venue: 'MetLife Stadium',
  location: 'East Rutherford, NJ',
  date: '2024-08-15',
  time: '8:00 PM',
  description: 'Experience the spectacular Eras Tour featuring all of Taylor Swift\'s biggest hits spanning her incredible career. This once-in-a-lifetime concert promises an unforgettable night of music and memories.',
  image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
  category: 'Concert',
  organizer: 'Live Nation',
  capacity: 82500,
  availableTickets: 45230
};

// Mock venue layout with seats
const generateVenueLayout = () => {
  const sections = [
    {
      name: 'Floor',
      price: 299.00,
      rows: 10,
      seatsPerRow: 20,
      available: 150,
      total: 200
    },
    {
      name: 'Lower Level',
      price: 189.00,
      rows: 15,
      seatsPerRow: 25,
      available: 280,
      total: 375
    },
    {
      name: 'Club Level',
      price: 249.00,
      rows: 12,
      seatsPerRow: 22,
      available: 198,
      total: 264
    },
    {
      name: 'Upper Level',
      price: 129.00,
      rows: 20,
      seatsPerRow: 30,
      available: 450,
      total: 600
    }
  ];

  return sections.map(section => ({
    ...section,
    seats: Array.from({ length: section.rows }, (_, rowIndex) =>
      Array.from({ length: section.seatsPerRow }, (_, seatIndex) => ({
        id: `${section.name.toLowerCase().replace(' ', '-')}-${rowIndex + 1}-${seatIndex + 1}`,
        row: rowIndex + 1,
        number: seatIndex + 1,
        status: (Math.random() > 0.7 ? 'sold' : Math.random() > 0.3 ? 'available' : 'selected') as Seat['status'],
        price: section.price
      }))
    )
  }));
};

interface Seat {
  id: string;
  row: number;
  number: number;
  status: 'available' | 'sold' | 'selected';
  price: number;
}

interface Section {
  name: string;
  price: number;
  rows: number;
  seatsPerRow: number;
  available: number;
  total: number;
  seats: Seat[][];
}

export default function BuyTicketsPage() {
  const params = useParams();
  const eventId = params?.eventId as string;

  const [selectedSection, setSelectedSection] = useState<string>('Floor');
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [venueLayout] = useState<Section[]>(generateVenueLayout());

  const currentSection = venueLayout.find(section => section.name === selectedSection);

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'sold') return;

    if (seat.status === 'selected') {
      setSelectedSeats(prev => prev.filter(s => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= quantity) {
        // Replace the first selected seat if at max quantity
        setSelectedSeats(prev => [seat, ...prev.slice(1)]);
      } else {
        setSelectedSeats(prev => [...prev, seat]);
      }
    }
  };

  const handleSectionChange = (sectionName: string) => {
    setSelectedSection(sectionName);
    setSelectedSeats([]); // Clear selections when changing sections
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    // Adjust selected seats if quantity decreased
    if (selectedSeats.length > newQuantity) {
      setSelectedSeats(prev => prev.slice(0, newQuantity));
    }
  };

  const subtotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const serviceFee = subtotal * 0.1;
  const deliveryFee = selectedSeats.length > 0 ? 4.99 : 0;
  const total = subtotal + serviceFee + deliveryFee;

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log('Adding to cart:', {
      eventId,
      selectedSeats,
      total
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />

      {/* Top Counters */}
      <div className="py-3 sm:py-4 border-t border-b border-gray-800/80 bg-gray-900/40 backdrop-blur">
        <TopCounters />
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Back Navigation */}
        <Link
          href="/"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6 transition-colors"
        >
          <ChevronLeftIcon className="h-5 w-5 mr-2" />
          Back to Events
        </Link>

        {/* Event Header */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/3">
              <img
                src={mockEvent.image}
                alt={mockEvent.title}
                className="w-full h-48 lg:h-64 object-cover rounded-lg"
              />
            </div>
            <div className="lg:w-2/3">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                {mockEvent.title}
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                  <div>
                    <p className="font-medium">{mockEvent.venue}</p>
                    <p className="text-sm">{mockEvent.location}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <CalendarDaysIcon className="h-5 w-5 mr-2 text-gray-400" />
                  <div>
                    <p className="font-medium">{new Date(mockEvent.date).toLocaleDateString()}</p>
                    <p className="text-sm">{mockEvent.time}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <UsersIcon className="h-5 w-5 mr-2 text-gray-400" />
                  <div>
                    <p className="font-medium">{mockEvent.availableTickets.toLocaleString()} tickets available</p>
                    <p className="text-sm">Capacity: {mockEvent.capacity.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <TicketIcon className="h-5 w-5 mr-2 text-gray-400" />
                  <div>
                    <p className="font-medium">{mockEvent.category}</p>
                    <p className="text-sm">{mockEvent.organizer}</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-400 mt-4 leading-relaxed">
                {mockEvent.description}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat Selection */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Select Your Seats</h2>

              {/* Section Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Choose Section</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {venueLayout.map((section) => (
                    <button
                      key={section.name}
                      onClick={() => handleSectionChange(section.name)}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        selectedSection === section.name
                          ? 'border-purple-500 bg-purple-900/20 text-purple-300'
                          : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="text-sm font-medium">{section.name}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        ${section.price}
                      </div>
                      <div className="text-xs text-gray-400">
                        {section.available}/{section.total} available
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Number of Tickets</h3>
                <div className="flex items-center space-x-4">
                  <label className="text-gray-300">Quantity:</label>
                  <select
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                    className="input-field px-3 py-2 text-sm w-20"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-400">
                    {selectedSeats.length}/{quantity} selected
                  </span>
                </div>
              </div>

              {/* Seat Map */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Venue Map - {selectedSection}</h3>
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
                  {/* Stage */}
                  <div className="text-center mb-4">
                    <div className="bg-gray-700 text-gray-300 px-4 py-2 rounded text-sm font-medium inline-block">
                      STAGE
                    </div>
                  </div>

                  {/* Seat Grid */}
                  <div className="max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-20 gap-1 justify-center">
                      {currentSection?.seats.map((row, rowIndex) =>
                        row.map((seat, seatIndex) => (
                          <button
                            key={seat.id}
                            onClick={() => handleSeatClick(seat)}
                            className={`w-4 h-4 rounded-sm text-xs transition-all duration-200 ${
                              seat.status === 'sold'
                                ? 'bg-red-600 cursor-not-allowed'
                                : seat.status === 'selected'
                                ? 'bg-green-500 hover:bg-green-400'
                                : 'bg-gray-600 hover:bg-gray-500'
                            }`}
                            disabled={seat.status === 'sold'}
                            title={`Row ${seat.row}, Seat ${seat.number} - $${seat.price}`}
                          />
                        ))
                      )}
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex justify-center items-center space-x-6 mt-4 pt-4 border-t border-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gray-600 rounded-sm"></div>
                      <span className="text-xs text-gray-300">Available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
                      <span className="text-xs text-gray-300">Selected</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-red-600 rounded-sm"></div>
                      <span className="text-xs text-gray-300">Sold</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Seats */}
              {selectedSeats.length > 0 && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-3">Selected Seats:</h4>
                  <div className="space-y-2">
                    {selectedSeats.map((seat) => (
                      <div key={seat.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">
                          Row {seat.row}, Seat {seat.number}
                        </span>
                        <span className="text-green-400 font-medium">${seat.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 sticky top-4">
              <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>

              {/* Selected Seats Summary */}
              {selectedSeats.length > 0 ? (
                <div className="space-y-4 mb-6">
                  <div className="text-sm text-gray-300">
                    <p className="font-medium mb-2">Selected Seats:</p>
                    {selectedSeats.map((seat) => (
                      <div key={seat.id} className="flex justify-between mb-1">
                        <span>Row {seat.row}, Seat {seat.number}</span>
                        <span>${seat.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-600 pt-4 space-y-2">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal ({selectedSeats.length} tickets)</span>
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
                    <div className="border-t border-gray-600 pt-2">
                      <div className="flex justify-between text-white font-bold text-lg">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <InformationCircleIcon className="h-12 w-12 mx-auto mb-3" />
                  <p>Select seats to see pricing</p>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={selectedSeats.length === 0 || selectedSeats.length !== quantity}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform ${
                  selectedSeats.length === 0 || selectedSeats.length !== quantity
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white hover:scale-105'
                } flex items-center justify-center space-x-2`}
              >
                <ShoppingCartIcon className="h-5 w-5" />
                <span>
                  {selectedSeats.length === 0
                    ? 'Select Seats'
                    : selectedSeats.length !== quantity
                    ? `Select ${quantity - selectedSeats.length} More Seat${quantity - selectedSeats.length !== 1 ? 's' : ''}`
                    : 'Add to Cart'
                  }
                </span>
              </button>

              {/* Important Info */}
              <div className="mt-6 pt-4 border-t border-gray-600">
                <div className="space-y-3 text-xs text-gray-400">
                  <div className="flex items-start space-x-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>All tickets are 100% authentic and guaranteed</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Instant e-ticket delivery after purchase</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Secure checkout with multiple payment options</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
