import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CioPia from '../../../components/CioPia/CioPia';
import { DEMO_API_KEY, DEMO_ITEM_ID } from '../../../constants';
import { FeedbackType, InputRenderProps } from '../../../types';

const LOADING_MESSAGES = ['Thinking', 'Searching the catalog', 'Cooking up an answer'];

function CyclingLoader() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      key={index}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginTop: '12px',
        color: '#6b7280',
        fontSize: '14px',
        fontStyle: 'italic',
        animation: 'cioPiaLoaderFade 0.4s ease-in',
      }}>
      <style>
        {`
          @keyframes cioPiaLoaderFade {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes cioPiaLoaderDot {
            0%, 80%, 100% { opacity: 0.2; }
            40% { opacity: 1; }
          }
        `}
      </style>
      <span>{LOADING_MESSAGES[index]}</span>
      <span style={{ display: 'inline-flex', gap: '2px' }}>
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: 'currentColor',
              animation: 'cioPiaLoaderDot 1.4s infinite ease-in-out',
              animationDelay: `${dot * 0.2}s`,
            }}
          />
        ))}
      </span>
    </div>
  );
}

const meta = {
  title: 'Components/CioPia/ComponentOverrides',
  component: CioPia,
  parameters: {
    layout: 'centered',
  },
  tags: [],
} satisfies Meta<typeof CioPia>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CustomAnswer: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    componentOverrides: {
      answer: {
        reactNode: ({ text }) => (
          <div
            style={{
              padding: '16px',
              background: '#f0f7ff',
              borderRadius: '8px',
              borderLeft: '4px solid #2563eb',
            }}>
            <strong>AI Response:</strong>
            <p style={{ margin: '8px 0 0' }}>{text}</p>
          </div>
        ),
      },
    },
  },
};

export const CustomSuggestedQuestions: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    componentOverrides: {
      suggestedQuestions: {
        reactNode: ({ questions, onQuestionClick }) => (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
            {questions.map((q) => (
              <button
                type='button'
                key={q.value}
                onClick={() => onQuestionClick(q.value)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: '1px solid #d1d5db',
                  background: '#fff',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}>
                {q.value}
              </button>
            ))}
          </div>
        ),
      },
    },
  },
};

export const CustomDisclaimer: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    componentOverrides: {
      disclaimer: {
        reactNode: ({ learnMoreUrl }) => (
          <p style={{ fontSize: '11px', color: '#9ca3af', fontStyle: 'italic', marginTop: '12px' }}>
            Powered by Constructor AI.{' '}
            {learnMoreUrl && (
              <a href={learnMoreUrl} target='_blank' rel='noopener noreferrer'>
                Learn more
              </a>
            )}
          </p>
        ),
      },
    },
    displayConfigs: {
      learnMoreUrl: 'https://constructor.io',
    },
  },
};

export const CustomFeedback: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    displayConfigs: {
      showFeedback: true,
    },
    componentOverrides: {
      feedback: {
        reactNode: ({ onFeedback }) => (
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button
              type='button'
              onClick={() => onFeedback?.(FeedbackType.UP)}
              style={{
                padding: '4px 12px',
                borderRadius: '4px',
                border: '1px solid #d1d5db',
                background: '#fff',
                cursor: 'pointer',
              }}>
              Helpful
            </button>
            <button
              type='button'
              onClick={() => onFeedback?.(FeedbackType.DOWN)}
              style={{
                padding: '4px 12px',
                borderRadius: '4px',
                border: '1px solid #d1d5db',
                background: '#fff',
                cursor: 'pointer',
              }}>
              Not helpful
            </button>
          </div>
        ),
      },
    },
  },
};

export const CustomLoading: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    componentOverrides: {
      loading: {
        reactNode: () => <CyclingLoader />,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'A fully custom loading indicator with animated dots and a message that cycles every ' +
          'two seconds (e.g. "Thinking" → "Searching the catalog" → "Cooking up an answer"). ' +
          'Ask a question to see it while the answer is generated.',
      },
      source: {
        code: `const LOADING_MESSAGES = ['Thinking', 'Searching the catalog', 'Cooking up an answer'];

function CyclingLoader() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="my-loader">
      <span>{LOADING_MESSAGES[index]}</span>
      <span className="my-loader__dots" />
    </div>
  );
}

<CioPia
  apiKey="YOUR_API_KEY"
  itemId="YOUR_ITEM_ID"
  componentOverrides={{
    loading: { reactNode: () => <CyclingLoader /> },
  }}
/>`,
      },
    },
  },
};

export const CustomLoadingWithSkeleton: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    componentOverrides: {
      loading: {
        reactNode: ({ skeleton }) => (
          <div>
            <p
              style={{
                fontSize: '14px',
                color: '#6b7280',
                fontStyle: 'italic',
                margin: '0 0 8px',
              }}>
              Thinking…
            </p>
            {skeleton}
          </div>
        ),
      },
    },
  },
};

function GrowingTextarea({ onSubmit, placeholder, disabled, onFocus }: InputRenderProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  }, []);

  const handleSubmit = useCallback(() => {
    if (text.trim()) {
      onSubmit(text.trim());
      setText('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  }, [text, onSubmit]);

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', width: '100%' }}>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          resize();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        onFocus={onFocus}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        style={{
          flex: 1,
          resize: 'none',
          overflow: 'hidden',
          padding: '8px 12px',
          border: '1px solid #E7E5E4',
          borderRadius: '6px',
          fontSize: '14px',
          lineHeight: '1.43',
          fontFamily: 'inherit',
        }}
      />
      <button
        type='button'
        onClick={handleSubmit}
        disabled={disabled}
        style={{
          padding: '8px 12px',
          background: '#14151a',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 500,
        }}>
        Send
      </button>
    </div>
  );
}

export const CustomInput: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    itemName: 'Demo Item',
    componentOverrides: {
      input: {
        reactNode: (props) => <GrowingTextarea {...props} />,
      },
    },
  },
};

export const FullCustomLayout: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    componentOverrides: {
      reactNode: ({
        currentAnswer,
        displayedQuestions,
        handleSubmitQuestion,
        isLoading,
        items,
      }) => (
        <div
          style={{
            padding: '24px',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            maxWidth: '500px',
            fontFamily: 'system-ui, sans-serif',
          }}>
          <h3 style={{ margin: '0 0 16px' }}>Ask about this product</h3>

          {displayedQuestions.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                marginBottom: '16px',
              }}>
              {displayedQuestions.map((q) => (
                <button
                  type='button'
                  key={q.value}
                  onClick={() => handleSubmitQuestion(q.value)}
                  style={{
                    padding: '10px 14px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    background: '#fafafa',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '14px',
                  }}>
                  {q.value}
                </button>
              ))}
            </div>
          )}

          {isLoading && <p style={{ color: '#6b7280' }}>Thinking...</p>}

          {currentAnswer && (
            <div
              style={{
                padding: '16px',
                background: '#f9fafb',
                borderRadius: '8px',
                marginTop: '12px',
              }}>
              <p style={{ margin: 0 }}>{currentAnswer}</p>
            </div>
          )}

          {items && items.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', overflowX: 'auto' }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '8px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    minWidth: '120px',
                    textAlign: 'center',
                    fontSize: '12px',
                  }}>
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                    />
                  )}
                  <p style={{ margin: '4px 0 0', fontWeight: 500 }}>{item.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
  },
};
