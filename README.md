# TixPort Frontend

Modern ticket marketplace frontend built with Next.js, TypeScript, and Tailwind CSS. Features a responsive design similar to Cards ticketCMS with enhanced user experience.

## Features

- **Modern Stack**: Next.js 14, React 18, TypeScript
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Event Discovery**: Search, filter, and browse events
- **Real-time Data**: Integration with TicketEvolution API via backend
- **Performance Optimized**: Fast loading with modern React patterns
- **Accessible**: Built with accessibility best practices

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- TixPort Backend API running (see ../TixPort-backend)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to http://localhost:3000

## Project Structure

```
src/
├── app/             # Next.js app directory
│   ├── globals.css  # Global styles
│   ├── layout.tsx   # Root layout
│   └── page.tsx     # Home page
├── components/      # Reusable components
│   ├── Header.tsx   # Main navigation
│   ├── Footer.tsx   # Site footer
│   └── EventCard.tsx # Event display card
├── lib/             # Utility libraries
│   ├── api.ts       # API client
│   └── utils.ts     # Helper functions
└── types/           # TypeScript definitions
    └── index.ts     # Type definitions
```

## Features

### Event Discovery
- **Search**: Find events by name, artist, venue, or location
- **Filters**: Filter by category, location, date range, and price
- **Categories**: Browse by concerts, sports, theater, etc.
- **Location-based**: Find events near you

### Event Display
- **Rich Cards**: Event cards with images, details, and pricing
- **Responsive Grid**: Adaptive layout for all screen sizes
- **Quick Actions**: Direct links to buy tickets
- **Event Details**: Comprehensive event information

### User Experience
- **Fast Loading**: Optimized performance with Next.js
- **Smooth Navigation**: Client-side routing
- **Mobile Friendly**: Touch-optimized interface
- **Accessibility**: Screen reader friendly

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL | http://localhost:3001 |

### Tailwind CSS

The project uses a custom Tailwind configuration with:
- Custom color palette (primary blue theme)
- Extended spacing and typography
- Custom component classes
- Responsive breakpoints

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

## Components

### Header
- Navigation menu with categories
- Search functionality
- User actions (login, cart)
- Location display
- Mobile-responsive menu

### EventCard
- Event image and title
- Date, time, and venue information
- Price range display
- Category badges
- Buy tickets CTA

### Footer
- Company information
- Quick links and categories
- Guarantee information
- Contact details

## API Integration

The frontend communicates with the backend API for:
- Event listings and search
- Event details
- Ticket information
- Categories and filters

### API Client (`src/lib/api.ts`)
- Axios-based HTTP client
- Request/response interceptors
- Error handling
- Type-safe API calls

## Styling

### Tailwind CSS Classes
- `ticket-card` - Event card styling
- `event-image` - Event image styling
- `price-tag` - Price display styling

### Color Scheme
- Primary: Blue palette (#3b82f6 variants)
- Gray scale: For text and backgrounds
- Green: For success states and guarantees

## Development

### Adding New Pages
1. Create page in `src/app/` directory
2. Follow Next.js 13+ app directory conventions
3. Use TypeScript for type safety

### Adding Components
1. Create component in `src/components/`
2. Use TypeScript interfaces for props
3. Include proper styling with Tailwind

### API Integration
1. Add API functions to `src/lib/api.ts`
2. Create/update types in `src/types/`
3. Use React hooks for data fetching

## Performance

- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Static Generation**: Pre-rendered pages where possible
- **Caching**: API response caching strategies

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers with ES2018 support

## Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
1. Run `npm run build`
2. Deploy `out/` directory to your hosting platform
3. Configure environment variables

## Contributing

1. Follow the existing code style
2. Use TypeScript for all new code
3. Write responsive CSS with Tailwind
4. Test on multiple screen sizes
5. Ensure accessibility compliance

## License

MIT License - see LICENSE file for details.