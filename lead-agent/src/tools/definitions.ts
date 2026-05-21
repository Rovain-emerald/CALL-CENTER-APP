import Anthropic from '@anthropic-ai/sdk';

/**
 * Tool schemas for the Claude agentic loop.
 * Each tool maps to a handler in tools/index.ts.
 */
export const toolDefinitions: Anthropic.Tool[] = [
  {
    name: 'search_businesses',
    description:
      'Search Google Places (or mock data) for businesses in a specific location and category. ' +
      'Returns a list of businesses with their contact details, rating, and whether they have a website. ' +
      'Use this as the first step in every research cycle.',
    input_schema: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'City and country, e.g. "Johannesburg, South Africa" or "Cape Town, South Africa"',
        },
        category: {
          type: 'string',
          description: 'Type of business, e.g. "plumber", "electrician", "hair salon", "restaurant"',
        },
        radius_km: {
          type: 'number',
          description: 'Search radius in kilometres (default: 10)',
        },
      },
      required: ['location', 'category'],
    },
  },
  {
    name: 'check_website',
    description:
      'Check whether a specific business has a website. ' +
      'First checks data from Google Places, then tries common domain name patterns. ' +
      'Only call this if google_website is null/empty — skip it for businesses that already have one.',
    input_schema: {
      type: 'object',
      properties: {
        business_name: {
          type: 'string',
          description: 'Full name of the business',
        },
        google_website: {
          type: 'string',
          description: 'Website URL from Google Places (pass null or empty string if none)',
        },
        phone: {
          type: 'string',
          description: 'Phone number of the business (optional, used for context)',
        },
        address: {
          type: 'string',
          description: 'Full street address of the business',
        },
        city: {
          type: 'string',
          description: 'City where the business is located',
        },
      },
      required: ['business_name'],
    },
  },
  {
    name: 'score_lead',
    description:
      'Score a business as a sales lead for web development and automation services. ' +
      'Returns a score 0-100, a priority (hot/warm/cold), and specific automation opportunities. ' +
      'Call this for every business that lacks a website.',
    input_schema: {
      type: 'object',
      properties: {
        business_name: {
          type: 'string',
          description: 'Name of the business',
        },
        category: {
          type: 'string',
          description: 'Type/category of the business',
        },
        has_website: {
          type: 'boolean',
          description: 'Whether the business has a website',
        },
        rating: {
          type: 'number',
          description: 'Google rating (0.0 – 5.0)',
        },
        review_count: {
          type: 'number',
          description: 'Number of Google reviews',
        },
        has_phone: {
          type: 'boolean',
          description: 'Whether the business has a phone number listed',
        },
        is_operational: {
          type: 'boolean',
          description: 'Whether the business is currently open/operational',
        },
      },
      required: ['business_name', 'category', 'has_website'],
    },
  },
  {
    name: 'save_lead',
    description:
      'Save a qualified lead to the database. ' +
      'Only save leads with a score >= 40. ' +
      'Returns success/failure and the database ID.',
    input_schema: {
      type: 'object',
      properties: {
        business_name:   { type: 'string', description: 'Name of the business' },
        phone:           { type: 'string', description: 'Phone number' },
        address:         { type: 'string', description: 'Full address' },
        city:            { type: 'string', description: 'City' },
        category:        { type: 'string', description: 'Business category' },
        google_place_id: { type: 'string', description: 'Google Place ID (for deduplication)' },
        website:         { type: 'string', description: 'Website URL if they have one, else null' },
        has_website:     { type: 'boolean', description: 'Whether the business has a website' },
        rating:          { type: 'number',  description: 'Google rating' },
        review_count:    { type: 'number',  description: 'Number of reviews' },
        score:           { type: 'number',  description: 'Lead score 0-100 from score_lead' },
        automation_needs: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of automation opportunities from score_lead',
        },
        priority: {
          type: 'string',
          enum: ['hot', 'warm', 'cold'],
          description: 'Priority tier from score_lead',
        },
        notes: { type: 'string', description: 'Any additional notes' },
      },
      required: ['business_name', 'category', 'has_website', 'score', 'priority'],
    },
  },
  {
    name: 'get_search_stats',
    description:
      'Get statistics about previous searches and total leads in the database. ' +
      'Use this at the start of a cycle to avoid duplicate searches.',
    input_schema: {
      type: 'object',
      properties: {
        days: {
          type: 'number',
          description: 'How many days back to look (default: 7)',
        },
      },
    },
  },
  {
    name: 'generate_report',
    description:
      'Generate a summary report of all leads found on a given date. ' +
      'Use this when asked for a report or daily summary.',
    input_schema: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'Date in YYYY-MM-DD format (defaults to today)',
        },
      },
    },
  },
];
