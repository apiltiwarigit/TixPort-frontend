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
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6 transform transition-all duration-300 hover:shadow-xl hover:scale-[1.02] animate-fade-in-up">
      <h2 className="text-white font-bold text-lg sm:text-xl mb-4 sm:mb-6">Our Guarantee</h2>
      <div className="space-y-3 sm:space-y-4">
        {guarantees.map((guarantee, index) => (
          <div 
            key={index} 
            className="flex items-start space-x-2 sm:space-x-3 transform transition-all duration-300 hover:translate-x-2 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex-shrink-0">
              <CheckIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 transform transition-all duration-300 hover:scale-125" />
            </div>
            <div className="min-w-0">
              <h3 className="text-white font-semibold text-xs sm:text-sm group-hover:text-green-400 transition-colors duration-300">{guarantee.title}</h3>
              <p className="text-gray-300 text-xs sm:text-sm group-hover:text-gray-200 transition-colors duration-300">{guarantee.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
