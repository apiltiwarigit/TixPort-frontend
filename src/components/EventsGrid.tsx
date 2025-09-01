'use client';

import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface Event {
  id: number;
  name: string;
  date: string;
  time: string;
  venue: string;
  location: string;
}

interface EventsGridProps {
  title: string;
  events: Event[];
  moreButtonText: string;
}

function EventCard({ event }: { event: Event }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-750 transition-colors cursor-pointer group">
      <div className="flex-1">
        <div className="text-white font-medium text-sm mb-1">{event.name}</div>
        <div className="text-gray-400 text-xs">
          {event.date} | {event.time} | {event.venue} - {event.location}
        </div>
      </div>
      <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
    </div>
  );
}

export default function EventsGrid({ title, events, moreButtonText }: EventsGridProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h3 className="text-white font-bold text-lg mb-4">{title}</h3>
      <div className="space-y-3 mb-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      <button className="btn-primary w-full text-sm">
        {moreButtonText}
      </button>
    </div>
  );
}

// Sample data for the three categories
export const concertsEvents: Event[] = [
  {
    id: 1,
    name: "Le Sserafim",
    date: "WED SEP 3",
    time: "7:30 PM",
    venue: "Prudential Center",
    location: "Newark, NJ"
  },
  {
    id: 2,
    name: "Poppy with Mspaint",
    date: "THU SEP 4",
    time: "8:00 PM",
    venue: "Wellmont Theatre",
    location: "Montclair, NJ"
  },
  {
    id: 3,
    name: "Eden Munoz",
    date: "FRI SEP 5",
    time: "8:00 PM",
    venue: "Ritz Theatre",
    location: "NJ Elizabeth, NJ"
  },
  {
    id: 4,
    name: "Rilo Kiley",
    date: "FRI SEP 5",
    time: "8:00 PM",
    venue: "The Rooftop at Pier 17",
    location: "New York, NY"
  },
  {
    id: 5,
    name: "The Waterboys",
    date: "FRI SEP 5",
    time: "8:00 PM",
    venue: "Hackensack Meridian Health Theatre at the Count Basie Center for the Arts",
    location: "Red Bank, NJ"
  }
];

export const sportsEvents: Event[] = [
  {
    id: 1,
    name: "Hagerstown Flying Boxcars at Staten Island FerryHawks",
    date: "TUE SEP 2",
    time: "6:30 PM",
    venue: "SIUH Community Park",
    location: "Staten Island, NY"
  },
  {
    id: 2,
    name: "New Hampshire Fisher Cats at Somerset Patriots",
    date: "TUE SEP 2",
    time: "6:35 PM",
    venue: "TD Bank Ballpark",
    location: "Bridgewater, NJ"
  },
  {
    id: 3,
    name: "New Hampshire Fisher Cats at Somerset Patriots",
    date: "WED SEP 3",
    time: "6:35 PM",
    venue: "TD Bank Ballpark",
    location: "Bridgewater, NJ"
  },
  {
    id: 4,
    name: "Spokane Zephyr FC at Brooklyn FC",
    date: "WED SEP 3",
    time: "7:00 PM",
    venue: "Maimonides Park",
    location: "Brooklyn, NY"
  },
  {
    id: 5,
    name: "Hagerstown Flying Boxcars at Staten Island FerryHawks",
    date: "THU SEP 4",
    time: "4:00 PM",
    venue: "SIUH Community Park",
    location: "Staten Island, NY"
  }
];

export const theatreEvents: Event[] = [
  {
    id: 1,
    name: "The Play That Goes Wrong",
    date: "MON SEP 1",
    time: "7:00 PM",
    venue: "New World Stages: Stage 4",
    location: "New York, NY"
  },
  {
    id: 2,
    name: "The Play That Goes Wrong",
    date: "WED SEP 3",
    time: "7:00 PM",
    venue: "New World Stages: Stage 4",
    location: "New York, NY"
  },
  {
    id: 3,
    name: "The Play That Goes Wrong",
    date: "THU SEP 4",
    time: "2:00 PM",
    venue: "New World Stages: Stage 4",
    location: "New York, NY"
  },
  {
    id: 4,
    name: "The Play That Goes Wrong",
    date: "THU SEP 4",
    time: "7:00 PM",
    venue: "New World Stages: Stage 4",
    location: "New York, NY"
  },
  {
    id: 5,
    name: "The Play That Goes Wrong",
    date: "FRI SEP 5",
    time: "7:00 PM",
    venue: "New World Stages: Stage 4",
    location: "New York, NY"
  }
];
