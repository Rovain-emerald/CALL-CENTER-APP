import { searchBusinesses }  from './searchBusinesses';
import { checkWebsite }      from './checkWebsite';
import { scoreLead }         from './scoreLead';
import { saveLead }          from './saveLead';
import { getSearchStats }    from './getSearchStats';
import { generateReport }    from './generateReport';
import { logger }            from '../utils/logger';

export { toolDefinitions } from './definitions';

/**
 * Central dispatcher — routes Claude's tool_use requests to the correct
 * handler and returns a JSON-serialisable result.
 */
export async function handleToolCall(
  name: string,
  input: Record<string, unknown>
): Promise<unknown> {
  logger.debug(`Tool call: ${name}`, { input });

  switch (name) {
    case 'search_businesses':
      return searchBusinesses(
        String(input.location ?? ''),
        String(input.category ?? ''),
        typeof input.radius_km === 'number' ? input.radius_km : 10
      );

    case 'check_website':
      return checkWebsite(
        String(input.business_name ?? ''),
        input.google_website as string | null | undefined,
        input.phone            as string | null | undefined,
        input.address          as string | null | undefined,
        input.city             as string | null | undefined
      );

    case 'score_lead':
      return scoreLead(input);

    case 'save_lead':
      return saveLead({
        business_name:    String(input.business_name ?? ''),
        phone:            input.phone            as string | null,
        address:          input.address          as string | null,
        city:             input.city             as string | null,
        category:         String(input.category  ?? ''),
        google_place_id:  input.google_place_id  as string | null,
        website:          input.website          as string | null,
        has_website:      Boolean(input.has_website),
        rating:           input.rating           as number | null,
        review_count:     input.review_count     as number | null,
        score:            Number(input.score     ?? 0),
        automation_needs: input.automation_needs as string | string[],
        priority:         (input.priority as 'hot' | 'warm' | 'cold') ?? 'cold',
        notes:            input.notes            as string | null,
      });

    case 'get_search_stats':
      return getSearchStats(
        typeof input.days === 'number' ? input.days : 7
      );

    case 'generate_report':
      return generateReport(input.date as string | undefined);

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
