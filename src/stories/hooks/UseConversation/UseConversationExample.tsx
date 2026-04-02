import React, { useState } from 'react';
import useCioPia from '../../../hooks/useCioPia';
import useConversation from '../../../hooks/useConversation';
import DisplayHookExample from '../DisplayHookExample';
import { DEMO_API_KEY } from '../../../constants';

interface UseConversationExampleProps {
  itemId: string;
  question: string;
  isConversation: boolean;
}

export default function UseConversationExample(props: UseConversationExampleProps) {
  const { itemId, question, isConversation } = props;
  const [submitted, setSubmitted] = useState(false);
  const cioClient = useCioPia({ apiKey: DEMO_API_KEY, itemId });
  const conversation = useConversation({ pia: cioClient, itemId, isConversation });

  const handleAsk = () => {
    conversation.handleSubmitQuestion(question);
    setSubmitted(true);
  };

  const { handleSubmitQuestion, resetState, ...displayData } = conversation;

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '10px', display: 'flex', gap: '8px' }}>
        <button type='button' onClick={handleAsk} disabled={submitted && displayData.isLoading}>
          Ask Question
        </button>
        <button
          type='button'
          onClick={() => {
            resetState();
            setSubmitted(false);
          }}>
          Reset
        </button>
      </div>
      <DisplayHookExample content={JSON.stringify(displayData, null, 2)} />
    </div>
  );
}
