import React from 'react';
import {
  ComponentOverrideProps,
  RenderPropsWrapper,
} from '@constructor-io/constructorio-ui-components';
import { AnswerRenderProps } from '../../types';

interface AnswerProps {
  text: string;
  componentOverride?: ComponentOverrideProps<AnswerRenderProps>;
}

function Answer({ text, componentOverride }: AnswerProps) {
  if (!text) {
    return null;
  }

  return (
    <RenderPropsWrapper props={{ text }} override={componentOverride?.reactNode}>
      <div className='cio-pia-answer' data-testid='answer-text'>
        {text}
      </div>
    </RenderPropsWrapper>
  );
}

export default Answer;
