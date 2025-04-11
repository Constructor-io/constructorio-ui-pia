import { ConstructorClientOptions } from '@constructor-io/constructorio-client-javascript';

export type AssistantUrlProps = {
  itemId: string;
  question?: string;
  isStreaming?: boolean;
  options: ConstructorClientOptions;
  parameters?: Record<string, string>;
};

export interface Question {
  value: string;
}

export interface QuestionResponse {
  questions: Array<Question>;
}
