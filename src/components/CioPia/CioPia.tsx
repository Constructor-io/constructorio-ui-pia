import React, { useCallback, useEffect, useState } from 'react';
import {
  IncludeComponentOverrides,
  IncludeRenderProps,
  RenderPropsWrapper,
} from '@constructor-io/constructorio-ui-components';
import Disclaimer from './Disclaimer';
import Input from '../Input/Input';
import SuggestedQuestionsContainer from '../SuggestedQuestionsContainer/SuggestedQuestionsContainer';
import Answer from '../Answer/Answer';
import Feedback from '../Feedback/Feedback';
import MockConstructorIOClient from '../../hooks/mocks/MockConstructorIOClient';
import useCioPia from '../../hooks/useCioPia';
import ErrorBlock from '../Error/ErrorBlock';
import LoadingSkeleton from '../LoadingSkeleton/LoadingSkeleton';
import {
  CioPiaRenderProps,
  CioPiaComponentOverrides,
  Callbacks,
  CioPiaDisplayConfigs,
  Translations,
  Question,
} from '../../types';
import { translate } from '../../utils/translate';
import PiaCustomCarousel from './PiaCustomCarousel';

export interface CioPiaProps
  extends
    IncludeRenderProps<CioPiaRenderProps>,
    IncludeComponentOverrides<CioPiaComponentOverrides> {
  apiKey: string;
  itemId: string;
  /** Thread ID for conversation context. Must be a valid UUID (e.g., "550e8400-e29b-41d4-a716-446655440000") */
  threadId?: string;
  variationId?: string;
  cioClient?: MockConstructorIOClient;
  displayConfigs?: CioPiaDisplayConfigs;
  callbacks?: Callbacks;
  translations?: Translations;
}

export default function CioPia(props: CioPiaProps) {
  const {
    apiKey,
    itemId,
    threadId,
    variationId,
    cioClient,
    displayConfigs,
    componentOverrides,
    callbacks,
    children,
    translations,
  } = props;
  const { learnMoreUrl, showFeedback } = displayConfigs || {};
  const { suggestedQuestions, answers } = useCioPia({
    apiKey,
    itemId,
    threadId,
    variationId,
    cioClient,
  });
  const { getAnswer } = answers;

  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [displayedQuestions, setDisplayedQuestions] = useState<Question[]>([]);

  const handleSubmitQuestion = useCallback(
    (question: string) => {
      setCurrentQuestion(question);
      getAnswer(question);
    },
    [getAnswer],
  );

  useEffect(() => {
    setDisplayedQuestions(suggestedQuestions.data);
  }, [suggestedQuestions.data]);

  useEffect(() => {
    if (answers.data?.follow_up_questions) setDisplayedQuestions(answers.data.follow_up_questions);
  }, [answers.data]);

  const currentAnswer = answers.data?.value ?? '';
  const currentItems = answers.items ?? null;
  const error = answers.error || suggestedQuestions.error;
  const isLoading = answers.isLoading || suggestedQuestions.isLoading;

  // Build render props to pass to children function or componentOverrides.reactNode
  const renderProps: CioPiaRenderProps = {
    items: currentItems,
    isLoading,
    error,
    currentAnswer,
    currentQuestion,
    displayedQuestions,
    handleSubmitQuestion,
  };

  return (
    <div className='cio-pia-container' data-testid='cio-pia-container'>
      <RenderPropsWrapper props={renderProps} override={children || componentOverrides?.reactNode}>
        <p className='cio-pia-title' data-testid='cio-pia-title'>
          {translate('Any questions about this product?', translations)}
        </p>
        <Input
          onSubmit={handleSubmitQuestion}
          value={currentQuestion}
          translations={translations}
        />

        {isLoading && <LoadingSkeleton />}

        {!isLoading && error && (
          <ErrorBlock
            message={
              answers.error?.message || suggestedQuestions.error?.message || 'Unexpected error'
            }
          />
        )}

        {!isLoading && !error && (
          <>
            {currentAnswer && (
              <div className='cio-pia-answer-container'>
                <Answer text={currentAnswer} />
                {currentItems && (
                  <PiaCustomCarousel
                    items={currentItems}
                    componentOverrides={componentOverrides?.carousel}
                    callbacks={callbacks}
                  />
                )}
                {showFeedback && <Feedback translations={translations} />}
                <Disclaimer learnMoreUrl={learnMoreUrl} translations={translations} />
              </div>
            )}

            <SuggestedQuestionsContainer
              questions={displayedQuestions}
              onQuestionClick={handleSubmitQuestion}
            />
          </>
        )}
      </RenderPropsWrapper>
    </div>
  );
}
