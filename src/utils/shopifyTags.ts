export interface TagBadge {
  text: string;
  bg: string;
  color: string;
  type?: string;
}

/**
 * Helper function to check if a tag matches (case-insensitive)
 */
function hasTag(tags: string[], ...searchTerms: string[]): boolean {
  if (!tags || !Array.isArray(tags)) return false;
  const lowerTags = tags.map(t => (t || '').toLowerCase().replace(/[_-\s]/g, ''));
  const lowerSearches = searchTerms.map(s => (s || '').toLowerCase().replace(/[_-\s]/g, ''));
  return lowerTags.some(tag => lowerSearches.some(search => tag.includes(search)));
}

/**
 * Returns the highest-priority tag badge definition for a Shopify product based on its tags.
 * Priority order:
 * 1. "new-collection" -> New
 * 2. "limited-edition" -> Limited
 * 3. "bestseller" -> Bestseller
 * 4. "sale" -> Sale
 * 5. "trending" -> Trending
 * 
 * @param tags - Array of product tags from Shopify
 * @returns TagBadge object or null if no valid tag matches.
 */
export function getTagBadge(tags: string[]): TagBadge | null {
  if (!tags || !Array.isArray(tags)) {
    return null;
  }

  if (hasTag(tags, 'new', 'collection')) {
    return { text: 'New', bg: '#0A0A0A', color: '#FFFFFF', type: 'new' };
  }
  if (hasTag(tags, 'limited', 'edition')) {
    return { text: 'Limited', bg: '#8b0026', color: '#FFFFFF', type: 'limited' };
  }
  if (hasTag(tags, 'bestseller')) {
    return { text: 'Bestseller', bg: '#27AE60', color: '#FFFFFF', type: 'bestseller' };
  }
  if (hasTag(tags, 'sale')) {
    return { text: 'Sale', bg: '#F59E0B', color: '#FFFFFF', type: 'sale' };
  }
  if (hasTag(tags, 'trending')) {
    return { text: 'Trending', bg: '#525252', color: '#FFFFFF', type: 'trending' };
  }

  return null;
}

/**
 * Returns all applicable tag badges for a Shopify product based on its tags.
 * Returns an array of all matching badges in priority order.
 * Max 2 badges — New Collection & Limited Edition take priority.
 * 
 * @param tags - Array of product tags from Shopify
 * @returns Array of TagBadge objects
 */
export function getTagBadges(tags: string[]): TagBadge[] {
  if (!tags || !Array.isArray(tags)) {
    return [];
  }

  const badges: TagBadge[] = [];

  if (hasTag(tags, 'new', 'collection')) {
    badges.push({ text: 'New', bg: '#0A0A0A', color: '#FFFFFF', type: 'new' });
  }
  if (hasTag(tags, 'limited', 'edition')) {
    badges.push({ text: 'Limited', bg: '#8b0026', color: '#FFFFFF', type: 'limited' });
  }
  if (hasTag(tags, 'bestseller')) {
    badges.push({ text: 'Hot Pick', bg: '#27AE60', color: '#FFFFFF', type: 'bestseller' });
  }
  if (hasTag(tags, 'sale')) {
    badges.push({ text: 'Sale', bg: '#F59E0B', color: '#1a1a1a', type: 'sale' });
  }
  if (hasTag(tags, 'trending')) {
    badges.push({ text: 'Trend', bg: '#525252', color: '#FFFFFF', type: 'trending' });
  }
  // Custom tags like "Founder's Favourite" - now case-insensitive
  if (hasTag(tags, 'founder', 'favourite')) {
    badges.push({ text: 'Founder', bg: '#C9A84C', color: '#FFFFFF', type: 'founders' });
  }

  // Fallback: show any remaining backend tags that didn't match a known pattern
  const knownPatterns = ['new', 'collection', 'limited', 'edition', 'bestseller', 'sale', 'trending', 'founder', 'favourite'];
  const usedTypes = new Set(badges.map(b => b.type));

  for (const tag of tags) {
    if (!tag) continue;
    const normalised = tag.toLowerCase().replace(/[_\-\s]/g, '');
    const isKnown = knownPatterns.some(p => normalised.includes(p.replace(/[_\-\s]/g, '')));
    if (!isKnown && !usedTypes.has(normalised)) {
      // Truncate unknown tags tightly to 6 chars max
      const rawLabel = tag
        .replace(/[_\-]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
        .trim();
      const label = rawLabel.length > 6 ? rawLabel.slice(0, 5).trimEnd() + '…' : rawLabel;
      badges.push({ text: label, bg: '#3D3D3D', color: '#FFFFFF', type: normalised });
      usedTypes.add(normalised);
    }
  }

  // Return max 2 badges — keeps the card clean, priority slots filled by New / Limited
  return badges.slice(0, 2);
}
