import { useCioAsaPdpContext } from './useCioAsaPdpContext';
import useSuggestedQuestions, { UseSuggestedQuestionsResponse } from './useSuggestedQuestions';

export interface UseCioAsaPdpResponse {
  // TODO: Add the rest of the hook's return type
  questions: UseSuggestedQuestionsResponse;
}

export default function useCioAsaPdp() {
  const context = useCioAsaPdpContext();

  if (!context) {
    throw new Error('useCioAsaPdp() function must be used within <CioAsaPdp />');
  }

  if (!context.itemId) {
    throw new Error('Item ID is not available. Make sure to provide it in the <CioAsaPdp />');
  }

  const questions = useSuggestedQuestions({ itemId: context.itemId });

  return {
    questions,
  };
}
