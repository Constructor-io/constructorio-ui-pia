import { ConstructorClientOptions } from '@constructor-io/constructorio-client-javascript';

export type AgentUrlProps = {
  itemId: string;
  variationId?: string;
  /** Thread ID for conversation context. Must be a valid UUID (e.g., "550e8400-e29b-41d4-a716-446655440000") */
  threadId?: string;
  question?: string;
  isStreaming?: boolean;
  options: ConstructorClientOptions;
  parameters?: Record<string, string>;
};

export type GetSuggestedQuestionsProps = {
  itemId: string;
  variationId?: string;
  /** Thread ID for conversation context. Must be a valid UUID (e.g., "550e8400-e29b-41d4-a716-446655440000") */
  threadId?: string;
  parameters?: Record<string, any>;
};

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

export interface Question {
  value: string;
}

export interface QuestionResponse {
  questions: Array<Question>;
}

export interface AnswerResponse {
  value: string;
  alternative: string;
  follow_up_questions: Array<Question>;
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
