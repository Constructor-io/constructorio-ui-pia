import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PiaCustomCarousel from '../../../src/components/CioPia/PiaCustomCarousel';
import { Item } from '../../../src/types';

// Renders against the real ProductCard from the components library so the tests cover
// whether the Add to Cart button is actually reachable in the rendered card.
const mockItems: Item[] = [
  { id: '1', name: 'Product 1', description: 'First product', price: 10 },
  { id: '2', name: 'Product 2', description: 'Second product', price: 20 },
];

const getAddToCartButtons = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>('.cio-product-card-add-to-cart-btn'));

describe('PiaCustomCarousel Add to Cart', () => {
  it('does not render Add to Cart buttons without an onAddToCart callback', () => {
    const { container } = render(
      <PiaCustomCarousel items={mockItems} callbacks={{ onProductCardClick: jest.fn() }} />,
    );

    expect(getAddToCartButtons(container)).toHaveLength(0);
  });

  it('renders an Add to Cart button on each card when onAddToCart is provided', () => {
    const { container } = render(
      <PiaCustomCarousel items={mockItems} callbacks={{ onAddToCart: jest.fn() }} />,
    );

    const buttons = getAddToCartButtons(container);
    expect(buttons).toHaveLength(mockItems.length);
    expect(buttons[0]).toHaveTextContent('Add to Cart');
  });

  it('calls onAddToCart with the clicked item and the click event', () => {
    const onAddToCart = jest.fn();
    const { container } = render(
      <PiaCustomCarousel items={mockItems} callbacks={{ onAddToCart }} />,
    );

    fireEvent.click(getAddToCartButtons(container)[1]);

    expect(onAddToCart).toHaveBeenCalledTimes(1);
    expect(onAddToCart.mock.calls[0][0]).toEqual(expect.objectContaining({ id: '2' }));
    expect(onAddToCart.mock.calls[0][1]).toEqual(expect.objectContaining({ type: 'click' }));
  });

  it('does not trigger the product card click callback when Add to Cart is clicked', () => {
    const onAddToCart = jest.fn();
    const onProductCardClick = jest.fn();
    const { container } = render(
      <PiaCustomCarousel items={mockItems} callbacks={{ onAddToCart, onProductCardClick }} />,
    );

    fireEvent.click(getAddToCartButtons(container)[0]);

    expect(onAddToCart).toHaveBeenCalledTimes(1);
    expect(onProductCardClick).not.toHaveBeenCalled();
  });

  it('translates the button label', () => {
    const { container } = render(
      <PiaCustomCarousel
        items={mockItems}
        callbacks={{ onAddToCart: jest.fn() }}
        translations={{ 'Add to Cart': 'Añadir al carrito' }}
      />,
    );

    expect(getAddToCartButtons(container)[0]).toHaveTextContent('Añadir al carrito');
  });

  it('keeps the sanitized HTML description when the button is rendered', () => {
    const items: Item[] = [{ id: '1', name: 'Product 1', description: '<b>Bold</b> copy' }];
    const { container } = render(
      <PiaCustomCarousel items={items} callbacks={{ onAddToCart: jest.fn() }} />,
    );

    const description = container.querySelector('.cio-product-card-description');
    expect(description).not.toBeNull();
    expect(description!.innerHTML).toBe('<b>Bold</b> copy');
  });

  it('does not remount cards when every override dependency changes identity', () => {
    // Fresh callbacks/translations objects on each render recompute the merged overrides, which
    // builds a new card render function. RenderPropsWrapper calls that function rather than
    // mounting it as a component type, so the rendered card must survive as the same DOM node.
    const renderCarousel = () => (
      <PiaCustomCarousel
        items={mockItems}
        callbacks={{ onAddToCart: jest.fn() }}
        translations={{}}
      />
    );

    const { container, rerender } = render(renderCarousel());
    const cardBefore = container.querySelector('.cio-product-card');

    rerender(renderCarousel());

    expect(container.querySelector('.cio-product-card')).toBe(cardBefore);
  });

  it('applies consumer product card overrides alongside the button', () => {
    const { container } = render(
      <PiaCustomCarousel
        items={mockItems}
        callbacks={{ onAddToCart: jest.fn() }}
        componentOverrides={{
          item: {
            productCard: {
              content: {
                title: { reactNode: ({ product }) => <span>Custom {product?.name}</span> },
              },
            },
          },
        }}
      />,
    );

    expect(screen.getByText('Custom Product 1')).toBeInTheDocument();
    expect(getAddToCartButtons(container)).toHaveLength(mockItems.length);
  });

  it('routes a custom Add to Cart button override to the callback', () => {
    const onAddToCart = jest.fn();
    render(
      <PiaCustomCarousel
        items={mockItems}
        callbacks={{ onAddToCart }}
        componentOverrides={{
          item: {
            productCard: {
              footer: {
                addToCartButton: {
                  reactNode: ({ product, onAddToCart: handler }) => (
                    <button type='button' onClick={(e) => handler?.(e, product!)}>
                      Add {product?.name}
                    </button>
                  ),
                },
              },
            },
          },
        }}
      />,
    );

    fireEvent.click(screen.getByText('Add Product 1'));

    expect(onAddToCart).toHaveBeenCalledTimes(1);
    expect(onAddToCart.mock.calls[0][0]).toEqual(expect.objectContaining({ id: '1' }));
  });

  it('leaves a full product card override untouched', () => {
    const { container } = render(
      <PiaCustomCarousel
        items={mockItems}
        callbacks={{ onAddToCart: jest.fn() }}
        componentOverrides={{
          item: {
            productCard: {
              reactNode: ({ product }) => <div>Custom card {product?.name}</div>,
            },
          },
        }}
      />,
    );

    expect(screen.getByText('Custom card Product 1')).toBeInTheDocument();
    expect(getAddToCartButtons(container)).toHaveLength(0);
  });
});
