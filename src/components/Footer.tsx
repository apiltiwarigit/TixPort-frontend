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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sports Teams Section */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(sportsTeams).map(([category, teams]) => (
                <div key={category}>
                  <h3 className="text-white font-bold text-lg mb-4">{category}</h3>
                  <div className="grid grid-cols-1 gap-1 mb-4">
                    {teams.slice(0, 8).map((team) => (
                      <a
                        key={team}
                        href={`/sports/${category.toLowerCase().replace(/\s+/g, '-')}/${team.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-gray-300 hover:text-white text-sm transition-colors"
                      >
                        {team}
                      </a>
                    ))}
                  </div>
                  <button className="btn-primary text-sm">
                    View All {category}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Sign up and save!</h3>
            <p className="text-gray-300 text-sm mb-4">
              This is your newsletter text. It's controlled by the custom list named: Newsletter Content.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Email"
                className="input-field w-full"
              />
              <input
                type="text"
                placeholder="Name"
                className="input-field w-full"
              />
              <button type="submit" className="btn-primary w-full flex items-center justify-center">
                <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                Subscribe
              </button>
            </form>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Who are we?</h3>
            <p className="text-gray-300 text-sm mb-4">
              This is your newsletter text. It's controlled by the custom list named: Newsletter Content.
              You can edit this in your custom list section of the admin panel.
            </p>
            <button className="btn-primary text-sm">
              Read more...
            </button>

            {/* Social Media */}
            <div className="mt-6">
              <h4 className="text-white font-semibold text-sm mb-3">Like us on Facebook</h4>
              <p className="text-gray-300 text-sm mb-2">ATBSWebdesign</p>
              <button className="btn-secondary text-sm">
                Visit our Facebook page
              </button>
            </div>

            <div className="mt-4">
              <h4 className="text-white font-semibold text-sm mb-3">Follow us on Twitter</h4>
              <p className="text-gray-300 text-sm mb-2">Tweets by @ATBS</p>
              <button className="btn-secondary text-sm">
                Visit our twitter page
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex flex-wrap space-x-6 mb-4">
              <a href="/about" className="text-gray-300 hover:text-white text-sm">About us</a>
              <a href="/contact" className="text-gray-300 hover:text-white text-sm">Contact us</a>
              <a href="/faq" className="text-gray-300 hover:text-white text-sm">FAQ</a>
              <a href="/privacy" className="text-gray-300 hover:text-white text-sm">Privacy Policy</a>
              <a href="/terms" className="text-gray-300 hover:text-white text-sm">Terms & Conditions</a>
              <a href="/concerts" className="text-gray-300 hover:text-white text-sm">Concerts</a>
              <a href="/sports" className="text-gray-300 hover:text-white text-sm">Sports</a>
              <a href="/theatre" className="text-gray-300 hover:text-white text-sm">Theatre</a>
              <a href="/mlb" className="text-gray-300 hover:text-white text-sm">MLB</a>
              <a href="/nba" className="text-gray-300 hover:text-white text-sm">NBA</a>
              <a href="/nfl" className="text-gray-300 hover:text-white text-sm">NFL</a>
              <a href="/nhl" className="text-gray-300 hover:text-white text-sm">NHL</a>
            </div>
            <div className="text-gray-400 text-xs">
              ©2025 TixPort Theme | All Rights Reserved
            </div>
          </div>
          
          <div className="mt-4 text-gray-400 text-xs leading-relaxed">
            *TixPort is an independently owned and operated, licensed ticket broker that specializes in obtaining premium and sold out tickets to events nationwide. Ticket prices are dependent upon the current market price, which is usually above the face value printed on the tickets. We are not affiliated with Ticketmaster or any venues, teams, performers or organizations. Please read the Terms and Conditions as well as the Privacy Policy for further information.
          </div>
        </div>
      </div>
    </footer>
  );
}