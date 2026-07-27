// The YouTube Data API returns snippet text HTML-escaped, so titles arrive with
// entities baked in ("ASUNA PROVES HE&#39;S A CHAMPION"). React escapes on render,
// so they have to be decoded before they reach the DOM or they show up literally.
const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

const ENTITY_PATTERN = /&(?:#(\d+)|#[xX]([0-9a-fA-F]+)|([a-zA-Z][a-zA-Z0-9]*));/g;

export function decodeHtmlEntities(text: string): string {
  if (!text || !text.includes('&')) return text;

  // Loop because the API occasionally double-escapes ("&amp;#39;").
  let previous: string;
  let decoded = text;
  let passes = 0;
  do {
    previous = decoded;
    decoded = previous.replace(ENTITY_PATTERN, (match, dec, hex, name) => {
      if (dec) return safeFromCodePoint(parseInt(dec, 10), match);
      if (hex) return safeFromCodePoint(parseInt(hex, 16), match);
      const named = NAMED_ENTITIES[name.toLowerCase()];
      return named ?? match;
    });
    passes++;
  } while (decoded !== previous && passes < 3);

  return decoded;
}

function safeFromCodePoint(code: number, fallback: string): string {
  if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) return fallback;
  try {
    return String.fromCodePoint(code);
  } catch {
    return fallback;
  }
}
