import React, { useCallback, useState } from 'react';

/**
 * Placeholder icon displayed when product image fails to load
 */
function ImagePlaceholderIcon() {
  return (
    <svg
      width='48'
      height='48'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'>
      <path
        d='M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z'
        fill='#9ca3af'
      />
    </svg>
  );
}

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
 *
 * @example
 * ```tsx
 * <ProductCard
 *   imageUrl="/product.jpg"
 *   title="Product Name"
 *   price="$99.00"
 *   onClick={() => console.log('clicked')}
 * />
 * ```
 *
 * @remarks
 * The component width can be customized using the CSS custom property
 * `--cio-pia-product-card-width` (default: 180px).
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

  const cardClassName = `cio-pia-product-card${onClick ? ' cio-pia-product-card--interactive' : ''}`;

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
            aria-label={`Image for ${title}`}>
            <ImagePlaceholderIcon />
          </div>
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
