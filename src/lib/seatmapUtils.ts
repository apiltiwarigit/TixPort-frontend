// Seat-map utility functions for Ticket Evolution integration

export type TevoListing = {
  id: number;
  type: string; // 'event', 'parking', etc.
  tevo_section_name?: string | null;
  retail_price?: number;
  retail_price_inclusive?: number;
  available_quantity?: number;
  section?: string | null;
  row?: string | null;
};

export type SeatmapTicketGroup = {
  tevo_section_name: string;
  retail_price: number;
};

/**
 * Builds seat-map ticket groups from listings data
 * @param listings Array of ticket listings from the API
 * @param useInclusive Whether to use inclusive pricing
 * @returns Array of ticket groups formatted for the seat-map component
 */
export function buildSeatmapTicketGroups(
  listings: TevoListing[],
  useInclusive: boolean
): SeatmapTicketGroup[] {
  return listings
    .filter(l => l?.type === 'event' && !!l?.tevo_section_name)
    // IMPORTANT: one element per listing; no dedupe by section
    .map(l => ({
      tevo_section_name: String(l.tevo_section_name!).toLowerCase(),
      retail_price: Number(
        useInclusive
          ? (l.retail_price_inclusive ?? l.retail_price)
          : (l.retail_price ?? l.retail_price_inclusive)
      )
    }))
    // Filter out any malformed entries
    .filter(x => Number.isFinite(x.retail_price));
}

/**
 * Normalizes section names to lowercase for consistent comparison
 * @param sectionName The section name to normalize
 * @returns Lowercase section name
 */
export function normalizeSectionName(sectionName: string | null | undefined): string {
  return String(sectionName || '').toLowerCase();
}
