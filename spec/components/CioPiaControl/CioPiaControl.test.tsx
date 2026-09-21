import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import CioPiaControl from '../../../src/components/CioPiaControl/CioPiaControl';
import usePiaClient from '../../../src/hooks/usePiaClient';
import { createMockCioClient } from '../../helpers/mockCioClient';

// Spied, not replaced: every test below still runs the real hook.
jest.mock('../../../src/hooks/usePiaClient', () => {
  const actual = jest.requireActual('../../../src/hooks/usePiaClient');
  return { __esModule: true, ...actual, default: jest.fn(actual.default) };
});

const mockUsePiaClient = usePiaClient as jest.MockedFunction<typeof usePiaClient>;

describe('Testing Component: CioPiaControl', () => {
  let observerCallback: ((entries: IntersectionObserverEntry[]) => void) | null;
  let mockClient: ReturnType<typeof createMockCioClient>;

  const testProps = {
    apiKey: 'test-api-key',
    itemId: 'test-item-id',
    itemName: 'Test Item',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockClient = createMockCioClient();
    observerCallback = null;

    global.IntersectionObserver = jest.fn((callback) => {
      observerCallback = callback;
      return { observe: jest.fn(), disconnect: jest.fn() };
    }) as unknown as typeof IntersectionObserver;
  });

  it('renders a detectable but invisible placeholder', () => {
    const { getByTestId } = render(<CioPiaControl {...testProps} cioClient={mockClient} />);

    const placeholder = getByTestId('cio-pia-control-placeholder');

    expect(placeholder).toBeInTheDocument();
    // Inline, not only a class: the stylesheet is optional and consumers restyle our classes.
    expect(placeholder).toHaveStyle({ width: '1px', height: '1px' });
  });

  it('does not carry the beacon selectors, which would double-count the view', () => {
    const { getByTestId } = render(<CioPiaControl {...testProps} cioClient={mockClient} />);

    const placeholder = getByTestId('cio-pia-control-placeholder');

    expect(placeholder).not.toHaveAttribute('data-cnstrc-pia');
    expect(placeholder).not.toHaveClass('cio-pia-container');
  });

  it('fires the view event with an empty questions array when scrolled into view', () => {
    render(<CioPiaControl {...testProps} cioClient={mockClient} />);

    observerCallback([{ isIntersecting: true }] as IntersectionObserverEntry[]);

    expect(mockClient.tracker.trackProductInsightsAgentView).toHaveBeenCalledWith(
      expect.objectContaining({
        itemId: 'test-item-id',
        itemName: 'Test Item',
        questions: [],
      }),
    );
  });

  it('hands the control arm its test cells, so the event identifies the group', () => {
    render(
      <CioPiaControl
        {...testProps}
        cioClient={mockClient}
        abTest={{ testCells: { constructorio: 'control' }, isControl: true }}
      />,
    );

    expect(mockUsePiaClient).toHaveBeenCalledWith(
      expect.objectContaining({ testCells: { constructorio: 'control' } }),
    );
  });

  it('requests nothing at all', async () => {
    render(<CioPiaControl {...testProps} cioClient={mockClient} />);

    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });

    expect(mockClient.agent.pia.getSuggestedQuestions).not.toHaveBeenCalled();
    expect(mockClient.agent.pia.getAnswerResults).not.toHaveBeenCalled();
  });
});
