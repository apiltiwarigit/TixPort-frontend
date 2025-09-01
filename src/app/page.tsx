import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import HeroSection from '@/components/HeroSection';
import GuaranteeSection from '@/components/GuaranteeSection';
import EventsGrid, { concertsEvents, sportsEvents, theatreEvents } from '@/components/EventsGrid';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Hero Section */}
          <HeroSection />
          
          {/* Hero and Guarantee Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <HeroSection />
            </div>
            <div>
              <GuaranteeSection />
            </div>
          </div>

          {/* Events Near Location */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Events Near Edison, NJ</h2>
              <button className="text-green-500 hover:text-green-400 text-sm font-medium">
                (change location)
              </button>
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <EventsGrid
              title="Local Concerts Events"
              events={concertsEvents}
              moreButtonText="More Concerts Events"
            />
            <EventsGrid
              title="Local Sports Events"
              events={sportsEvents}
              moreButtonText="More Sports Events"
            />
            <EventsGrid
              title="Local Theatre Events"
              events={theatreEvents}
              moreButtonText="More Theatre Events"
            />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}