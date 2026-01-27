import React, { useCallback, useState } from 'react';

export interface ProductCardProps {
  imageUrl: string;
  title: string;
  price?: string;
  onClick?: () => void;
}

function ProductCard({ imageUrl, title, price, onClick }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

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
            aria-label={`Image for ${title}`}
          />
        ) : (
          <img
            className='cio-pia-product-card-image'
            src={imageUrl}
            alt={title}
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
