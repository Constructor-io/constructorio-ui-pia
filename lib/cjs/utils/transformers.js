"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformResultItem = void 0;
const tslib_1 = require("tslib");
/**
 * Converts a raw ApiItem from the Get Answers API response into an Item object
 * that can be used in the Carousel component.
 */
function transformResultItem(resultItem, formatImageUrl) {
    const { value, matched_terms: matchedTerms, data } = resultItem, otherFields = tslib_1.__rest(resultItem, ["value", "matched_terms", "data"]);
    if (!data || typeof data !== 'object' || !data.id || !value) {
        return null;
    }
    const { id, variation_id: variationId, description, url, image_url: imageUrl, price, sale_price: salePrice, rating, reviews_count: reviewsCount, tags, sl_campaign_id: slCampaignId, sl_campaign_owner: slCampaignOwner, badge } = data, otherMetadataFields = tslib_1.__rest(data, ["id", "variation_id", "description", "url", "image_url", "price", "sale_price", "rating", "reviews_count", "tags", "sl_campaign_id", "sl_campaign_owner", "badge"]);
    // Skip formatting for absent or empty URLs; consumers should handle placeholders separately.
    let formattedImageUrl = imageUrl;
    if (formatImageUrl && imageUrl) {
        try {
            formattedImageUrl = formatImageUrl(imageUrl);
        }
        catch (_a) {
            formattedImageUrl = imageUrl;
        }
    }
    return Object.assign({ id, name: value, matchedTerms,
        variationId,
        description,
        url, imageUrl: formattedImageUrl, price,
        salePrice,
        rating,
        reviewsCount,
        tags,
        slCampaignId,
        slCampaignOwner,
        badge, data: Object.assign({}, otherMetadataFields) }, otherFields);
}
exports.transformResultItem = transformResultItem;
