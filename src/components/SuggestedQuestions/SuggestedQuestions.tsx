import React from 'react';
import SuggestedQuestionElement from './SuggestedQuestionElement';

interface SuggestedQuestionsProps {
  itemId: string;
  onQuestionClick: (question: string) => void;
}

const MOCK_QUESTIONS = [
  'Is this bunkie board suitable for a platform bed?',
  'What are the benefits of using a bunkie board with a platform bed?',
  'What is a bunkie board and how does it differ from a box spring?',
  'Is this bunkie board made in the USA?',
  'What sizes are available for this bunkie board?',
  'What is the recommended care for this bunkie board?',
  'Can a bunkie board be used with any type of mattress?',
  'How do I choose the right size bunkie board for my bed?',
  'How do I care for and maintain a bunkie board?',
];

export default function SuggestedQuestions({ itemId, onQuestionClick }: SuggestedQuestionsProps) {
  // Todo: Replace with useSuggestedQuestions hook
  const questions = MOCK_QUESTIONS;
  // const { questions, isLoading, error, refetch } = useSuggestedQuestions(itemId);

  return (
    <div className='cio-asa-pdp-suggested-questions-container'>
      <div className='cio-asa-pdp-suggested-questions-scroll'>
        {questions.map((question, index) => (
          <SuggestedQuestionElement
            key={index}
            question={question}
            onClick={() => onQuestionClick(question)}
          />
        ))}
      </div>
    </div>
  );
}
