import { ConstructorClientOptions } from '@constructor-io/constructorio-client-javascript';

export interface AssistantUrlProps {
  itemId: string;
  question?: string;
  isStreaming?: boolean;
  options: ConstructorClientOptions;
  parameters?: Record<string, string>;
}

export interface Question {
  value: string;
}

export interface QuestionResponse {
  questions: Array<Question>;
}

export interface AnswerResponse {
  value: string;
  alternative: string;
  follow_up_questions: Array<string>;
}

export type GetAnswerResponseStreamingProps = {
  itemId: string;
  question: string;
  parameters?: Record<string, any>;
  onStart?: (event: StreamStartEvent) => void;
  onMessage?: (event: StreamMessageEvent) => void;
  onEnd?: (event: StreamEndEvent) => void;
};

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
