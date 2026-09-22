import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import CheckoutTriggerBar from '../../../src/components/CioPia/CheckoutTriggerBar';
import type { CheckoutTrigger } from '../../../src/components/CioPia/types';
import type { CioPiaRenderProps } from '../../../src/types';

const mockState: CioPiaRenderProps = {
  items: null,
  isLoading: false,
  error: null,
  currentAnswer: '',
  currentQuestion: '',
  displayedQuestions: [],
  handleSubmitQuestion: jest.fn(),
  conversationHistory: [],
};

describe('CheckoutTriggerBar', () => {
  it('renders the bar and calls onTrigger with state when the default button is clicked', () => {
    const onTrigger = jest.fn();
    const triggers: CheckoutTrigger[] = [{ id: 'primary', onTrigger }];

    const { getByTestId } = render(<CheckoutTriggerBar triggers={triggers} state={mockState} />);

    expect(getByTestId('cio-pia-checkout-triggers')).toBeInTheDocument();
    const button = getByTestId('cio-pia-checkout-trigger-primary');
    expect(button).toHaveTextContent('Checkout');

    fireEvent.click(button);
    expect(onTrigger).toHaveBeenCalledTimes(1);
    expect(onTrigger).toHaveBeenCalledWith(mockState);
  });

  it('uses the trigger label when provided instead of the default "Checkout"', () => {
    const triggers: CheckoutTrigger[] = [
      { id: 'primary', label: 'Buy Now', onTrigger: jest.fn() },
    ];

    const { getByTestId } = render(<CheckoutTriggerBar triggers={triggers} state={mockState} />);

    expect(getByTestId('cio-pia-checkout-trigger-primary')).toHaveTextContent('Buy Now');
  });

  it('translates the default "Checkout" label when a translation is provided', () => {
    const triggers: CheckoutTrigger[] = [{ id: 'primary', onTrigger: jest.fn() }];

    const { getByTestId } = render(
      <CheckoutTriggerBar
        triggers={triggers}
        state={mockState}
        translations={{ Checkout: 'Pagar' } as Parameters<
          typeof CheckoutTriggerBar
        >[0]['translations']}
      />,
    );

    expect(getByTestId('cio-pia-checkout-trigger-primary')).toHaveTextContent('Pagar');
  });

  it('hides a trigger whose triggerWhen predicate returns false', () => {
    const onTrigger = jest.fn();
    const triggerWhen = jest.fn().mockReturnValue(false);
    const triggers: CheckoutTrigger[] = [{ id: 'primary', triggerWhen, onTrigger }];

    const { queryByTestId } = render(
      <CheckoutTriggerBar triggers={triggers} state={mockState} />,
    );

    expect(triggerWhen).toHaveBeenCalledWith(mockState);
    expect(queryByTestId('cio-pia-checkout-triggers')).not.toBeInTheDocument();
    expect(queryByTestId('cio-pia-checkout-trigger-primary')).not.toBeInTheDocument();
  });

  it('shows a trigger whose triggerWhen predicate returns true', () => {
    const triggers: CheckoutTrigger[] = [
      { id: 'primary', triggerWhen: () => true, onTrigger: jest.fn() },
    ];

    const { getByTestId } = render(<CheckoutTriggerBar triggers={triggers} state={mockState} />);

    expect(getByTestId('cio-pia-checkout-trigger-primary')).toBeInTheDocument();
  });

  it('renders nothing when every trigger is hidden by triggerWhen', () => {
    const triggers: CheckoutTrigger[] = [
      { id: 'a', triggerWhen: () => false, onTrigger: jest.fn() },
      { id: 'b', triggerWhen: () => false, onTrigger: jest.fn() },
    ];

    const { container } = render(<CheckoutTriggerBar triggers={triggers} state={mockState} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders only the visible triggers when some are gated out', () => {
    const triggers: CheckoutTrigger[] = [
      { id: 'visible', triggerWhen: () => true, onTrigger: jest.fn() },
      { id: 'hidden', triggerWhen: () => false, onTrigger: jest.fn() },
    ];

    const { getByTestId, queryByTestId } = render(
      <CheckoutTriggerBar triggers={triggers} state={mockState} />,
    );

    expect(getByTestId('cio-pia-checkout-trigger-visible')).toBeInTheDocument();
    expect(queryByTestId('cio-pia-checkout-trigger-hidden')).not.toBeInTheDocument();
  });

  it('uses renderButton when provided and forwards onClick/label/id', () => {
    const onTrigger = jest.fn();
    const renderButton = jest.fn(({ onClick, label, id }) => (
      <button type='button' data-testid={`custom-${id}`} data-label={label} onClick={onClick}>
        {label}
      </button>
    ));
    const triggers: CheckoutTrigger[] = [
      { id: 'primary', label: 'Go', renderButton, onTrigger },
    ];

    const { getByTestId, queryByTestId } = render(
      <CheckoutTriggerBar triggers={triggers} state={mockState} />,
    );

    expect(queryByTestId('cio-pia-checkout-trigger-primary')).not.toBeInTheDocument();

    const custom = getByTestId('custom-primary');
    expect(custom).toHaveAttribute('data-label', 'Go');

    fireEvent.click(custom);
    expect(onTrigger).toHaveBeenCalledWith(mockState);
  });

  it('forwards disabled to renderButton', () => {
    const renderButton = jest.fn(({ disabled, id }) => (
      <button type='button' data-testid={`custom-${id}`} disabled={disabled}>
        button
      </button>
    ));
    const triggers: CheckoutTrigger[] = [
      { id: 'primary', disabled: true, renderButton, onTrigger: jest.fn() },
    ];

    const { getByTestId } = render(<CheckoutTriggerBar triggers={triggers} state={mockState} />);

    expect(getByTestId('custom-primary')).toBeDisabled();
  });

  it('disables the default button when disabled is true', () => {
    const onTrigger = jest.fn();
    const triggers: CheckoutTrigger[] = [{ id: 'primary', disabled: true, onTrigger }];

    const { getByTestId } = render(<CheckoutTriggerBar triggers={triggers} state={mockState} />);

    const button = getByTestId('cio-pia-checkout-trigger-primary');
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(onTrigger).not.toHaveBeenCalled();
  });

  it('renders multiple triggers in the order provided', () => {
    const triggers: CheckoutTrigger[] = [
      { id: 'first', label: 'First', onTrigger: jest.fn() },
      { id: 'second', label: 'Second', onTrigger: jest.fn() },
    ];

    const { getByTestId } = render(<CheckoutTriggerBar triggers={triggers} state={mockState} />);

    const bar = getByTestId('cio-pia-checkout-triggers');
    const buttons = bar.querySelectorAll('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent('First');
    expect(buttons[1]).toHaveTextContent('Second');
  });
});
