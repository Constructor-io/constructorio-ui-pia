import { Item, RecsResult } from '../types';

/**
 * Stand-in responses for the recommendations stories.
 *
 * The endpoint that returns a short title and refinement options is not deployed yet, so these are
 * what we expect it to send. Every title and every option here belongs to the API, which is why it
 * lives in a fixture - what the pod supplies when a response carries none of its own is in
 * `constants.ts` instead.
 */

interface ProductSpec {
  name: string;
  price: number;
  description: string;
  salePrice?: number;
}

/**
 * The image is generated from the name, so a card can never show one product and name another.
 * url takes the caption in the query string and reads `+` as a space.
 */
const buildItems = (groupId: string, specs: ProductSpec[]): Item[] =>
  specs.map(({ name, price, description, salePrice }, index) => {
    const id = `${groupId}-${index + 1}`;

    return {
      id,
      name,
      price,
      salePrice,
      description,
      imageUrl: `https://placehold.co/200x200?text=${name.replace(/ /g, '+')}`,
      url: `https://example.com/products/${id}`,
    };
  });

const complete = (
  title: string,
  items: Item[],
  options: string[],
  question?: string,
): RecsResult => ({
  title,
  items,
  refinement: { question, options },
  resultId: 'story-result-id',
  threadId: '550e8400-e29b-41d4-a716-446655440000',
  status: 'complete',
});

/**
 * Four responses that share no title, no product and no option, cycled through one per request.
 *
 * Being wholly different is the point: a refinement that returned the same three things would look
 * like a pod that had ignored the shopper, which is exactly how a stub that repeated itself used to
 * read.
 *
 * Seven products a response, here and in the two single responses below, because an arrow with
 * nothing to do is hidden but still holds its place - which reads as an unexplained gap beside the
 * cards. Six is one short: the carousel fits six across at its widest, and the sliver left over is
 * not enough for it to wrap around, so the back arrow stays hidden. The seventh earns both arrows.
 */
export const RECS_GROUPS: RecsResult[] = [
  complete(
    'Since you liked this jacket, these go well with it',
    buildItems('pairs', [
      { name: 'Denim Jacket', price: 89, description: 'Mid-wash, boxy fit.' },
      { name: 'Cotton Shirt', price: 39, description: 'Button-down, everyday weight.' },
      { name: 'Wool Scarf', price: 24, description: 'Lambswool, fringed ends.' },
      {
        name: 'Leather Boots',
        price: 149,
        salePrice: 119,
        description: 'Ankle height, rubber sole.',
      },
      { name: 'Canvas Tote', price: 34, description: 'Heavy duck, leather handles.' },
      { name: 'Selvedge Jeans', price: 119, description: 'Raw denim, straight leg.' },
      { name: 'Ribbed Socks', price: 16, description: 'Combed cotton, 3-pack.' },
    ]),
    ['Warmer', 'Under $50', 'Something lighter'],
    'Not quite what you want? Try:',
  ),
  complete(
    'Warmer picks for cold weather',
    buildItems('warmer', [
      { name: 'Puffer Coat', price: 199, description: 'Down-filled, water-repellent shell.' },
      { name: 'Fleece Hoodie', price: 59, description: 'Brushed inside, full zip.' },
      { name: 'Knit Beanie', price: 19, description: 'Ribbed, one size.' },
      { name: 'Thermal Socks', price: 14, description: 'Merino blend, 2-pack.' },
      { name: 'Lined Mittens', price: 29, description: 'Fleece lined, elastic cuff.' },
      { name: 'Wool Slippers', price: 74, description: 'Suede upper, felted lining.' },
      { name: 'Down Vest', price: 109, description: 'Baffled channels, snap front.' },
    ]),
    ['Waterproof', 'Under $100', 'Something dressier'],
  ),
  complete(
    'Waterproof options for wet days',
    buildItems('waterproof', [
      { name: 'Rain Shell', price: 129, description: 'Taped seams, packs into its pocket.' },
      { name: 'Rubber Boots', price: 79, description: 'Knee height, cotton lining.' },
      { name: 'Packable Poncho', price: 34, salePrice: 27, description: 'One size, hooded.' },
      { name: 'Waxed Cap', price: 29, description: 'Six-panel, waxed cotton.' },
      { name: 'Dry Bag', price: 39, description: 'Roll-top closure, 20 litres.' },
      { name: 'Rain Trousers', price: 89, description: 'Full side zips, taped seams.' },
      { name: 'Sealed Backpack', price: 99, description: 'Welded seams, 24 litres.' },
    ]),
    ['Warmer', 'Something lighter', 'Best sellers'],
  ),
  complete(
    'Lighter layers for milder days',
    buildItems('lighter', [
      { name: 'Linen Shirt', price: 49, description: 'Relaxed fit, breathable.' },
      { name: 'Chino Pants', price: 69, description: 'Straight leg, stretch cotton.' },
      { name: 'Canvas Sneakers', price: 74, description: 'Low top, rubber sole.' },
      { name: 'Cotton Cardigan', price: 59, description: 'Fine knit, mother-of-pearl buttons.' },
      { name: 'Poplin Shorts', price: 44, description: 'Above the knee, elastic waist.' },
      { name: 'Woven Espadrilles', price: 52, description: 'Jute sole, canvas upper.' },
      { name: 'Gauze Shirt', price: 58, description: 'Double gauze, camp collar.' },
    ]),
    ['Warmer', 'Under $50', 'Waterproof'],
  ),
];

/** A shopper the API has nothing personal to go on. The API decides, and the library does not. */
export const RECS_TRENDING: RecsResult = complete(
  'Trending right now',
  buildItems('trending', [
    { name: 'Oversized Hoodie', price: 69, description: 'Dropped shoulder, heavy loopback.' },
    { name: 'Cargo Pants', price: 89, description: 'Utility pockets, elastic hem.' },
    { name: 'Bucket Hat', price: 32, description: 'Cotton twill, reversible.' },
    { name: 'Chunky Sneakers', price: 129, description: 'Layered sole, leather upper.' },
    { name: 'Shoulder Bag', price: 79, description: 'Webbing strap, zip top.' },
    { name: 'Track Jacket', price: 94, description: 'Piped sleeves, stand collar.' },
    { name: 'Mesh Cap', price: 26, description: 'Trucker panel, curved brim.' },
  ]),
  ['Best sellers', 'New arrivals'],
);

/**
 * For the story that configures `numResults: 6` and `strategy: 'alternative_items'`. Six, so it
 * holds the parameter honestly - which is also what makes it the one story whose back arrow starts
 * hidden.
 *
 * None of these carries a title, which is what makes `defaultTitle` visible: a response that
 * carried one of its own would be preferred over it.
 */
export const RECS_SIX_GROUPS: RecsResult[] = [
  complete(
    '',
    buildItems('six-warm', [
      { name: 'Quilted Vest', price: 99, description: 'Diamond quilt, snap front.' },
      { name: 'Corduroy Jacket', price: 139, description: 'Wide wale, blanket lining.' },
      { name: 'Flannel Shirt', price: 54, description: 'Brushed cotton, check.' },
      { name: 'Merino Sweater', price: 119, description: 'Crew neck, fine gauge.' },
      { name: 'Leather Gloves', price: 64, description: 'Lambskin, cashmere lined.' },
      { name: 'Wool Trousers', price: 149, description: 'Pleated front, tapered.' },
    ]),
    ['Warmer', 'Under $100', 'Best sellers'],
  ),
  complete(
    '',
    buildItems('six-dressy', [
      { name: 'Tweed Blazer', price: 229, description: 'Herringbone, half lined.' },
      { name: 'Ribbed Turtleneck', price: 89, description: 'Merino, close fit.' },
      { name: 'Suede Boots', price: 179, description: 'Chelsea cut, crepe sole.' },
      { name: 'Cashmere Scarf', price: 109, description: 'Two-ply, hand finished.' },
      { name: 'Pleated Skirt', price: 94, description: 'Knife pleats, midi length.' },
      { name: 'Silk Shirt', price: 129, description: 'Concealed placket, French cuffs.' },
    ]),
    ['Under $100', 'Something lighter', 'New arrivals'],
  ),
];
