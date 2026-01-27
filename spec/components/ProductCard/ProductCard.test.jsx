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
});
