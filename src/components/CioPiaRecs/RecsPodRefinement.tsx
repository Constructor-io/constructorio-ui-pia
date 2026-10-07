import React, { useCallback } from 'react';
import Input from '../Input/Input';
import SuggestedQuestion from '../SuggestedQuestion/SuggestedQuestion';
import { SparklesIcon } from '../icons';
import RecsOptionsSkeleton from './RecsOptionsSkeleton';
import { CioPiaComponentOverrides, RecsRefinement, Translations } from '../../types';
import { resolveRefinementQuestion } from '../../utils/recs';
import { RECS_INPUT_PLACEHOLDER } from '../../constants';
import useReturnFocusToInput from '../../hooks/useReturnFocusToInput';

interface RecsPodRefinementProps {
  refinement: RecsRefinement | null;
  isLoading: boolean;
  /** Message for a value the shopper submitted that came back rejected. */
  inputError: string | null;
  showInput: boolean;
  translations?: Translations;
  componentOverrides?: CioPiaComponentOverrides;
  onRefine: (text: string) => void;
  onSubmit: (value: string) => void;
  onInputFocus: () => void;
}

/**
 * The row under the products: a prompt line, the short options the API suggested, and a box for
 * anything it did not think of. The prompt line is held still while the rest reloads, so the row
 * never changes height under the shopper's cursor.
 */
export default function RecsPodRefinement({
  refinement,
  isLoading,
  inputError,
  showInput,
  translations,
  componentOverrides,
  onRefine,
  onSubmit,
  onInputFocus,
}: RecsPodRefinementProps) {
  const options = refinement?.options || [];
  const { inputRef, returnFocusAfterLoading } = useReturnFocusToInput(isLoading);

  const refine = useCallback(
    (text: string) => {
      onRefine(text);
      returnFocusAfterLoading();
    },
    [onRefine, returnFocusAfterLoading],
  );

  const submit = useCallback(
    (value: string) => {
      onSubmit(value);
      returnFocusAfterLoading();
    },
    [onSubmit, returnFocusAfterLoading],
  );

  return (
    <div className='cio-pia-recs-pod__refinement'>
      <span className='cio-pia-recs-pod__refinement-label'>
        {resolveRefinementQuestion(refinement, translations)}
      </span>

      {isLoading ? (
        <RecsOptionsSkeleton count={options.length || undefined} />
      ) : (
        options.map((option) => (
          <SuggestedQuestion
            key={option}
            question={option}
            icon={<SparklesIcon />}
            onClick={() => refine(option)}
          />
        ))
      )}

      {showInput && (
        <div className='cio-pia-recs-pod__input'>
          {/*
            Never stood in for by a skeleton, not even on the first load: swapping it out
            unmounts the field, which discards the text the shopper had typed and their focus
            along with it. Disabling it holds its place instead.
          */}
          <Input
            onSubmit={submit}
            onFocus={onInputFocus}
            inputRef={inputRef}
            disabled={isLoading}
            error={inputError ?? undefined}
            placeholderKey={RECS_INPUT_PLACEHOLDER}
            // The pod's box sits in a row beside the options and submits on Enter. Q&A keeps
            // its button; this one has none in the mocks.
            showSendButton={false}
            translations={translations}
            componentOverride={componentOverrides?.input}
          />
        </div>
      )}
    </div>
  );
}
