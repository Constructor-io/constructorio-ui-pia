import React from 'react';

interface AnswerProps {
    answerText: string;
    isLoading: boolean;
}

function LoadingComponet() {
    return (
        <div className='cio-asa-pdp-answer-loading'>
            <div className='skeleton-bar'></div>
            <div className='skeleton-bar'></div>
            <div className='skeleton-bar skeleton-short'></div>
        </div>
    );
}

function Answer({ answerText, isLoading }: AnswerProps) {
    return (
    <div className='cio-asa-pdp-answer-container'>
        {isLoading ? (
            <LoadingComponet />
        ) : (
            <div className='cio-asa-pdp-answer-text'>{answerText}</div>
        )}
    </div>
    );
  }
  
  export default Answer;
