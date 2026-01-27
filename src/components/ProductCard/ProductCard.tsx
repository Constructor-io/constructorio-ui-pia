import React from 'react';

export interface ProductCardProps {
  imageUrl: string;
  title: string;
  price: string;
  onClick?: () => void;
}

function ProductCard({ imageUrl, title, price, onClick }: ProductCardProps) {
  return (
    <div
      className='cio-pia-product-card'
      data-testid='product-card'
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <div className='cio-pia-product-card-image-container'>
        <img
          className='cio-pia-product-card-image'
          src={imageUrl}
          alt={title}
        />
      </div>
      <div className='cio-pia-product-card-content'>
        <p className='cio-pia-product-card-title' title={title}>
          {title}
        </p>
        <p className='cio-pia-product-card-price'>{price}</p>
      </div>
    </div>
  );
}

export default ProductCard;
