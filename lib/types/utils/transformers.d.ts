import { Nullable } from '@constructor-io/constructorio-client-javascript';
import { Formatters, Item, ApiItem } from '../types';
/**
 * Converts a raw ApiItem from the Get Answers API response into an Item object
 * that can be used in the Carousel component.
 */
export declare function transformResultItem(resultItem: ApiItem, formatImageUrl?: Formatters['formatImageUrl']): Nullable<Item>;
