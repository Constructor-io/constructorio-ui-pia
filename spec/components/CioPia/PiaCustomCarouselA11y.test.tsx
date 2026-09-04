import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProductCard } from '@constructor-io/constructorio-ui-components';
import PiaCustomCarousel from '../../../src/components/CioPia/PiaCustomCarousel';
import { Item } from '../../../src/types';

// Renders against the real ProductCard from the components library: the accessible name
// under test is computed from the rendered DOM, which a mock could not reproduce.
const items: Item[] = [
  {
    id: '1',
    name: 'Trekking Poles',
    imageUrl: 'poles.jpg',
    price: 59.99,
    description: 'Collapsible <b>aluminum</b>, pair.',
    rating: 4.4,
    reviewsCount: 94,
  },
  { id: '2', name: 'Waterproof Jacket', imageUrl: 'jacket.jpg', price: 89, salePrice: 69 },
];

const getCards = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>('.cio-product-card'));

describe('PiaCustomCarousel keyboard and screen reader access', () => {
  it('puts each card in the tab order as a link', () => {
    const { container } = render(<PiaCustomCarousel items={items} />);

    const cards = getCards(container);
    expect(cards).toHaveLength(items.length);
    cards.forEach((card) => {
      expect(card).toHaveAttribute('role', 'link');
      expect(card).toHaveAttribute('tabindex', '0');
    });

    cards[0].focus();
    expect(document.activeElement).toBe(cards[0]);
  });

  it('leaves the card markup as the library renders it', () => {
    const sectionOutline = (root: HTMLElement) =>
      Array.from(root.querySelectorAll('.cio-product-card *')).map(
        (el) => `${el.tagName}.${Array.from(el.classList).find((c) => c.startsWith('cio-')) ?? ''}`,
      );

    const ours = render(
      <PiaCustomCarousel items={[items[0]]} callbacks={{ onAddToCart: jest.fn() }} />,
    );
    const theirs = render(
      <ProductCard product={items[0]} onAddToCart={jest.fn()} addToCartText='Add to Cart' />,
    );

    // The description is the one section this component already rendered its own way.
    const ignoringDescription = (outline: string[]) =>
      outline.filter((entry) => !entry.startsWith('B.'));

    expect(ignoringDescription(sectionOutline(ours.container))).toEqual(
      ignoringDescription(sectionOutline(theirs.container)),
    );
    expect(ours.container.querySelector('.cio-product-card-title-section')!.tagName).toBe('P');
  });

  it('is named by the product name alone', () => {
    const { container } = render(<PiaCustomCarousel items={items} />);

    const [poles, jacket] = getCards(container);
    expect(poles).toHaveAccessibleName('Trekking Poles');
    expect(jacket).toHaveAccessibleName('Waterproof Jacket');
  });

  it('keeps the Add to Cart button text out of the card name', () => {
    const { container } = render(
      <PiaCustomCarousel items={items} callbacks={{ onAddToCart: jest.fn() }} />,
    );

    const [poles] = getCards(container);
    expect(poles).toHaveAccessibleName('Trekking Poles');
    expect(poles).not.toHaveAccessibleName(/Add to Cart/);
    // The button itself keeps its own name and stays reachable.
    expect(container.querySelector('.cio-product-card-add-to-cart-btn')).toHaveAccessibleName(
      'Add to Cart',
    );
  });

  it('falls back to the rendered content when the product has no name', () => {
    const { container } = render(<PiaCustomCarousel items={[{ ...items[0], name: '' }]} />);

    const [poles] = getCards(container);
    expect(poles).not.toHaveAttribute('aria-label');
    // `\s`: the price section separates currency and amount with a non-breaking space.
    expect(poles).toHaveAccessibleName(/\$\s59\.99/);
  });

  it('leaves price, description and rating readable inside the card', () => {
    const { container } = render(<PiaCustomCarousel items={items} />);

    const [poles] = getCards(container);
    expect(poles).toHaveTextContent(/\$\s59\.99/);
    expect(poles).toHaveTextContent('Collapsible aluminum, pair.');
    expect(poles).not.toHaveTextContent('<b>');
    expect(poles).toHaveTextContent('94 reviews');
  });

  it('activates the card on Enter, once', () => {
    const onProductCardClick = jest.fn();
    const { container } = render(
      <PiaCustomCarousel items={items} callbacks={{ onProductCardClick }} />,
    );

    const [poles] = getCards(container);
    poles.focus();
    fireEvent.keyDown(poles, { key: 'Enter' });

    expect(onProductCardClick).toHaveBeenCalledTimes(1);
    expect(onProductCardClick).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }));
  });

  it('leaves Enter on the Add to Cart button to that button', () => {
    const onProductCardClick = jest.fn();
    const onAddToCart = jest.fn();
    const { container } = render(
      <PiaCustomCarousel items={items} callbacks={{ onProductCardClick, onAddToCart }} />,
    );

    const addToCart = container.querySelector<HTMLElement>('.cio-product-card-add-to-cart-btn')!;
    addToCart.focus();
    fireEvent.keyDown(addToCart, { key: 'Enter' });

    // The card's Enter handler must not fire for a key pressed on a control inside it.
    expect(onProductCardClick).not.toHaveBeenCalled();
  });

  it('still opens the card on a mouse click', () => {
    const onProductCardClick = jest.fn();
    const { container } = render(
      <PiaCustomCarousel items={items} callbacks={{ onProductCardClick }} />,
    );

    fireEvent.click(container.querySelector('.cio-product-card-title-section')!);

    expect(onProductCardClick).toHaveBeenCalledTimes(1);
  });
});
