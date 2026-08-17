import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import PiaRecsPod from '../../../src/components/PiaRecsPod/PiaRecsPod';
import type { CioPiaProps } from '../../../src/components/CioPia/types';
import { AgentRequestError } from '../../../src/errors';
import {
  RECS_FALLBACK_TITLE,
  RECS_INPUT_PLACEHOLDER,
  RECS_LOADING_TITLE,
  RECS_REFINEMENT_LABEL,
  RECS_UNSUPPORTED_REQUEST,
} from '../../../src/constants';
import { RecsResult } from '../../../src/types';
import { createMockCioClient, TestMockClient } from '../../helpers/mockCioClient';
import deferred from '../../helpers/deferred';
import { testRecsPodNoHistory, testRecsPodResult } from '../../localExamples';

const firstResult: RecsResult = testRecsPodResult;
const secondResult: RecsResult = testRecsPodNoHistory;

let mockClient: TestMockClient;

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
  const view = render(<PiaRecsPod {...getProps(overrides)} />);
  await settle();
  return view;
}

describe('PiaRecsPod Component', () => {
  beforeEach(() => {
    mockClient = createMockCioClient();
    mockClient.agent.getRecs.mockResolvedValue(firstResult);
  });

  describe('First load', () => {
    it('shows the loading title and a placeholder for each block', () => {
      mockClient.agent.getRecs.mockReturnValue(deferred<RecsResult>().promise);

      render(<PiaRecsPod {...getProps()} />);

      expect(screen.getByTestId('cio-pia-recs-pod')).toHaveClass('cio-pia-recs-pod--loading');
      expect(screen.getByText(RECS_LOADING_TITLE)).toBeInTheDocument();
      expect(screen.getByTestId('cio-pia-recs-skeleton-carousel')).toBeInTheDocument();
      expect(screen.getByTestId('cio-pia-recs-skeleton-options')).toBeInTheDocument();
      expect(screen.getByTestId('cio-pia-recs-skeleton-input')).toBeInTheDocument();
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('shows the refinement label while the options are still placeholders', () => {
      mockClient.agent.getRecs.mockReturnValue(deferred<RecsResult>().promise);

      const { container } = render(<PiaRecsPod {...getProps()} />);

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

    it('renders the disclaimer', async () => {
      const { container } = await renderSettled();

      expect(container.querySelector('.cio-pia-disclaimer')).toBeInTheDocument();
    });
  });

  describe('Refining', () => {
    it('refetches with the option label when an option is clicked', async () => {
      await renderSettled();

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Slim fit' }));
      });

      expect(mockClient.agent.getRecs).toHaveBeenLastCalledWith(
        expect.objectContaining({ shopperInput: 'Slim fit' }),
      );
    });

    it('refetches with the typed text when the input is submitted', async () => {
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

    it('holds the title steady and disables the input while the refinement loads', async () => {
      const pending = deferred<RecsResult>();
      mockClient.agent.getRecs
        .mockResolvedValueOnce(firstResult)
        .mockReturnValueOnce(pending.promise);

      await renderSettled();

      act(() => {
        fireEvent.click(screen.getByRole('button', { name: 'Oxford' }));
      });

      expect(screen.getByText(firstResult.title)).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeDisabled();
      expect(screen.getByTestId('cio-pia-recs-skeleton-carousel')).toBeInTheDocument();
      expect(screen.getByTestId('cio-pia-recs-skeleton-options')).toBeInTheDocument();
      // The input keeps its box once the pod has loaded once; only the products reload.
      expect(screen.queryByTestId('cio-pia-recs-skeleton-input')).not.toBeInTheDocument();

      await act(async () => {
        pending.resolve(secondResult);
      });

      expect(screen.getByText(secondResult.title)).toBeInTheDocument();
    });

    it('draws as many option placeholders as the previous response had', async () => {
      const pending = deferred<RecsResult>();
      mockClient.agent.getRecs
        .mockResolvedValueOnce(firstResult)
        .mockReturnValueOnce(pending.promise);

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

      render(<PiaRecsPod {...getProps({ translations })} />);

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
        <PiaRecsPod {...getProps()}>
          {({ currentAnswer, items, displayedQuestions }) => (
            <div data-testid='custom-recs-pod'>
              <span data-testid='custom-title'>{currentAnswer}</span>
              <span data-testid='custom-count'>{items ? items.length : 0}</span>
              <span data-testid='custom-options'>{displayedQuestions.length}</span>
            </div>
          )}
        </PiaRecsPod>,
      );
      await settle();

      expect(view.getByTestId('custom-recs-pod')).toBeInTheDocument();
      expect(view.getByTestId('custom-title')).toHaveTextContent(firstResult.title);
      expect(view.getByTestId('custom-count')).toHaveTextContent(
        String(firstResult.items!.length),
      );
      expect(view.getByTestId('custom-options')).toHaveTextContent(
        String(firstResult.refinement!.options.length),
      );
    });

    it('renders a custom loading placeholder', () => {
      mockClient.agent.getRecs.mockReturnValue(deferred<RecsResult>().promise);

      render(
        <PiaRecsPod
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

    it('renders a custom disclaimer', async () => {
      await renderSettled({
        componentOverrides: {
          disclaimer: { reactNode: () => <div data-testid='custom-disclaimer' /> },
        },
      });

      expect(screen.getByTestId('custom-disclaimer')).toBeInTheDocument();
    });
  });

  describe('Tracking', () => {
    it('reports the answer view once the products land', async () => {
      const trackAnswerView = jest.spyOn(
        mockClient.tracker,
        'trackProductInsightsAgentAnswerView',
      );

      await renderSettled();

      expect(trackAnswerView).toHaveBeenCalledWith(
        expect.objectContaining({
          itemId: 'test-item-id',
          itemName: 'Test Item',
          answerText: firstResult.title,
          qnaResultId: firstResult.resultId,
        }),
      );
    });

    it('reports an option click', async () => {
      const trackQuestionClick = jest.spyOn(
        mockClient.tracker,
        'trackProductInsightsAgentQuestionClick',
      );

      await renderSettled();

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Slim fit' }));
      });

      expect(trackQuestionClick).toHaveBeenCalledWith(
        expect.objectContaining({ question: 'Slim fit' }),
      );
    });

    it('does not report a submitted question for the request made on mount', async () => {
      const trackQuestionSubmit = jest.spyOn(
        mockClient.tracker,
        'trackProductInsightsAgentQuestionSubmit',
      );

      await renderSettled();

      expect(trackQuestionSubmit).not.toHaveBeenCalled();
    });
  });
});
