import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductCard from '../../../src/components/ProductCard/ProductCard';

const testTitle = 'Test Product';
const testPrice = '$99.00';
const testImageUrl = 'https://example.com/image.jpg';

describe('ProductCard Component', () => {
  const defaultProps = {
    imageUrl: testImageUrl,
    title: testTitle,
    price: testPrice,
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the product card', () => {
    const { getByTestId } = render(<ProductCard {...defaultProps} />);
    expect(getByTestId('product-card')).toBeInTheDocument();
  });

  it('renders the product title', () => {
    const { getByText } = render(<ProductCard {...defaultProps} />);
    expect(getByText(testTitle)).toBeInTheDocument();
  });

  it('renders the product price', () => {
    const { getByText } = render(<ProductCard {...defaultProps} />);
    expect(getByText(testPrice)).toBeInTheDocument();
  });

  it('renders the product image with correct src and alt', () => {
    const { getByRole } = render(<ProductCard {...defaultProps} />);
    const image = getByRole('img');
    expect(image).toHaveAttribute('src', testImageUrl);
    expect(image).toHaveAttribute('alt', testTitle);
  });

  it('calls onClick when clicked', () => {
    const { getByTestId } = render(<ProductCard {...defaultProps} />);
    fireEvent.click(getByTestId('product-card'));
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when Enter key is pressed', () => {
    const { getByTestId } = render(<ProductCard {...defaultProps} />);
    fireEvent.keyDown(getByTestId('product-card'), { key: 'Enter' });
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when Space key is pressed', () => {
    const { getByTestId } = render(<ProductCard {...defaultProps} />);
    fireEvent.keyDown(getByTestId('product-card'), { key: ' ' });
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('has role="button" when onClick is provided', () => {
    const { getByTestId } = render(<ProductCard {...defaultProps} />);
    expect(getByTestId('product-card')).toHaveAttribute('role', 'button');
  });

  it('does not have role="button" when onClick is not provided', () => {
    const { getByTestId } = render(
      <ProductCard imageUrl={testImageUrl} title={testTitle} price={testPrice} />
    );
    expect(getByTestId('product-card')).not.toHaveAttribute('role');
  });

  it('has tabIndex when onClick is provided', () => {
    const { getByTestId } = render(<ProductCard {...defaultProps} />);
    expect(getByTestId('product-card')).toHaveAttribute('tabIndex', '0');
  });

  it('does not have tabIndex when onClick is not provided', () => {
    const { getByTestId } = render(
      <ProductCard imageUrl={testImageUrl} title={testTitle} price={testPrice} />
    );
    expect(getByTestId('product-card')).not.toHaveAttribute('tabIndex');
  });

  it('sets title attribute on product title for tooltip', () => {
    const { getByText } = render(<ProductCard {...defaultProps} />);
    expect(getByText(testTitle)).toHaveAttribute('title', testTitle);
  });

  it('has interactive class when onClick is provided', () => {
    const { getByTestId } = render(<ProductCard {...defaultProps} />);
    expect(getByTestId('product-card')).toHaveClass(
      'cio-pia-product-card--interactive'
    );
  });

  it('does not have interactive class when onClick is not provided', () => {
    const { getByTestId } = render(
      <ProductCard imageUrl={testImageUrl} title={testTitle} price={testPrice} />
    );
    expect(getByTestId('product-card')).not.toHaveClass(
      'cio-pia-product-card--interactive'
    );
  });

  it('shows fallback when image fails to load', () => {
    const { getByRole, getByTestId, queryByRole } = render(
      <ProductCard {...defaultProps} />
    );
    const image = getByRole('img');
    fireEvent.error(image);
    // After error, fallback div has role="img", so query for the actual img element
    const imgElement = queryByRole('img');
    expect(imgElement).toHaveAttribute('aria-label');
    expect(getByTestId('product-card-image-fallback')).toBeInTheDocument();
  });

  it('does not render price when price is not provided', () => {
    const { queryByText } = render(
      <ProductCard imageUrl={testImageUrl} title={testTitle} onClick={jest.fn()} />
    );
    expect(queryByText(testPrice)).not.toBeInTheDocument();
  });

  it('renders image with loading="lazy" attribute', () => {
    const { getByRole } = render(<ProductCard {...defaultProps} />);
    expect(getByRole('img')).toHaveAttribute('loading', 'lazy');
  });

  it('fallback has role="img" for accessibility', () => {
    const { getByRole, getByTestId } = render(<ProductCard {...defaultProps} />);
    const image = getByRole('img');
    fireEvent.error(image);
    expect(getByTestId('product-card-image-fallback')).toHaveAttribute('role', 'img');
  });

  it('does not call onClick when other keys are pressed', () => {
    const { getByTestId } = render(<ProductCard {...defaultProps} />);
    fireEvent.keyDown(getByTestId('product-card'), { key: 'Tab' });
    fireEvent.keyDown(getByTestId('product-card'), { key: 'Escape' });
    expect(defaultProps.onClick).not.toHaveBeenCalled();
  });
});
