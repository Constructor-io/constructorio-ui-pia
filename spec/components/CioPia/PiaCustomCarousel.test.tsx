import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import PiaCustomCarousel from '../../../src/components/CioPia/PiaCustomCarousel';

jest.mock('@constructor-io/constructorio-ui-components', () => ({
  Carousel: ({ items, componentOverrides }) => (
    <div data-testid='mock-carousel' data-overrides={JSON.stringify(componentOverrides)}>
      {items.map((item) => {
        const Description =
          componentOverrides?.item?.productCard?.content?.description?.reactNode;
        const Price = componentOverrides?.item?.productCard?.content?.price?.reactNode;
        return (
          <div key={item.id} data-testid={`carousel-item-${item.id}`}>
            {Description && <Description product={item} />}
            {Price && <Price product={item} />}
          </div>
        );
      })}
    </div>
  ),
  CIO_EVENTS: { productCard: { click: 'cio:product-card:click' } },
}));

const mockItems = [
  { id: '1', name: 'Product 1', description: '<b>Bold</b> description', price: 29.99 },
  { id: '2', name: 'Product 2', description: undefined, price: 49.99, salePrice: 39.99 },
  { id: '3', name: 'Product 3', description: 'Plain text' },
];

describe('PiaCustomCarousel', () => {
  describe('HTML description rendering', () => {
    it('renders product descriptions as sanitized HTML by default', () => {
      const { getByTestId } = render(<PiaCustomCarousel items={mockItems} />);
      const item1 = getByTestId('carousel-item-1');
      const description = item1.querySelector('.cio-product-card-description');
      expect(description).toBeInTheDocument();
      expect(description!.innerHTML).toBe('<b>Bold</b> description');
    });

    it('does not render description when product description is undefined', () => {
      const { getByTestId } = render(<PiaCustomCarousel items={mockItems} />);
      const item2 = getByTestId('carousel-item-2');
      expect(item2.querySelector('.cio-product-card-description')).not.toBeInTheDocument();
    });

    it('strips dangerous HTML from descriptions', () => {
      const items = [
        { id: '1', name: 'Product', description: '<p>Safe</p><script>alert("xss")</script>' },
      ];
      const { getByTestId } = render(<PiaCustomCarousel items={items} />);
      const description = getByTestId('carousel-item-1').querySelector(
        '.cio-product-card-description',
      );
      expect(description!.innerHTML).toBe('<p>Safe</p>');
    });

    it('preserves user-provided description override', () => {
      const CustomDescription = ({ product }: { product: { name: string } }) => (
        <span data-testid='custom-desc'>{product.name}</span>
      );

      const overrides = {
        item: {
          productCard: {
            content: {
              description: { reactNode: CustomDescription },
            },
          },
        },
      };

      const { getAllByTestId, getByTestId } = render(
        <PiaCustomCarousel items={mockItems} componentOverrides={overrides} />,
      );

      const customDescriptions = getAllByTestId('custom-desc');
      expect(customDescriptions[0]).toHaveTextContent('Product 1');
      expect(
        getByTestId('carousel-item-1').querySelector('.cio-product-card-description'),
      ).not.toBeInTheDocument();
    });

    it('preserves other overrides when injecting default description', () => {
      const CustomTitle = () => <span data-testid='custom-title'>Title</span>;

      const overrides = {
        item: {
          productCard: {
            content: {
              title: { reactNode: CustomTitle },
            },
          },
        },
      };

      const { getByTestId } = render(
        <PiaCustomCarousel items={mockItems} componentOverrides={overrides} />,
      );

      const parsed = JSON.parse(getByTestId('mock-carousel').getAttribute('data-overrides')!);
      expect(parsed.item.productCard.content.title).toBeDefined();
      expect(parsed.item.productCard.content.description).toBeDefined();
    });
  });

  describe('priceCurrency rendering', () => {
    it('does not inject a price override when priceCurrency is not provided', () => {
      const { getByTestId } = render(<PiaCustomCarousel items={mockItems} />);
      const parsed = JSON.parse(getByTestId('mock-carousel').getAttribute('data-overrides')!);
      expect(parsed.item.productCard.content.price).toBeUndefined();
    });

    it('renders price with custom currency symbol', () => {
      const { getByTestId } = render(
        <PiaCustomCarousel items={mockItems} priceCurrency='€' />,
      );
      const item1 = getByTestId('carousel-item-1');
      const priceSection = item1.querySelector('.cio-product-card-price-section');
      expect(priceSection).toBeInTheDocument();
      expect(priceSection).toHaveTextContent('€');
      expect(priceSection).toHaveTextContent('29.99');
    });

    it('renders sale price with strikethrough when salePrice exists', () => {
      const { getByTestId } = render(
        <PiaCustomCarousel items={mockItems} priceCurrency='£' />,
      );
      const item2 = getByTestId('carousel-item-2');
      const priceSection = item2.querySelector('.cio-product-card-price-section');
      expect(priceSection).toBeInTheDocument();
      expect(priceSection).toHaveTextContent('£');
      expect(priceSection).toHaveTextContent('39.99');
      const strikethrough = priceSection!.querySelector('.line-through');
      expect(strikethrough).toHaveTextContent('49.99');
    });

    it('does not render price section when product has no price', () => {
      const { getByTestId } = render(
        <PiaCustomCarousel items={mockItems} priceCurrency='€' />,
      );
      const item3 = getByTestId('carousel-item-3');
      expect(
        item3.querySelector('.cio-product-card-price-section'),
      ).not.toBeInTheDocument();
    });

    it('preserves user-provided price override over priceCurrency', () => {
      const CustomPrice = ({ product }: { product: { price?: number } }) => (
        <span data-testid='custom-price'>{product.price}</span>
      );

      const overrides = {
        item: {
          productCard: {
            content: {
              price: { reactNode: CustomPrice },
            },
          },
        },
      };

      const { getByTestId } = render(
        <PiaCustomCarousel items={mockItems} componentOverrides={overrides} priceCurrency='€' />,
      );

      const item1 = getByTestId('carousel-item-1');
      expect(item1.querySelector('[data-testid="custom-price"]')).toHaveTextContent('29.99');
      expect(
        item1.querySelector('.cio-product-card-price-section'),
      ).not.toBeInTheDocument();
    });
  });

  it('does not render when items array is empty', () => {
    const { container } = render(<PiaCustomCarousel items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
