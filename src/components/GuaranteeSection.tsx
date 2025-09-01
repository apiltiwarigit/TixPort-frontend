'use client';

import { CheckIcon } from '@heroicons/react/24/solid';

export default function GuaranteeSection() {
  const guarantees = [
    {
      title: "Valid tickets",
      description: "All tickets 100% authentic and valid for entry!"
    },
    {
      title: "On time",
      description: "Tickets will arrive in time for your event."
    },
    {
      title: "Seats together",
      description: "All seats are side by side unless otherwise noted."
    },
    {
      title: "Full refund",
      description: "Full refund for events that are canceled and not rescheduled."
    }
  ];

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h2 className="text-white font-bold text-xl mb-6">Our Guarantee</h2>
      <div className="space-y-4">
        {guarantees.map((guarantee, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <CheckIcon className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">{guarantee.title}</h3>
              <p className="text-gray-300 text-sm">{guarantee.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
