import { Tracker } from '@constructor-io/constructorio-client-javascript/lib/types/constructorio';
import { AnswerRequestParameters, Formatters, SuggestedQuestionsParameters } from '../types';
import useAnswerResults, { UseAnswerResultsReturn } from './useAnswerResults';
import usePiaClient, { CioClient } from './usePiaClient';
import useSuggestedQuestions, { UseSuggestedQuestionsReturn } from './useSuggestedQuestions';

export type { CioClient };

// TODO: remove SUPPORTED_DEPRECATED_PARAMS and mapDeprecatedParameters once the
// deprecated `parameters` prop is removed from CioPiaProps.
const SUPPORTED_DEPRECATED_PARAMS: Record<string, { camelKey: string; isObject: boolean }> = {
  guard: { camelKey: 'guard', isObject: false },
  num_results: { camelKey: 'numResults', isObject: false },
  numResults: { camelKey: 'numResults', isObject: false },
  pre_filter_expression: { camelKey: 'preFilterExpression', isObject: true },
  preFilterExpression: { camelKey: 'preFilterExpression', isObject: true },
  fmt_options: { camelKey: 'fmtOptions', isObject: true },
  fmtOptions: { camelKey: 'fmtOptions', isObject: true },
};

function mapDeprecatedParameters(
  params: Record<string, string | number | boolean> | undefined,
): Record<string, unknown> | undefined {
  if (!params) return undefined;
  const mapped: Record<string, unknown> = {};
  let hasEntries = false;
  for (const [key, value] of Object.entries(params)) {
    const config = SUPPORTED_DEPRECATED_PARAMS[key];
    if (!config) continue;
    hasEntries = true;
    if (config.isObject && typeof value === 'string') {
      try {
        mapped[config.camelKey] = JSON.parse(value);
      } catch {
        mapped[config.camelKey] = value;
      }
    } else {
      mapped[config.camelKey] = value;
    }
  }
  return hasEntries ? mapped : undefined;
}

export interface UseCioPiaProps {
  apiKey: string;
  itemId: string;
  variationId?: string;
  threadId?: string;
  cioClient?: CioClient;
  suggestedQuestionsParameters?: SuggestedQuestionsParameters;
  answerParameters?: AnswerRequestParameters;
  /**
   * @deprecated Use `answerParameters` and `suggestedQuestionsParameters` instead.
   *
   * Only the following keys are forwarded (snake_case or camelCase accepted):
   *
   * Suggested-questions endpoint:
   * - `num_results` / `numResults` → numResults
   * - `pre_filter_expression` / `preFilterExpression` → preFilterExpression (JSON-parsed if string)
   *
   * Answer endpoint:
   * - `guard` → guard
   * - `pre_filter_expression` / `preFilterExpression` → preFilterExpression (JSON-parsed if string)
   * - `fmt_options` / `fmtOptions` → fmtOptions (JSON-parsed if string)
   *
   * All other keys (e.g. `ef-*`) are silently dropped.
   * Typed parameters take precedence over values specified here.
   */
  parameters?: Record<string, string | number | boolean>;
  /** Define outside the component or wrap with useCallback to avoid unnecessary re-renders. */
  formatImageUrl?: Formatters['formatImageUrl'];
}

export interface UseCioPiaReturn {
  cioClient: { tracker: Tracker };
  threadId: string;
  suggestedQuestions: UseSuggestedQuestionsReturn;
  answers: UseAnswerResultsReturn;
}

export default function useCioPia(props: UseCioPiaProps): UseCioPiaReturn {
  const {
    apiKey,
    itemId,
    variationId,
    threadId: providedThreadId,
    cioClient: providedClient,
    suggestedQuestionsParameters,
    answerParameters,
    parameters,
    formatImageUrl,
  } = props;

  const { cioClient: client, threadId } = usePiaClient({
    apiKey,
    threadId: providedThreadId,
    cioClient: providedClient,
  });

  const mappedDeprecated = mapDeprecatedParameters(parameters);

  const mergedSuggestedParams =
    mappedDeprecated || suggestedQuestionsParameters
      ? { ...mappedDeprecated, ...suggestedQuestionsParameters }
      : undefined;

  const mergedAnswerParams =
    mappedDeprecated || answerParameters ? { ...mappedDeprecated, ...answerParameters } : undefined;

  const suggestedQuestions = useSuggestedQuestions({
    itemId,
    variationId,
    threadId,
    cioClient: client,
    parameters: mergedSuggestedParams,
  });

  const answers = useAnswerResults({
    itemId,
    variationId,
    threadId,
    cioClient: client,
    parameters: mergedAnswerParams,
    formatImageUrl,
  });

  return {
    cioClient: client,
    threadId,
    suggestedQuestions,
    answers,
  };
}
