import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CIO_EVENTS } from '@constructor-io/constructorio-ui-components';
import CioPiaRecs from '../../../src/components/CioPiaRecs/CioPiaRecs';
import type { CioPiaProps } from '../../../src/components/CioPia/types';
import { AgentRequestError } from '../../../src/errors';
import {
  RECS_FALLBACK_TITLE,
  RECS_INPUT_PLACEHOLDER,
  RECS_LOADING_TITLE,
  RECS_REFINEMENT_LABEL,
  RECS_UNSUPPORTED_REQUEST,
} from '../../../src/constants';
import { Item, RecsResult } from '../../../src/types';
import { createMockCioClient, TestMockClient } from '../../helpers/mockCioClient';
import { testRecsPodNoHistory, testRecsPodResult } from '../../localExamples';

const firstResult: RecsResult = testRecsPodResult;
const secondResult: RecsResult = testRecsPodNoHistory;

let mockClient: TestMockClient;

/** A request whose settling the test controls, for asserting what is on screen mid-flight. */
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });

  return { promise, resolve };
}

function getProps(overrides: Partial<CioPiaProps> = {}): CioPiaProps {
  return {
    apiKey: 'test-api-key',
    itemId: 'test-item-id',
    itemName: 'Test Item',
    cioClient: mockClient,
    ...overrides,
  };
}

async function settle() {
  await act(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
  });
}

/** Renders the pod and waits for the request made on mount to settle. */
async function renderSettled(overrides: Partial<CioPiaProps> = {}) {
  const view = render(<CioPiaRecs {...getProps(overrides)} />);
  await settle();
  return view;
}

/**
 * The product cards come from the components library and report a click as a DOM event on the
 * carousel wrapper rather than through a React prop, so this is how a click is simulated.
 */
function clickProductCard(container: HTMLElement, product: Item) {
  const wrapper = container.querySelector('[data-carousel]')?.parentElement;
  if (!wrapper) throw new Error('No carousel on screen to click a product card in');

  wrapper.dispatchEvent(
    new CustomEvent(CIO_EVENTS.productCard.click, { detail: { product }, bubbles: true }),
  );
}

describe('CioPiaRecs Component', () => {
  beforeEach(() => {
    mockClient = createMockCioClient();
    mockClient.agent.getRecs.mockResolvedValue(firstResult);
  });

  describe('First load', () => {
    it('shows the loading title and a placeholder for each block', () => {
      mockClient.agent.getRecs.mockReturnValue(new Promise<RecsResult>(() => {}));

      render(<CioPiaRecs {...getProps()} />);

      expect(screen.getByTestId('cio-pia-recs-pod')).toHaveClass('cio-pia-recs-pod--loading');
      expect(screen.getByText(RECS_LOADING_TITLE)).toBeInTheDocument();
      expect(screen.getByTestId('cio-pia-recs-skeleton-carousel')).toBeInTheDocument();
      expect(screen.getByTestId('cio-pia-recs-skeleton-options')).toBeInTheDocument();
      // The input is never a placeholder, not even now: it holds its box from the first render and
      // is disabled instead, so a request can never unmount what the shopper is typing into.
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('shows the refinement label while the options are still placeholders', () => {
      mockClient.agent.getRecs.mockReturnValue(new Promise<RecsResult>(() => {}));

      const { container } = render(<CioPiaRecs {...getProps()} />);

      expect(container.querySelector('.cio-pia-recs-pod__refinement-label')).toHaveTextContent(
        RECS_REFINEMENT_LABEL,
      );
    });
  });

  describe('Success', () => {
    it('renders title, then carousel, then the refinement row', async () => {
      const { container } = await renderSettled();

      const pod = container.querySelector('.cio-pia-recs-pod')!;
      const children = Array.from(pod.children);
      const indexOf = (selector: string) => children.findIndex((el) => el.matches(selector));

      expect(indexOf('.cio-pia-recs-pod__title')).toBe(0);
      expect(indexOf('.cio-pia-recs-pod__refinement')).toBeGreaterThan(
        indexOf('.cio-pia-recs-pod__title'),
      );
      expect(container.querySelector('[data-carousel]')).toBeInTheDocument();
    });

    it('renders the title and the products from the response', async () => {
      await renderSettled();

      expect(screen.getByText(firstResult.title)).toBeInTheDocument();
      firstResult.items!.forEach((item) => {
        expect(screen.getByText(item.name!)).toBeInTheDocument();
      });
      expect(screen.queryByTestId('cio-pia-recs-skeleton-carousel')).not.toBeInTheDocument();
    });

    it('renders one option button per refinement option', async () => {
      await renderSettled();

      firstResult.refinement!.options.forEach((option) => {
        expect(screen.getByRole('button', { name: option })).toBeInTheDocument();
      });
    });

    it('prefers the refinement prompt the API sent over the built-in label', async () => {
      const { container } = await renderSettled();

      expect(container.querySelector('.cio-pia-recs-pod__refinement-label')).toHaveTextContent(
        firstResult.refinement!.question!,
      );
    });

    it('falls back to the built-in label when the API sends no prompt', async () => {
      mockClient.agent.getRecs.mockResolvedValue({
        ...firstResult,
        refinement: { options: firstResult.refinement!.options },
      });

      const { container } = await renderSettled();

      expect(container.querySelector('.cio-pia-recs-pod__refinement-label')).toHaveTextContent(
        RECS_REFINEMENT_LABEL,
      );
    });

    it('does not render an error block or feedback controls', async () => {
      const { container } = await renderSettled({ displayConfigs: { showFeedback: true } });

      expect(screen.queryByTestId('error-block')).not.toBeInTheDocument();
      expect(container.querySelector('.cio-pia-feedback')).not.toBeInTheDocument();
    });

    it('renders no disclaimer', async () => {
      const { container } = await renderSettled();

      expect(container.querySelector('.cio-pia-disclaimer')).not.toBeInTheDocument();
    });

    // The pod's box sits in a row beside the options and submits on Enter. The mocks give it no
    // button, and Q&A keeps its own.
    it('renders no send button beside the refinement input', async () => {
      const { container } = await renderSettled();

      expect(container.querySelector('.cio-pia-send-button')).not.toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  describe('Refining', () => {
    it('fetches again with the option label when an option is clicked', async () => {
      await renderSettled();

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Slim fit' }));
      });

      expect(mockClient.agent.getRecs).toHaveBeenLastCalledWith(
        expect.objectContaining({ shopperInput: 'Slim fit' }),
      );
    });

    it('fetches again with the typed text when the input is submitted', async () => {
      await renderSettled();

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'something with more linen' } });
      await act(async () => {
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      expect(mockClient.agent.getRecs).toHaveBeenLastCalledWith(
        expect.objectContaining({ shopperInput: 'something with more linen' }),
      );
    });

    it('swaps in the loading title and disables the input while the refinement loads', async () => {
      const pending = deferred<RecsResult>();
      mockClient.agent.getRecs
        .mockResolvedValueOnce(firstResult)
        .mockReturnValueOnce(pending.promise);

      await renderSettled();

      act(() => {
        fireEvent.click(screen.getByRole('button', { name: 'Oxford' }));
      });

      expect(screen.getByText(RECS_LOADING_TITLE)).toBeInTheDocument();
      expect(screen.queryByText(firstResult.title)).not.toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeDisabled();
      expect(screen.getByTestId('cio-pia-recs-skeleton-carousel')).toBeInTheDocument();
      expect(screen.getByTestId('cio-pia-recs-skeleton-options')).toBeInTheDocument();

      await act(async () => {
        pending.resolve(secondResult);
      });

      expect(screen.getByText(secondResult.title)).toBeInTheDocument();
    });

    it('draws as many option placeholders as the previous response had', async () => {
      mockClient.agent.getRecs
        .mockResolvedValueOnce(firstResult)
        .mockReturnValueOnce(new Promise<RecsResult>(() => {}));

      await renderSettled();

      act(() => {
        fireEvent.click(screen.getByRole('button', { name: 'Oxford' }));
      });

      const placeholders = screen.getByTestId('cio-pia-recs-skeleton-options');
      expect(placeholders.children).toHaveLength(firstResult.refinement!.options.length);
    });
  });

  describe('Unsupported request', () => {
    it('shows the message under the input and leaves everything else alone', async () => {
      mockClient.agent.getRecs
        .mockResolvedValueOnce(firstResult)
        .mockRejectedValueOnce(new AgentRequestError(422));

      const { container } = await renderSettled();

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'paint my house' } });
      await act(async () => {
        fireEvent.keyDown(input, { key: 'Enter' });
      });
      await settle();

      expect(screen.getByRole('alert')).toHaveTextContent(RECS_UNSUPPORTED_REQUEST);
      expect(container.querySelector('.cio-pia-input--error')).toBeInTheDocument();
      expect(screen.getByText(firstResult.title)).toBeInTheDocument();
      firstResult.refinement!.options.forEach((option) => {
        expect(screen.getByRole('button', { name: option })).toBeInTheDocument();
      });
    });

    // The shopper typed nothing here: the label came from the API's own suggestion, so flagging
    // their input would blame them for a request they did not write.
    it('leaves the input alone when the rejected request came from an option', async () => {
      mockClient.agent.getRecs
        .mockResolvedValueOnce(firstResult)
        .mockRejectedValueOnce(new AgentRequestError(422));

      const { container } = await renderSettled();

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Oxford' }));
      });
      await settle();

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(container.querySelector('.cio-pia-input--error')).not.toBeInTheDocument();
      expect(screen.getByText(RECS_FALLBACK_TITLE)).toBeInTheDocument();
      firstResult.items!.forEach((item) => {
        expect(screen.getByText(item.name!)).toBeInTheDocument();
      });
    });
  });

  describe('Failures', () => {
    it('shows the fallback title over the products it already had', async () => {
      mockClient.agent.getRecs
        .mockResolvedValueOnce(firstResult)
        .mockRejectedValueOnce(new AgentRequestError(500));

      await renderSettled();

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Oxford' }));
      });
      await settle();

      expect(screen.getByText(RECS_FALLBACK_TITLE)).toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      firstResult.items!.forEach((item) => {
        expect(screen.getByText(item.name!)).toBeInTheDocument();
      });
    });

    it('renders nothing at all when the first request fails', async () => {
      mockClient.agent.getRecs.mockRejectedValue(new AgentRequestError(500));

      const { container } = await renderSettled();

      expect(container).toBeEmptyDOMElement();
    });

    // Rendering nothing is only the default. A consumer that supplied its own root has to reach it
    // in this state too, otherwise the `error` render prop documented on the Component Overrides
    // page would be unreachable for this mode.
    it('still runs a consumer override when the first request fails, so it can show its own message', async () => {
      mockClient.agent.getRecs.mockRejectedValue(new AgentRequestError(500));

      await renderSettled({
        componentOverrides: {
          reactNode: ({ error }) => (
            <div data-testid='custom-failure'>
              {error instanceof AgentRequestError ? error.status : 'no status'}
            </div>
          ),
        },
      });

      expect(screen.getByTestId('custom-failure')).toHaveTextContent('500');
    });
  });

  describe('Empty results', () => {
    it('renders nothing so whatever the retailer already had shows through', async () => {
      mockClient.agent.getRecs.mockResolvedValue({
        title: 'Nothing to show',
        items: null,
        refinement: null,
      });

      const { container } = await renderSettled();

      expect(container).toBeEmptyDOMElement();
    });

    // `items` is typed `Item[] | null` and `cioClient` is a public prop, so a consumer-supplied
    // client can answer with an empty array. That has to read as "no products" too, not as a
    // carousel with nothing in it.
    it('treats an empty product list the same as no products at all', async () => {
      mockClient.agent.getRecs.mockResolvedValue({
        title: 'Nothing to show',
        items: [],
        refinement: null,
      });

      const { container } = await renderSettled();

      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('Parameters', () => {
    it('hides the input when showInput is false', async () => {
      await renderSettled({ recsPodParameters: { showInput: false } });

      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('forwards the strategy and result count to the request', async () => {
      await renderSettled({ recsPodParameters: { strategy: 'bestsellers', numResults: 6 } });

      expect(mockClient.agent.getRecs).toHaveBeenCalledWith(
        expect.objectContaining({ strategy: 'bestsellers', numResults: 6 }),
      );
    });

    // Nothing has arrived on first load, so the count can only come from what was asked for. Drawing
    // the built-in six and then landing three products would leave the row half empty.
    it('draws as many product placeholders as numResults asked for', () => {
      mockClient.agent.getRecs.mockReturnValue(new Promise<RecsResult>(() => {}));

      render(<CioPiaRecs {...getProps({ recsPodParameters: { numResults: 3 } })} />);

      expect(screen.getAllByTestId('cio-pia-recs-skeleton-card')).toHaveLength(3);
    });
  });

  describe('Translations', () => {
    it('uses the recommendations placeholder, not the question-and-answer one', async () => {
      await renderSettled();

      expect(screen.getByPlaceholderText(RECS_INPUT_PLACEHOLDER)).toBeInTheDocument();
    });

    it('keeps the two input placeholders independent', async () => {
      await renderSettled({
        translations: {
          'Ask anything': 'Ask me about this product',
          [RECS_INPUT_PLACEHOLDER]: 'Tell us what you want',
        },
      });

      expect(screen.getByPlaceholderText('Tell us what you want')).toBeInTheDocument();
    });

    it('allows every string the API cannot supply to be overridden', async () => {
      const pending = deferred<RecsResult>();
      mockClient.agent.getRecs.mockReturnValueOnce(pending.promise);
      const translations = {
        [RECS_LOADING_TITLE]: 'Tuning your picks',
        [RECS_REFINEMENT_LABEL]: 'Try one of these:',
        [RECS_INPUT_PLACEHOLDER]: 'Tell us what you want',
      };

      render(<CioPiaRecs {...getProps({ translations })} />);

      expect(screen.getByText('Tuning your picks')).toBeInTheDocument();
      expect(screen.getByText('Try one of these:')).toBeInTheDocument();

      await act(async () => {
        pending.resolve({ ...firstResult, refinement: { options: ['Slim fit'] } });
      });

      expect(screen.getByText('Try one of these:')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Tell us what you want')).toBeInTheDocument();
    });

    it('overrides the fallback title', async () => {
      mockClient.agent.getRecs
        .mockResolvedValueOnce(firstResult)
        .mockRejectedValueOnce(new AgentRequestError(500));

      await renderSettled({ translations: { [RECS_FALLBACK_TITLE]: 'Our top picks' } });

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Oxford' }));
      });
      await settle();

      expect(screen.getByText('Our top picks')).toBeInTheDocument();
    });

    it('overrides the unsupported request message', async () => {
      mockClient.agent.getRecs
        .mockResolvedValueOnce(firstResult)
        .mockRejectedValueOnce(new AgentRequestError(422));

      await renderSettled({ translations: { [RECS_UNSUPPORTED_REQUEST]: 'We cannot do that' } });

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'paint my house' } });
      await act(async () => {
        fireEvent.keyDown(input, { key: 'Enter' });
      });
      await settle();

      expect(screen.getByRole('alert')).toHaveTextContent('We cannot do that');
    });
  });

  describe('Callbacks and overrides', () => {
    it('calls onFocus when the shopper focuses the input', async () => {
      const onFocus = jest.fn();

      await renderSettled({ callbacks: { onFocus } });

      fireEvent.focus(screen.getByRole('textbox'));

      expect(onFocus).toHaveBeenCalledWith({
        itemId: 'test-item-id',
        threadId: expect.any(String),
      });
    });

    it('renders custom content from the children render props function', async () => {
      const view = render(
        <CioPiaRecs {...getProps()}>
          {({ currentAnswer, items, displayedQuestions, isLoading }) => (
            <div data-testid='custom-recs-pod'>
              <span data-testid='custom-title'>{currentAnswer}</span>
              <span data-testid='custom-count'>{items ? items.length : 0}</span>
              <span data-testid='custom-options'>{displayedQuestions.length}</span>
              <span data-testid='custom-loading'>{String(isLoading)}</span>
            </div>
          )}
        </CioPiaRecs>,
      );
      await settle();

      expect(view.getByTestId('custom-recs-pod')).toBeInTheDocument();
      expect(view.getByTestId('custom-title')).toHaveTextContent(firstResult.title);
      expect(view.getByTestId('custom-count')).toHaveTextContent(String(firstResult.items!.length));
      expect(view.getByTestId('custom-options')).toHaveTextContent(
        String(firstResult.refinement!.options.length),
      );
      expect(view.getByTestId('custom-loading')).toHaveTextContent('false');
    });

    it('renders a custom loading placeholder', () => {
      mockClient.agent.getRecs.mockReturnValue(new Promise<RecsResult>(() => {}));

      render(
        <CioPiaRecs
          {...getProps({
            componentOverrides: {
              loading: { reactNode: () => <div data-testid='custom-loading' /> },
            },
          })}
        />,
      );

      expect(screen.getByTestId('custom-loading')).toBeInTheDocument();
      expect(screen.queryByTestId('cio-pia-recs-skeleton-carousel')).not.toBeInTheDocument();
    });

    // The pod has no disclaimer of its own, so this override has nothing to replace here.
    it('ignores a disclaimer override', async () => {
      await renderSettled({
        componentOverrides: {
          disclaimer: { reactNode: () => <div data-testid='custom-disclaimer' /> },
        },
      });

      expect(screen.queryByTestId('custom-disclaimer')).not.toBeInTheDocument();
    });
  });

  // The pod sends no analytics in this version - tracking lands in its own PR. These tests exist
  // so reconnecting it is a deliberate act with a failing test attached, not an accident.
  describe('No tracking yet', () => {
    it('sends no analytics event for a load, an option click or a product click', async () => {
      const events = [
        'trackProductInsightsAgentAnswerView',
        'trackProductInsightsAgentQuestionClick',
        'trackProductInsightsAgentQuestionSubmit',
        'trackProductInsightsAgentResultClick',
      ] as const;
      const spies = events.map((event) => jest.spyOn(mockClient.tracker, event));

      const { container } = await renderSettled();

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Slim fit' }));
      });
      await settle();

      clickProductCard(container, firstResult.items![0]);

      await act(async () => {
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'more linen' } });
        fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });
      });
      await settle();

      const fired = events.filter((_, index) => spies[index].mock.calls.length > 0);
      expect(fired).toEqual([]);
    });

    it('still calls onProductCardClick, which is the consumer callback and not analytics', async () => {
      const onProductCardClick = jest.fn();

      const { container } = await renderSettled({ callbacks: { onProductCardClick } });

      clickProductCard(container, firstResult.items![0]);

      expect(onProductCardClick).toHaveBeenCalledTimes(1);
      expect(onProductCardClick).toHaveBeenCalledWith(firstResult.items![0]);
    });
  });
});
