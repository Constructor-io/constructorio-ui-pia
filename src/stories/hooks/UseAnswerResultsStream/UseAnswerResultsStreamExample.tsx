import React, { useState } from 'react';
import useAnswerResultsStream, {
  UseAnswerResultsStreamProps,
} from '../../../hooks/useAnswerResultsStream';
import { StreamStartEvent, StreamMessageEvent, StreamEndEvent } from '../../../hooks/mocks/types';

// Omit for testing purposes
type UseAnswerResultsStreamExampleProps = Omit<
  UseAnswerResultsStreamProps,
  'onStart' | 'onMessage' | 'onEnd'
>;

export default function UseAnswerResultsStreamExample(props: UseAnswerResultsStreamExampleProps) {
  const { itemId, question } = props;
  const [message, setMessage] = useState<string>('');
  const [resultId, setResultId] = useState<string | null>(null);
  const [answerReceived, setAnswerReceived] = useState(false);

  const handleStart = (data: StreamStartEvent) => {
    setResultId(data.qna_result_id);
    setMessage('');
    setAnswerReceived(false);
  };

  const handleMessage = (data: StreamMessageEvent) => {
    setMessage(data.text);
  };

  const handleEnd = (data: StreamEndEvent) => {
    setAnswerReceived(true);
  };

  const { isStreaming, error, startStream, stopStream } = useAnswerResultsStream({
    itemId,
    question,
    onStart: handleStart,
    onMessage: handleMessage,
    onEnd: handleEnd,
  });

  return (
    <div>
      <h3>Question: {question}</h3>
      <p>Item ID: {itemId}</p>
      {!isStreaming ? (
        <button onClick={startStream} disabled={isStreaming} type='button'>
          Start Streaming
        </button>
      ) : (
        <button onClick={stopStream} disabled={!isStreaming} type='button'>
          Stop Streaming
        </button>
      )}

      {isStreaming && <p>Streaming...</p>}

      {error && (
        <div>
          <strong>Error:</strong> {error.message}
        </div>
      )}

      {answerReceived && (
        <div>
          <p>Result ID: {resultId}</p>
          <p>
            <strong>Answer:</strong> {message}
          </p>
        </div>
      )}
    </div>
  );
}
