import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from '@constructor-io/constructorio-ui-components';
import PiaCustomCarousel from '../../../components/CioPia/PiaCustomCarousel';
import { Item } from '../../../types';

const mockItems: Item[] = [
  {
    id: '1',
    name: 'Trail Running Shoe',
    description: 'Lightweight grip for rough terrain.',
    imageUrl: 'https://placehold.co/200x200?text=Shoe',
    price: 129.99,
    rating: 4.5,
    reviewsCount: 212,
    url: 'https://example.com/products/1',
  },
  {
    id: '2',
    name: 'Waterproof Jacket',
    description: 'Breathable shell for wet weather.',
    imageUrl: 'https://placehold.co/200x200?text=Jacket',
    price: 89.0,
    salePrice: 69.0,
    rating: 4.2,
    reviewsCount: 88,
    url: 'https://example.com/products/2',
  },
  {
    id: '3',
    name: 'Merino Wool Socks',
    description: 'Temperature-regulating, 3-pack.',
    imageUrl: 'https://placehold.co/200x200?text=Socks',
    price: 24.99,
    rating: 4.8,
    reviewsCount: 540,
    url: 'https://example.com/products/3',
  },
  {
    id: '4',
    name: 'Insulated Water Bottle',
    description: 'Keeps drinks cold for 24 hours.',
    imageUrl: 'https://placehold.co/200x200?text=Bottle',
    price: 34.99,
    rating: 4.6,
    reviewsCount: 301,
    url: 'https://example.com/products/4',
  },
  {
    id: '5',
    name: 'Hiking Backpack',
    description: '30L pack with hydration sleeve.',
    imageUrl: 'https://placehold.co/200x200?text=Backpack',
    price: 149.99,
    rating: 4.7,
    reviewsCount: 176,
    url: 'https://example.com/products/5',
  },
  {
    id: '6',
    name: 'Trekking Poles',
    description: 'Collapsible aluminum, pair.',
    imageUrl: 'https://placehold.co/200x200?text=Poles',
    price: 59.99,
    rating: 4.4,
    reviewsCount: 94,
    url: 'https://example.com/products/6',
  },
  {
    id: '7',
    name: 'Headlamp',
    description: 'Rechargeable, 400 lumens.',
    imageUrl: 'https://placehold.co/200x200?text=Headlamp',
    price: 39.99,
    rating: 4.5,
    reviewsCount: 258,
    url: 'https://example.com/products/7',
  },
  {
    id: '8',
    name: 'Quick-Dry Towel',
    description: 'Compact microfiber, large.',
    imageUrl: 'https://placehold.co/200x200?text=Towel',
    price: 19.99,
    rating: 4.3,
    reviewsCount: 132,
    url: 'https://example.com/products/8',
  },
];

const meta = {
  title: 'Components/PiaCustomCarousel',
  component: PiaCustomCarousel,
  parameters: {
    layout: 'centered',
  },
  args: {
    items: mockItems,
    callbacks: { onProductCardClick: fn() },
  },
  decorators: [
    (StoryFn) => (
      <div style={{ width: '1000px', maxWidth: '100%' }}>
        <StoryFn />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof PiaCustomCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The default carousel and product card shipped by the library. Rendered with mock ' +
          'items since the demo server does not return products.',
      },
      source: {
        code: `<PiaCustomCarousel items={items} callbacks={{ onProductCardClick }} />`,
      },
    },
  },
};

export const CustomItem: Story = {
  args: {
    componentOverrides: {
      item: {
        reactNode: ({ item }) => {
          const hasSale = item?.salePrice != null;
          return (
            <div
              data-slot='carousel-item'
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                overflow: 'hidden',
                background: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                fontFamily: 'system-ui, sans-serif',
              }}>
              <div style={{ position: 'relative', background: '#f9fafb' }}>
                {hasSale && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: '#dc2626',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '999px',
                      letterSpacing: '0.02em',
                    }}>
                    SALE
                  </span>
                )}
                {item?.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item?.name}
                    style={{
                      width: '100%',
                      height: '180px',
                      objectFit: 'contain',
                      display: 'block',
                      padding: '16px',
                      boxSizing: 'border-box',
                    }}
                  />
                )}
              </div>
              <div
                style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#111827',
                    margin: 0,
                    lineHeight: 1.3,
                  }}>
                  {item?.name}
                </p>
                {item?.rating != null && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: '#f59e0b', fontSize: '13px', letterSpacing: '1px' }}>
                      {'★'.repeat(Math.round(Number(item.rating)))}
                      <span style={{ color: '#d1d5db' }}>
                        {'★'.repeat(5 - Math.round(Number(item.rating)))}
                      </span>
                    </span>
                    {item?.reviewsCount != null && (
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>
                        ({item.reviewsCount})
                      </span>
                    )}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>
                    ${hasSale ? item?.salePrice : item?.price}
                  </span>
                  {hasSale && (
                    <span
                      style={{
                        fontSize: '13px',
                        color: '#9ca3af',
                        textDecoration: 'line-through',
                      }}>
                      ${item?.price}
                    </span>
                  )}
                </div>
                <button
                  type='button'
                  style={{
                    marginTop: '4px',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#111827',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}>
                  Add to bag
                </button>
              </div>
            </div>
          );
        },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Replace each product card entirely via `item.reactNode`. Receives `{ item }`. ' +
          'This example renders a fully styled card with a sale badge, star rating, and add-to-cart button. ' +
          'Note the `data-slot="carousel-item"` on the root — the carousel sizes each slide by targeting ' +
          'that attribute, so a custom card must carry it (plus `width: 100%`) to keep the 4-per-page layout.',
      },
      source: {
        code: `<PiaCustomCarousel
  items={items}
  componentOverrides={{
    item: {
      reactNode: ({ item }) => {
        const hasSale = item?.salePrice != null;
        return (
          // data-slot lets the card inherit the carousel's per-slide width
          <div className="my-product-card" data-slot="carousel-item" style={{ width: '100%' }}>
            <div className="my-product-card__media">
              {hasSale && <span className="my-product-card__badge">SALE</span>}
              {item?.imageUrl && <img src={item.imageUrl} alt={item?.name} />}
            </div>
            <div className="my-product-card__body">
              <p className="my-product-card__title">{item?.name}</p>
              {item?.rating != null && (
                <div className="my-product-card__rating">
                  {'★'.repeat(Math.round(Number(item.rating)))}
                  <span>({item?.reviewsCount})</span>
                </div>
              )}
              <div className="my-product-card__price">
                <span>\${hasSale ? item?.salePrice : item?.price}</span>
                {hasSale && <s>\${item?.price}</s>}
              </div>
              <button type="button">Add to bag</button>
            </div>
          </div>
        );
      },
    },
  }}
/>`,
      },
    },
  },
};

export const CustomNavigation: Story = {
  args: {
    componentOverrides: {
      previous: {
        reactNode: ({ scrollPrev, canScrollPrev }) => (
          <button
            type='button'
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            style={{
              padding: '8px 12px',
              borderRadius: '50%',
              border: '1px solid #d1d5db',
              background: '#fff',
              cursor: canScrollPrev ? 'pointer' : 'not-allowed',
              opacity: canScrollPrev ? 1 : 0.4,
              fontSize: '16px',
            }}>
            &#8592;
          </button>
        ),
      },
      next: {
        reactNode: ({ scrollNext, canScrollNext }) => (
          <button
            type='button'
            onClick={scrollNext}
            disabled={!canScrollNext}
            style={{
              padding: '8px 12px',
              borderRadius: '50%',
              border: '1px solid #d1d5db',
              background: '#fff',
              cursor: canScrollNext ? 'pointer' : 'not-allowed',
              opacity: canScrollNext ? 1 : 0.4,
              fontSize: '16px',
            }}>
            &#8594;
          </button>
        ),
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Replace the previous/next navigation buttons via `previous` and `next`.',
      },
      source: {
        code: `<PiaCustomCarousel
  items={items}
  componentOverrides={{
    previous: {
      reactNode: ({ scrollPrev, canScrollPrev }) => (
        <button className="my-prev" onClick={scrollPrev} disabled={!canScrollPrev}>
          &#8592;
        </button>
      ),
    },
    next: {
      reactNode: ({ scrollNext, canScrollNext }) => (
        <button className="my-next" onClick={scrollNext} disabled={!canScrollNext}>
          &#8594;
        </button>
      ),
    },
  }}
/>`,
      },
    },
  },
};

export const CustomProductCardSubComponents: Story = {
  args: {
    componentOverrides: {
      item: {
        productCard: {
          image: {
            wishlistButton: {
              reactNode: ({ product, isInWishlist, onAddToWishlist }) => (
                <button
                  type='button'
                  aria-label={isInWishlist ? 'Remove from favorites' : 'Add to favorites'}
                  onClick={(e) => onAddToWishlist?.(e, product)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid #e5e7eb',
                    background: '#fff',
                    color: isInWishlist ? '#dc2626' : '#6b7280',
                    cursor: 'pointer',
                    fontSize: '16px',
                    lineHeight: 1,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  }}>
                  {isInWishlist ? '♥' : '♡'}
                </button>
              ),
            },
          },
          content: {
            title: {
              reactNode: ({ product }) => (
                <p style={{ fontSize: '14px', fontWeight: 600, margin: '8px 0 4px' }}>
                  {product?.name}
                </p>
              ),
            },
            price: {
              reactNode: ({ product }) =>
                product?.price ? (
                  <span style={{ color: '#16a34a', fontWeight: 700 }}>${product.price}</span>
                ) : null,
            },
          },
          footer: {
            addToCartButton: {
              reactNode: ({ product, onAddToCart }) => (
                <Button
                  variant='default'
                  size='sm'
                  conversionType='add_to_cart'
                  onClick={(e) => onAddToCart?.(e, product)}>
                  Add to bag
                </Button>
              ),
            },
          },
        },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Keep the default card but override individual parts via `item.productCard` — here the ' +
          'favorite (wishlist) button, title, price, and add-to-cart button. Each slot receives ' +
          '`ProductCardProps`, so the favorite button gets `isInWishlist` plus the `onAddToWishlist` ' +
          'handler, and the add-to-cart button gets `onAddToCart`. The add-to-cart override reuses the ' +
          'library `Button` (imported from `@constructor-io/constructorio-ui-components`) so it matches ' +
          'the design system. ' +
          'See the [ProductCard best practices](https://constructor-io.github.io/constructorio-ui-components/?path=/docs/components-productcard--best-practices) and ' +
          '[Carousel best practices](https://constructor-io.github.io/constructorio-ui-components/?path=/docs/components-carousel--best-practices) for more details.',
      },
      source: {
        code: `import { Button } from '@constructor-io/constructorio-ui-components';

<PiaCustomCarousel
            items={items}
            componentOverrides={{
              item: {
                productCard: {
                  image: {
                    wishlistButton: {
                      reactNode: ({ product, isInWishlist, onAddToWishlist }) => (
                        <button
                          aria-label={isInWishlist ? 'Remove from favorites' : 'Add to favorites'}
                          onClick={(e) => onAddToWishlist?.(e, product)}>
                          {isInWishlist ? '♥' : '♡'}
                        </button>
                      ),
                    },
                  },
                  content: {
                    title: {
                      reactNode: ({ product }) => <p className="my-title">{product?.name}</p>,
                    },
                    price: {
                      reactNode: ({ product }) => <span className="my-price">\${product?.price}</span>,
                    },
                  },
                  footer: {
                    addToCartButton: {
                      reactNode: ({ product, onAddToCart }) => (
                        <Button
                          variant="default"
                          size="sm"
                          conversionType="add_to_cart"
                          onClick={(e) => onAddToCart?.(e, product)}>
                          Add to bag
                        </Button>
                      ),
                    },
                  },
                },
              },
            }}
          />`,
      },
    },
  },
};
