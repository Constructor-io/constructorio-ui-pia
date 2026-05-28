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
        return (
          <div key={item.id} data-testid={`carousel-item-${item.id}`}>
            {Description && <Description product={item} />}
          </div>
        );
      })}
    </div>
  ),
  CIO_EVENTS: { productCard: { click: 'cio:product-card:click' } },
}));

const mockItems = [
  { id: '1', name: 'Product 1', description: '<b>Bold</b> description' },
  { id: '2', name: 'Product 2', description: undefined },
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
      const CustomDescription = ({ product }) => (
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

  it('does not render when items array is empty', () => {
    const { container } = render(<PiaCustomCarousel items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
