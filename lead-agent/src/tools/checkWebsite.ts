import axios from 'axios';
import { logger } from '../utils/logger';

export interface WebsiteCheckResult {
  has_website: boolean;
  website_url: string | null;
  detection_method: 'google_places' | 'domain_guess' | 'not_found';
  confidence: 'high' | 'medium' | 'low';
}

// ── Domain guessing ───────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[''`]/g, '')         // Remove apostrophes
    .replace(/&/g, 'and')          // & → and
    .replace(/[^a-z0-9]+/g, '')   // Remove non-alphanumerics
    .replace(/^(the|a|an)/, '')   // Remove leading articles
    .slice(0, 25);                 // Max 25 chars
}

function generateDomainGuesses(businessName: string, city?: string | null): string[] {
  const nameSlug = slugify(businessName);
  if (!nameSlug) return [];

  const domains: string[] = [];

  // Primary guesses (business name only)
  domains.push(`${nameSlug}.co.za`, `${nameSlug}.com`);

  // With city
  if (city) {
    const citySlug = slugify(city).slice(0, 10);
    if (citySlug) {
      domains.push(`${nameSlug}${citySlug}.co.za`);
    }
  }

  // With 'www'
  domains.push(`www.${nameSlug}.co.za`);

  return [...new Set(domains)]; // Deduplicate
}

async function domainResponds(domain: string): Promise<boolean> {
  const urls = [
    `https://${domain}`,
    `http://${domain}`,
  ];

  for (const url of urls) {
    try {
      const response = await axios.head(url, {
        timeout: 4000,
        maxRedirects: 3,
        validateStatus: (status) => status < 500, // 2xx and 4xx = real website
      });
      if (response.status < 500) return true;
    } catch {
      // Continue to next URL
    }
  }
  return false;
}

// ── Main Function ─────────────────────────────────────────────────────────────

export async function checkWebsite(
  businessName: string,
  googleWebsite: string | null | undefined,
  phone: string | null | undefined,
  address: string | null | undefined,
  city: string | null | undefined
): Promise<WebsiteCheckResult> {
  // ① Google Places already gave us a website — high confidence
  if (googleWebsite && googleWebsite.trim().length > 5) {
    logger.debug(`${businessName}: website from Google Places → ${googleWebsite}`);
    return {
      has_website: true,
      website_url: googleWebsite.trim(),
      detection_method: 'google_places',
      confidence: 'high',
    };
  }

  // ② Try guessing common domain patterns
  const guesses = generateDomainGuesses(businessName, city);
  logger.debug(`${businessName}: checking ${guesses.length} domain guesses`);

  for (const domain of guesses) {
    try {
      const found = await domainResponds(domain);
      if (found) {
        logger.debug(`${businessName}: found via domain guess → ${domain}`);
        return {
          has_website: true,
          website_url: `https://${domain}`,
          detection_method: 'domain_guess',
          confidence: 'medium',
        };
      }
      // Small delay between checks to be respectful
      await new Promise(r => setTimeout(r, 200));
    } catch {
      // Ignore individual domain failures
    }
  }

  // ③ No website found
  return {
    has_website: false,
    website_url: null,
    detection_method: 'not_found',
    confidence: 'high',
  };
}
