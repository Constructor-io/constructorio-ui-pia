import React, { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselItemRenderProps,
  CarouselOverrides,
  IncludeComponentOverrides,
  IncludeRenderProps,
  ProductCard,
  RenderPropsWrapper,
} from '@constructor-io/constructorio-ui-components';
import Input from '../Input/Input';
import SuggestedQuestionsContainer from '../SuggestedQuestionsContainer/SuggestedQuestionsContainer';
import Answer from '../Answer/Answer';
import Feedback from '../Feedback/Feedback';
import MockConstructorIOClient from '../../hooks/mocks/MockConstructorIOClient';
import { DISCLAIMER_TEXT } from '../../constants';
import useCioPia from '../../hooks/useCioPia';
import ErrorBlock from '../Error/ErrorBlock';
import LoadingSkeleton from '../LoadingSkeleton/LoadingSkeleton';
import {
  CioPiaRenderProps,
  CioPiaComponentOverrides,
  Callbacks,
  DisplayConfigs,
  Item,
  Question,
} from '../../types';

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
  displayConfigs?: DisplayConfigs;
  callbacks?: Callbacks;
}

interface PiaCustomCarouselProps {
  items: Array<Item>;
  componentOverrides?: CarouselOverrides<Item>;
  callbacks?: Callbacks;
}

function PiaCustomCarousel({ items, componentOverrides, callbacks }: PiaCustomCarouselProps) {
  if (items.length === 0) {
    return null;
  }

  // Default item renderer with default click behavior
  const defaultItemRenderer = ({ item }: CarouselItemRenderProps<Item>) => {
    if (!item) {
      return null;
    }

    /**
     * Using props drilling as current implementation
     * until Event Listeners approach has been released in UI Components library
     */
    const handleProductClick = () => {
      if (callbacks?.onProductCardClick) {
        callbacks.onProductCardClick(item);
      } else if (item?.url) {
        window.open(item.url, '_blank', 'noopener,noreferrer');
      }
    };

    return (
      <ProductCard product={item} className='w-full h-full' onProductClick={handleProductClick} />
    );
  };

  // Merge user-provided overrides with default item renderer
  const mergedOverrides: CarouselOverrides<Item> = {
    ...componentOverrides,
    item: componentOverrides?.item ?? {
      reactNode: defaultItemRenderer,
    },
  };

  return <Carousel items={items} componentOverrides={mergedOverrides} />;
}

function Disclaimer({ learnMoreUrl }: { learnMoreUrl?: string }) {
  return (
    <span className='cio-pia-disclaimer'>
      {DISCLAIMER_TEXT}{' '}
      {learnMoreUrl && (
        <a
          href={learnMoreUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='cio-pia-learn-more'>
          <u>Learn More.</u>
        </a>
      )}
    </span>
  );
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
  } = props;
  const { learnMoreUrl, showFeedback } = displayConfigs || {};
  const { suggestedQuestions, answers } = useCioPia({
    apiKey,
    itemId,
    threadId,
    variationId,
    cioClient,
  });

  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [currentItems, setCurrentItems] = useState<Array<Item> | null>(null);
  const [displayedQuestions, setDisplayedQuestions] = useState<Question[]>([]);

  const handleSubmitQuestion = (question: string) => {
    setCurrentQuestion(question);
    answers.getAnswer(question);
  };

  useEffect(() => {
    setDisplayedQuestions(suggestedQuestions.data);
  }, [suggestedQuestions.data]);

  useEffect(() => {
    if (answers.data?.value) setCurrentAnswer(answers.data.value);
    if (answers.data?.follow_up_questions) setDisplayedQuestions(answers.data.follow_up_questions);
  }, [answers.data]);

  useEffect(() => {
    if (answers.items == null || answers.items.length === 0) {
      setCurrentItems(null);
    }

    if (answers.items != null && answers.items.length > 0) {
      setCurrentItems(answers.items);
    }
  }, [answers.items]);

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
          Any questions about this product?
        </p>
        <Input onSubmit={handleSubmitQuestion} value={currentQuestion} />

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
                {showFeedback && <Feedback />}
                <Disclaimer learnMoreUrl={learnMoreUrl} />
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
