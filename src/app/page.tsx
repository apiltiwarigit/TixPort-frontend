import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import HeroSection from '@/components/HeroSection';
import GuaranteeSection from '@/components/GuaranteeSection';
import EventsGrid from '@/components/EventsGrid';
import Footer from '@/components/Footer';
import LocationDisplay from '@/components/LocationDisplay';
import LocationDebug from '@/components/LocationDebug';
import TopCounters from '@/components/TopCounters';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />

      {/* Top Counters */}
      <div className="py-3 sm:py-4 border-t border-b border-gray-800/80 bg-gray-900/40 backdrop-blur">
        <TopCounters />
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Hero Section */}
          <HeroSection />
          
          {/* Guarantee Section */}
          <div className="mb-6 sm:mb-8">
            <GuaranteeSection />
          </div>

          {/* Location Debug - Temporary for testing */}
          <LocationDebug />

          {/* Events Near Location */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
              <LocationDisplay 
                className="text-xl sm:text-2xl font-bold"
                showChangeButton={true}
              />
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <EventsGrid
              title="Local Concerts Events"
              category="Concerts"
              city="Edison"
              state="NJ"
              moreButtonText="More Concerts Events"
            />
            <EventsGrid
              title="Local Sports Events"
              category="Sports"
              city="Edison"
              state="NJ"
              moreButtonText="More Sports Events"
            />
            <EventsGrid
              title="Local Theatre Events"
              category="Theater"
              city="Edison"
              state="NJ"
              moreButtonText="More Theatre Events"
            />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}