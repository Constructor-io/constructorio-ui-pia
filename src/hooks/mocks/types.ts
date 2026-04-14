import {
  ConstructorClientOptions,
  ItemData,
} from '@constructor-io/constructorio-client-javascript';

export type AgentUrlProps = {
  itemId: string;
  variationId?: string;
  /** Thread ID for conversation context. Must be a valid UUID (e.g., "550e8400-e29b-41d4-a716-446655440000") */
  threadId?: string;
  question?: string;
  isStreaming?: boolean;
  options: ConstructorClientOptions;
  parameters?: Record<string, any>;
};

export type SuggestedQuestionsParameters = {
  numResults?: number;
};

export type GetSuggestedQuestionsProps = {
  itemId: string;
  variationId?: string;
  /** Thread ID for conversation context. Must be a valid UUID (e.g., "550e8400-e29b-41d4-a716-446655440000") */
  threadId?: string;
  parameters?: SuggestedQuestionsParameters;
};

export interface Question {
  value: string;
}

export interface QuestionResponse {
  questions: Array<Question>;
}

export type GetAnswerResultsProps = {
  itemId: string;
  variationId?: string;
  /** Thread ID for conversation context. Must be a valid UUID (e.g., "550e8400-e29b-41d4-a716-446655440000") */
  threadId?: string;
  question: string;
  parameters?: Record<string, any>;
};

export type GetAnswerResultsStreamProps = GetAnswerResultsProps & {
  onStart?: (event: StreamStartEvent) => void;
  onMessage?: (event: StreamMessageEvent) => void;
  onEnd?: (event: StreamEndEvent) => void;
};

/** Defines loose types for response-related types to account for future changes to API schema */
export interface ApiItemVariation extends Record<string, any> {
  value: string;
  data?: ItemData;
}

export interface ApiItem extends Record<string, any> {
  value: string;
  matched_terms: Array<string>;
  data: ItemData;
  variations?: Array<ApiItemVariation> | null;
  variations_map?: Record<string, any> | Array<Record<string, any>> | null;
}

export interface AnswerItemResults {
  request?: Record<string, any>;
  response: {
    results: Array<ApiItem>;
  };
}

export interface GetAnswerResultsResponse {
  qna_result_id: string;
  value: string;
  item_results?: AnswerItemResults;
  follow_up_questions?: Array<Question>;
  thread_id?: string;
}

export interface StreamStartEvent {
  qna_result_id: string;
}

export interface StreamMessageEvent {
  qna_result_id: string;
  text: string;
}

export interface StreamEndEvent {
  qna_result_id: string;
}
