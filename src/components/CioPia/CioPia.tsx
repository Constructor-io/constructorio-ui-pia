import React, { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselItemRenderProps,
  CarouselOverrides,
  IncludeComponentOverrides,
  ProductCard,
} from '@constructor-io/constructorio-ui-components';
import Input from '../Input/Input';
import SuggestedQuestionsContainer from '../SuggestedQuestionsContainer/SuggestedQuestionsContainer';
import Answer from '../Answer/Answer';
import Feedback from '../Feedback/Feedback';
import MockConstructorIOClient from '../../hooks/mocks/MockConstructorIOClient';
import { DISCLAIMER_TEXT } from '../../constants';
import { Question } from '../../hooks/mocks/types';
import useCioPia from '../../hooks/useCioPia';
import ErrorBlock from '../Error/ErrorBlock';
import LoadingSkeleton from '../LoadingSkeleton/LoadingSkeleton';
import { CioPiaComponentOverrides, CioPiaDisplayConfigs, Item } from '../../types';

export interface CioPiaProps extends IncludeComponentOverrides<CioPiaComponentOverrides> {
  apiKey: string;
  itemId: string;
  /** Thread ID for conversation context. Must be a valid UUID (e.g., "550e8400-e29b-41d4-a716-446655440000") */
  threadId?: string;
  variationId?: string;
  cioClient?: MockConstructorIOClient;
  displayConfigs?: CioPiaDisplayConfigs;
}

interface PiaCustomCarouselProps {
  items: Array<Item>;
  componentOverrides?: CarouselOverrides<Item>;
}

function PiaCustomCarousel({ items, componentOverrides }: PiaCustomCarouselProps) {
  if (items.length === 0) {
    return null;
  }

  // Default item renderer with default click behavior
  const defaultItemRenderer = (props: CarouselItemRenderProps<Item>) => {
    if (!props.item) {
      return null;
    }

    return (
      <ProductCard
        product={props.item}
        className='w-full h-full'
        onProductClick={() => {
          if (props.item?.url) {
            window.open(props.item.url, '_blank', 'noopener,noreferrer');
          }
        }}
      />
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

export default function CioPia(props: CioPiaProps) {
  const { apiKey, itemId, threadId, variationId, cioClient, displayConfigs, componentOverrides } =
    props;
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
  const [currentItems, setCurrentItems] = useState<Array<Item>>([]);
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
    if (answers.items && answers.items.length > 0) setCurrentItems(answers.items);
  }, [answers.items]);

  const error = answers.error || suggestedQuestions.error;
  const isLoading = answers.isLoading || suggestedQuestions.isLoading;

  return (
    <div className='cio-pia-container' data-testid='cio-pia-container'>
      <p className='cio-pia-title' data-testid='cio-pia-title'>
        Any questions about this product?
      </p>
      <Input onSubmit={handleSubmitQuestion} value={currentQuestion} />
      {isLoading && <LoadingSkeleton />}
      {!isLoading &&
        (error ? (
          <ErrorBlock
            message={
              answers.error?.message || suggestedQuestions.error?.message || 'Unexpected error'
            }
          />
        ) : (
          <>
            {!!currentAnswer && (
              <div className='cio-pia-answer-container'>
                <Answer text={currentAnswer} />
                <PiaCustomCarousel
                  items={currentItems}
                  componentOverrides={componentOverrides?.carousel}
                />
                {!!showFeedback && <Feedback />}
                <span className='cio-pia-disclaimer'>
                  {DISCLAIMER_TEXT}{' '}
                  {!!learnMoreUrl && (
                    <a
                      href={learnMoreUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='cio-pia-learn-more'>
                      <u>Learn More.</u>
                    </a>
                  )}
                </span>
              </div>
            )}

            <SuggestedQuestionsContainer
              questions={displayedQuestions}
              onQuestionClick={handleSubmitQuestion}
            />
          </>
        ))}
    </div>
  );
}
