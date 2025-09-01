'use client';

import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

export default function Footer() {
  const sportsTeams = {
    'NFL Football': [
      'Arizona Cardinals', 'Atlanta Falcons', 'Baltimore Ravens', 'Buffalo Bills',
      'Carolina Panthers', 'Chicago Bears', 'Cincinnati Bengals', 'Cleveland Browns',
      'Dallas Cowboys', 'Denver Broncos', 'Detroit Lions', 'Green Bay Packers',
      'Houston Texans', 'Indianapolis Colts', 'Jacksonville Jaguars', 'Kansas City Chiefs',
      'Las Vegas Raiders', 'Los Angeles Chargers', 'Los Angeles Rams', 'Miami Dolphins',
      'Minnesota Vikings', 'New England Patriots', 'New Orleans Saints', 'New York Giants',
      'New York Jets', 'Philadelphia Eagles', 'Pittsburgh Steelers', 'San Francisco 49ers',
      'Seattle Seahawks', 'Tampa Bay Buccaneers', 'Tennessee Titans', 'Washington Commanders'
    ],
    'MLB Baseball': [
      'Arizona Diamondbacks', 'Atlanta Braves', 'Baltimore Orioles', 'Boston Red Sox',
      'Chicago Cubs', 'Chicago White Sox', 'Cincinnati Reds', 'Cleveland Guardians',
      'Colorado Rockies', 'Detroit Tigers', 'Houston Astros', 'Kansas City Royals',
      'Los Angeles Angels', 'Los Angeles Dodgers', 'Miami Marlins', 'Milwaukee Brewers',
      'Minnesota Twins', 'New York Mets', 'New York Yankees', 'Oakland Athletics',
      'Philadelphia Phillies', 'Pittsburgh Pirates', 'San Diego Padres', 'San Francisco Giants',
      'Seattle Mariners', 'St. Louis Cardinals', 'Tampa Bay Rays', 'Texas Rangers',
      'Toronto Blue Jays', 'Washington Nationals'
    ],
    'NBA Basketball': [
      'Atlanta Hawks', 'Boston Celtics', 'Brooklyn Nets', 'Charlotte Hornets',
      'Chicago Bulls', 'Cleveland Cavaliers', 'Dallas Mavericks', 'Denver Nuggets',
      'Detroit Pistons', 'Golden State Warriors', 'Houston Rockets', 'Indiana Pacers',
      'Los Angeles Clippers', 'Los Angeles Lakers', 'Memphis Grizzlies', 'Miami Heat',
      'Milwaukee Bucks', 'Minnesota Timberwolves', 'New Orleans Pelicans', 'New York Knicks',
      'Oklahoma City Thunder', 'Orlando Magic', 'Philadelphia 76ers', 'Phoenix Suns',
      'Portland Trail Blazers', 'Sacramento Kings', 'San Antonio Spurs', 'Toronto Raptors',
      'Utah Jazz', 'Washington Wizards'
    ],
    'NHL Hockey': [
      'Anaheim Ducks', 'Arizona Coyotes', 'Boston Bruins', 'Buffalo Sabres',
      'Calgary Flames', 'Carolina Hurricanes', 'Chicago Blackhawks', 'Colorado Avalanche',
      'Columbus Blue Jackets', 'Dallas Stars', 'Detroit Red Wings', 'Edmonton Oilers',
      'Florida Panthers', 'Los Angeles Kings', 'Minnesota Wild', 'Montreal Canadiens',
      'Nashville Predators', 'New Jersey Devils', 'New York Islanders', 'New York Rangers',
      'Ottawa Senators', 'Philadelphia Flyers', 'Pittsburgh Penguins', 'San Jose Sharks',
      'Seattle Kraken', 'St. Louis Blues', 'Tampa Bay Lightning', 'Toronto Maple Leafs',
      'Vancouver Canucks', 'Vegas Golden Knights', 'Washington Capitals', 'Winnipeg Jets'
    ],
    'WNBA': [
      'Atlanta Dream', 'Chicago Sky', 'Connecticut Sun', 'Dallas Wings',
      'Indiana Fever', 'Las Vegas Aces', 'Los Angeles Sparks', 'Minnesota Lynx',
      'New York Liberty', 'Phoenix Mercury', 'Seattle Storm', 'Washington Mystics'
    ]
  };

  return (
    <footer className="bg-gray-900 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Sports Teams Section - Full width on mobile, 2 cols on tablet, 2 cols on desktop */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
              {Object.entries(sportsTeams).map(([category, teams]) => (
                <div key={category} className="space-y-4 animate-fade-in-up">
                  <h3 className="text-white font-bold text-lg sm:text-xl mb-4">{category}</h3>
                  <div className="grid grid-cols-1 gap-2 mb-6">
                    {teams.slice(0, 8).map((team, index) => (
                      <a
                        key={team}
                        href={`/sports/${category.toLowerCase().replace(/\s+/g, '-')}/${team.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-gray-300 hover:text-white text-sm transition-all duration-300 hover:translate-x-1 transform hover:text-green-400"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        {team}
                      </a>
                    ))}
                  </div>
                  <button className="btn-primary text-sm font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    View All {category}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div>
              <h3 className="text-white font-bold text-lg sm:text-xl mb-4">Stay Updated</h3>
              <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                Get the latest updates on events, exclusive deals, and special offers delivered to your inbox.
              </p>
            </div>
            <form className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input-field w-full text-sm py-3 px-4 rounded-lg border-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-300 transform focus:scale-105"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  className="input-field w-full text-sm py-3 px-4 rounded-lg border-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-300 transform focus:scale-105"
                />
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center text-sm font-medium py-3 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                Subscribe Now
              </button>
            </form>
            <p className="text-gray-400 text-xs">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>

          {/* About & Social Section */}
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div>
              <h3 className="text-white font-bold text-lg sm:text-xl mb-4">About TixPort</h3>
              <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                Your trusted partner for premium event tickets. We connect you with the best seats for concerts, sports, and theater events nationwide.
              </p>
              <button className="btn-primary text-sm font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Learn More
              </button>
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold text-base">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-125 hover:text-green-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-125 hover:text-green-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-125 hover:text-green-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-125 hover:text-green-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 mt-12 sm:mt-16 lg:mt-20 pt-8 sm:pt-12">
          {/* Quick Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 mb-8">
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Company</h4>
              <div className="space-y-2">
                <a href="/about" className="block text-gray-300 hover:text-white text-sm transition-colors">About Us</a>
                <a href="/contact" className="block text-gray-300 hover:text-white text-sm transition-colors">Contact</a>
                <a href="/careers" className="block text-gray-300 hover:text-white text-sm transition-colors">Careers</a>
                <a href="/press" className="block text-gray-300 hover:text-white text-sm transition-colors">Press</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Support</h4>
              <div className="space-y-2">
                <a href="/faq" className="block text-gray-300 hover:text-white text-sm transition-colors">FAQ</a>
                <a href="/help" className="block text-gray-300 hover:text-white text-sm transition-colors">Help Center</a>
                <a href="/shipping" className="block text-gray-300 hover:text-white text-sm transition-colors">Shipping</a>
                <a href="/returns" className="block text-gray-300 hover:text-white text-sm transition-colors">Returns</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Legal</h4>
              <div className="space-y-2">
                <a href="/privacy" className="block text-gray-300 hover:text-white text-sm transition-colors">Privacy Policy</a>
                <a href="/terms" className="block text-gray-300 hover:text-white text-sm transition-colors">Terms of Service</a>
                <a href="/cookies" className="block text-gray-300 hover:text-white text-sm transition-colors">Cookie Policy</a>
                <a href="/accessibility" className="block text-gray-300 hover:text-white text-sm transition-colors">Accessibility</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Events</h4>
              <div className="space-y-2">
                <a href="/concerts" className="block text-gray-300 hover:text-white text-sm transition-colors">Concerts</a>
                <a href="/sports" className="block text-gray-300 hover:text-white text-sm transition-colors">Sports</a>
                <a href="/theatre" className="block text-gray-300 hover:text-white text-sm transition-colors">Theatre</a>
                <a href="/comedy" className="block text-gray-300 hover:text-white text-sm transition-colors">Comedy</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Sports</h4>
              <div className="space-y-2">
                <a href="/nfl" className="block text-gray-300 hover:text-white text-sm transition-colors">NFL</a>
                <a href="/nba" className="block text-gray-300 hover:text-white text-sm transition-colors">NBA</a>
                <a href="/mlb" className="block text-gray-300 hover:text-white text-sm transition-colors">MLB</a>
                <a href="/nhl" className="block text-gray-300 hover:text-white text-sm transition-colors">NHL</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Connect</h4>
              <div className="space-y-2">
                <a href="/newsletter" className="block text-gray-300 hover:text-white text-sm transition-colors">Newsletter</a>
                <a href="/blog" className="block text-gray-300 hover:text-white text-sm transition-colors">Blog</a>
                <a href="/reviews" className="block text-gray-300 hover:text-white text-sm transition-colors">Reviews</a>
                <a href="/partners" className="block text-gray-300 hover:text-white text-sm transition-colors">Partners</a>
              </div>
            </div>
          </div>

          {/* Copyright and Legal Notice */}
          <div className="border-t border-gray-700 pt-6 sm:pt-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-gray-400 text-sm">
                © 2025 TixPort. All rights reserved.
              </div>
              <div className="flex items-center space-x-4 text-gray-400 text-sm">
                <span>Licensed Ticket Broker</span>
                <span>•</span>
                <span>Secure Transactions</span>
                <span>•</span>
                <span>24/7 Support</span>
              </div>
            </div>
            
            <div className="mt-4 text-gray-400 text-xs leading-relaxed max-w-4xl">
              <p>
                TixPort is an independently owned and operated, licensed ticket broker that specializes in obtaining premium and sold out tickets to events nationwide. 
                Ticket prices are dependent upon the current market price, which is usually above the face value printed on the tickets. 
                We are not affiliated with Ticketmaster or any venues, teams, performers or organizations. 
                Please read our Terms of Service and Privacy Policy for further information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}