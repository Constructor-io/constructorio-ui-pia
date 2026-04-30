/* eslint-disable import/prefer-default-export */
import { Nullable } from '@constructor-io/constructorio-client-javascript';
import { Formatters, Item, ApiItem } from '../types';

/**
 * Converts a raw ApiItem from the Get Answers API response into an Item object
 * that can be used in the Carousel component.
 */
export function transformResultItem(
  resultItem: ApiItem,
  formatImageUrl?: Formatters['formatImageUrl'],
): Nullable<Item> {
  const { value, matched_terms: matchedTerms, data, ...otherFields } = resultItem;

  if (!data || typeof data !== 'object' || !data.id || !value) {
    return null;
  }

  const {
    id,
    variation_id: variationId,
    description,
    url,
    image_url: imageUrl,
    price,
    sale_price: salePrice,
    rating,
    reviews_count: reviewsCount,
    tags,
    sl_campaign_id: slCampaignId,
    sl_campaign_owner: slCampaignOwner,
    badge,
    ...otherMetadataFields
  } = data;

  // Skip formatting for absent or empty URLs; consumers should handle placeholders separately.
  let formattedImageUrl = imageUrl;
  if (formatImageUrl && imageUrl) {
    try {
      formattedImageUrl = formatImageUrl(imageUrl);
    } catch {
      formattedImageUrl = imageUrl;
    }
  }

  return {
    id,
    name: value,
    matchedTerms,
    variationId,
    description,
    url,
    imageUrl: formattedImageUrl,
    price,
    salePrice,
    rating,
    reviewsCount,
    tags,
    slCampaignId,
    slCampaignOwner,
    badge,
    data: { ...otherMetadataFields },
    ...otherFields,
  };
}
