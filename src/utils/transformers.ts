/* eslint-disable import/prefer-default-export */
import { Nullable } from '@constructor-io/constructorio-client-javascript';
import { Item, ApiItem } from '../types';

/**
 * Converts a raw ApiItem from the Get Answers API response into an Item object
 * that can be used in the Carousel component.
 */
export function transformResultItem(resultItem: ApiItem): Nullable<Item> {
  const { value, matched_terms: matchedTerms, data, ...otherFields } = resultItem;

  if (!data || !data.id || !value) {
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

  return {
    id,
    name: value,
    matchedTerms,
    variationId,
    description,
    url,
    imageUrl,
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
