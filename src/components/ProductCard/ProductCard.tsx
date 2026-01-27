import React, { useCallback, useState } from 'react';

/**
 * Props for the ProductCard component
 */
export interface ProductCardProps {
  /** URL of the product image to display */
  imageUrl: string;
  /** Product title/name */
  title: string;
  /** Optional product price to display below the title */
  price?: string;
  /** Optional callback function when the card is clicked */
  onClick?: () => void;
}

/**
 * A product card component that displays product image, title, and price.
 * Supports optional click interactions with full keyboard accessibility.
 */
function ProductCard({ imageUrl, title, price, onClick }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (onClick && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onClick();
      }
    },
    [onClick],
  );

  const cardClassName = ['cio-pia-product-card', onClick && 'cio-pia-product-card--interactive']
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={cardClassName}
      data-testid='product-card'
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? handleKeyDown : undefined}>
      <div className='cio-pia-product-card-image-container'>
        {imageError ? (
          <div
            className='cio-pia-product-card-image-fallback'
            data-testid='product-card-image-fallback'
            role='img'
            aria-label={`Image for ${title}`}
          />
        ) : (
          <img
            className='cio-pia-product-card-image'
            src={imageUrl}
            alt={title}
            loading='lazy'
            onError={handleImageError}
          />
        )}
      </div>
      <div className='cio-pia-product-card-content'>
        <p className='cio-pia-product-card-title' title={title}>
          {title}
        </p>
        {price && <p className='cio-pia-product-card-price'>{price}</p>}
      </div>
    </div>
  );
}

export default ProductCard;
