import axios from 'axios';
import { GOOGLE_PLACES_API_KEY, USE_MOCK_DATA, AGENT_CONFIG } from '../config';
import { logger } from '../utils/logger';

export interface BusinessResult {
  place_id: string;
  name: string;
  address: string;
  city: string;
  phone: string | null;
  website: string | null;
  rating: number | null;
  review_count: number;
  category: string;
  is_operational: boolean;
  types: string[];
}

// ── Google Places API ─────────────────────────────────────────────────────────

async function searchViaGooglePlaces(
  location: string,
  category: string,
  maxResults: number
): Promise<BusinessResult[]> {
  const url = 'https://places.googleapis.com/v1/places:searchText';
  const fieldMask = [
    'places.id',
    'places.displayName',
    'places.formattedAddress',
    'places.nationalPhoneNumber',
    'places.websiteUri',
    'places.rating',
    'places.userRatingCount',
    'places.primaryType',
    'places.types',
    'places.businessStatus',
  ].join(',');

  const response = await axios.post(
    url,
    {
      textQuery: `${category} in ${location}`,
      maxResultCount: Math.min(maxResults, 20),
      languageCode: 'en',
    },
    {
      headers: {
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': fieldMask,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    }
  );

  const places = response.data.places || [];

  return places.map((p: Record<string, unknown>) => {
    const displayName = p.displayName as Record<string, string> | null;
    const addr = (p.formattedAddress as string) || '';
    // Extract city from address (last component before country)
    const addrParts = addr.split(',').map((s: string) => s.trim());
    const city = addrParts.length >= 2 ? addrParts[addrParts.length - 2] : location;

    return {
      place_id:     (p.id as string) || '',
      name:         displayName?.text || 'Unknown Business',
      address:      addr,
      city,
      phone:        (p.nationalPhoneNumber as string) || null,
      website:      (p.websiteUri as string) || null,
      rating:       typeof p.rating === 'number' ? p.rating : null,
      review_count: typeof p.userRatingCount === 'number' ? p.userRatingCount : 0,
      category,
      is_operational: p.businessStatus === 'OPERATIONAL',
      types:        (p.types as string[]) || [],
    };
  });
}

// ── Mock Data (when no Google Places API key) ─────────────────────────────────

const MOCK_TEMPLATES: Record<string, Array<Partial<BusinessResult>>> = {
  plumber: [
    { name: "Mike's Plumbing & Drains",        phone: '011 555 1234', rating: 4.2, review_count: 34,  website: null },
    { name: 'QuickFix Plumbers',               phone: '082 555 9876', rating: 3.8, review_count: 12,  website: null },
    { name: 'Reliable Plumbing CC',            phone: '011 666 5678', rating: 4.5, review_count: 67,  website: 'https://reliableplumbing.co.za' },
    { name: "Bob's Drain Services",            phone: null,           rating: 3.5, review_count: 8,   website: null },
    { name: 'ProFlow Plumbers',                phone: '010 444 3333', rating: 4.0, review_count: 22,  website: null },
    { name: 'Emergency Plumbing 24/7',         phone: '064 555 7890', rating: 4.7, review_count: 89,  website: 'https://emergencyplumbing247.co.za' },
    { name: 'City Drains & Gutters',           phone: '082 333 4444', rating: 3.9, review_count: 15,  website: null },
    { name: 'Master Plumbers SA',              phone: '011 999 0000', rating: 4.3, review_count: 58,  website: null },
    { name: 'FastPipe Solutions',              phone: '083 111 2222', rating: 4.0, review_count: 20,  website: null },
    { name: 'AquaFix Plumbing',               phone: '076 888 9999', rating: 4.1, review_count: 31,  website: null },
  ],
  electrician: [
    { name: 'Bright Spark Electrical',         phone: '011 777 1111', rating: 4.4, review_count: 52,  website: null },
    { name: 'PowerUp Electricians',            phone: '083 222 3333', rating: 3.9, review_count: 18,  website: null },
    { name: 'SafeWire Electrical CC',          phone: '011 888 2222', rating: 4.6, review_count: 74,  website: 'https://safewire.co.za' },
    { name: "Thompson's Electrical Services", phone: '082 444 5555', rating: 4.1, review_count: 29,  website: null },
    { name: 'JHB Electrical Contractors',     phone: '010 555 6666', rating: 4.3, review_count: 43,  website: null },
    { name: 'Volt Masters',                   phone: null,            rating: 3.7, review_count: 9,   website: null },
    { name: 'EcoSpark Electrical',            phone: '066 777 8888', rating: 4.5, review_count: 61,  website: null },
    { name: 'City Electrical Solutions',      phone: '011 999 7777', rating: 4.0, review_count: 37,  website: 'https://cityelectrical.co.za' },
    { name: 'Watts Up Electricians',          phone: '073 333 4444', rating: 4.2, review_count: 26,  website: null },
  ],
  mechanic: [
    { name: "Dave's Auto Repairs",            phone: '011 123 4567', rating: 4.3, review_count: 88,  website: null },
    { name: 'Quick Lube & Service Centre',    phone: '082 987 6543', rating: 4.0, review_count: 45,  website: 'https://quicklube.co.za' },
    { name: 'Township Mechanics',             phone: '076 543 2109', rating: 4.1, review_count: 32,  website: null },
    { name: 'Euro Car Workshop',              phone: '011 234 5678', rating: 4.5, review_count: 67,  website: null },
    { name: 'AA Approved Auto Service',       phone: '010 876 5432', rating: 4.4, review_count: 112, website: null },
    { name: 'Budget Car Repairs',             phone: null,           rating: 3.6, review_count: 14,  website: null },
    { name: 'Pro Mechanics Garage',           phone: '083 765 4321', rating: 4.2, review_count: 53,  website: null },
  ],
  'hair salon': [
    { name: 'Glamour Hair Studio',            phone: '011 456 7890', rating: 4.4, review_count: 145, website: null },
    { name: "Nandi's Hair & Beauty",          phone: '083 678 9012', rating: 4.6, review_count: 203, website: null },
    { name: 'Scissors & Curls',               phone: '011 567 8901', rating: 4.2, review_count: 89,  website: 'https://scissorsandcurls.co.za' },
    { name: 'Style Box Salon',                phone: '076 789 0123', rating: 4.1, review_count: 67,  website: null },
    { name: 'The Hair Lounge',                phone: null,           rating: 3.8, review_count: 22,  website: null },
    { name: 'Afro Chic Hair Boutique',        phone: '082 901 2345', rating: 4.7, review_count: 178, website: null },
    { name: 'Head Turners Hair Studio',       phone: '010 012 3456', rating: 4.3, review_count: 94,  website: null },
    { name: "Princess Beauty & Hair",         phone: '066 234 5678', rating: 4.5, review_count: 134, website: null },
  ],
  restaurant: [
    { name: "Mama's Kitchen",                 phone: '011 789 0123', rating: 4.3, review_count: 234, website: null },
    { name: 'The Braai Spot',                 phone: '083 890 1234', rating: 4.5, review_count: 189, website: null },
    { name: 'Spice Garden Restaurant',        phone: '011 890 1234', rating: 4.1, review_count: 112, website: 'https://spicegarden.co.za' },
    { name: 'Fast Lane Takeaways',            phone: '076 901 2345', rating: 3.9, review_count: 78,  website: null },
    { name: 'Corner Café & Grill',            phone: null,           rating: 4.0, review_count: 45,  website: null },
    { name: 'Ubuntu Restaurant',              phone: '082 012 3456', rating: 4.6, review_count: 267, website: null },
    { name: "Chef's Table",                   phone: '010 123 4567', rating: 4.4, review_count: 156, website: null },
    { name: 'Sunset Diner',                   phone: '066 345 6789', rating: 4.2, review_count: 98,  website: null },
  ],
  'cleaning service': [
    { name: 'SparkleClean Domestic Services', phone: '011 321 0987', rating: 4.3, review_count: 56,  website: null },
    { name: 'ProClean CC',                    phone: '082 432 1098', rating: 4.1, review_count: 34,  website: null },
    { name: 'Shine Time Cleaners',            phone: '076 543 2109', rating: 4.4, review_count: 78,  website: null },
    { name: 'Fresh Home Cleaning',            phone: null,           rating: 3.9, review_count: 19,  website: null },
    { name: 'Clean Sweep Services',           phone: '083 654 3210', rating: 4.2, review_count: 43,  website: 'https://cleansweep.co.za' },
    { name: 'Top Maid Services',              phone: '010 765 4321', rating: 4.5, review_count: 91,  website: null },
  ],
};

function getMockBusinesses(location: string, category: string): BusinessResult[] {
  const categoryKey = Object.keys(MOCK_TEMPLATES).find(k => category.toLowerCase().includes(k)) || 'plumber';
  const templates = MOCK_TEMPLATES[categoryKey] || MOCK_TEMPLATES.plumber;

  const cityMatch = location.split(',')[0].trim();

  return templates.map((t, i) => ({
    place_id:       `mock_${categoryKey}_${i}_${Date.now()}`,
    name:           t.name || 'Unknown Business',
    address:        `${Math.floor(Math.random() * 200) + 1} Main Street, ${cityMatch}`,
    city:           cityMatch,
    phone:          t.phone ?? null,
    website:        t.website ?? null,
    rating:         t.rating ?? null,
    review_count:   t.review_count ?? 0,
    category,
    is_operational: true,
    types:          [categoryKey],
  }));
}

// ── Exported Function ─────────────────────────────────────────────────────────

export async function searchBusinesses(
  location: string,
  category: string,
  radiusKm = 10
): Promise<{
  businesses: BusinessResult[];
  source: 'google_places' | 'mock';
  count: number;
}> {
  const maxResults = AGENT_CONFIG.MAX_BUSINESSES_PER_CYCLE;

  if (USE_MOCK_DATA) {
    logger.warn('Running in MOCK MODE — set GOOGLE_PLACES_API_KEY for real data');
    const businesses = getMockBusinesses(location, category);
    return { businesses, source: 'mock', count: businesses.length };
  }

  try {
    logger.debug(`Searching Google Places: "${category}" in "${location}"`);
    const businesses = await searchViaGooglePlaces(location, category, maxResults);
    logger.debug(`Found ${businesses.length} businesses`);
    return { businesses, source: 'google_places', count: businesses.length };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error('Google Places API error, falling back to mock data', { error: msg });
    const businesses = getMockBusinesses(location, category);
    return { businesses, source: 'mock', count: businesses.length };
  }
}
