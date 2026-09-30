import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import CioPia from '../../../src/components/CioPia/CioPia';
import type { CioPiaProps } from '../../../src/components/CioPia/types';
import { clearPersistedConversations } from '../../../src/utils/conversationStorage';
import { createMockCioClient, TestMockClient } from '../../helpers/mockCioClient';

jest.mock('../../../src/components/CioPiaControl/CioPiaControl', () => ({
  __esModule: true,
  default: () => <div data-testid='cio-pia-control-placeholder' />,
}));

const GUEST_KEY = 'cio-pia:chat:v1:test-api-key';
const SHOPPER_KEY = 'cio-pia:chat:v1:test-api-key:shopper-1';

let client: TestMockClient;

function props(overrides: Partial<CioPiaProps> = {}): CioPiaProps {
  return {
    apiKey: 'test-api-key',
    itemId: 'item-a',
    itemName: 'Item A',
    cioClient: client as unknown as CioPiaProps['cioClient'],
    displayConfigs: { mode: 'conversation' },
    persistConversation: { enabled: true },
    userId: null,
    ...overrides,
  };
}

function stored(storage: Storage, key: string) {
  return JSON.parse(storage.getItem(key) ?? 'null')?.items;
}

function lastThreadId() {
  const { calls } = client.agent.pia.getAnswerResults.mock;
  return (calls[calls.length - 1][2] as { threadId: string }).threadId;
}

async function ask(question: string, answer: string) {
  client.agent.pia.getAnswerResults.mockResolvedValueOnce({
    qna_result_id: `qna-${answer}`,
    value: answer,
  });
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: question } });
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
  await screen.findByText(answer);
}

function questions(container: HTMLElement) {
  return Array.from(container.querySelectorAll('.cio-pia-chat-question')).map((n) => n.textContent);
}

beforeEach(() => {
  window.sessionStorage.clear();
  window.localStorage.clear();
  client = createMockCioClient();
});

describe('persistConversation', () => {
  it("keeps a guest's conversation in sessionStorage and restores it on the same thread", async () => {
    const { unmount } = render(<CioPia {...props()} />);
    await ask('Is it waterproof?', 'Yes, up to 50 metres.');
    const threadId = lastThreadId();

    expect(stored(window.sessionStorage, GUEST_KEY)['item-a']).toMatchObject({
      threadId,
      entries: [{ question: 'Is it waterproof?', answer: 'Yes, up to 50 metres.' }],
    });
    expect(window.localStorage.length).toBe(0);
    unmount();

    render(<CioPia {...props()} />);
    expect(screen.getByText('Yes, up to 50 metres.')).toBeInTheDocument();

    await ask('Does it float?', 'It does.');
    expect(lastThreadId()).toBe(threadId);
  });

  it("keeps a signed-in shopper's conversation in localStorage under their id", async () => {
    render(<CioPia {...props({ userId: 'shopper-1' })} />);
    await ask('Is it waterproof?', 'Yes.');

    expect(stored(window.localStorage, SHOPPER_KEY)['item-a'].entries).toHaveLength(1);
    expect(window.sessionStorage.length).toBe(0);
  });

  it('shows each product its own conversation and thread', async () => {
    const { container, rerender } = render(<CioPia {...props()} />);
    await ask('Question about A', 'Answer about A');
    const threadA = lastThreadId();

    rerender(<CioPia {...props({ itemId: 'item-b', itemName: 'Item B' })} />);
    expect(questions(container)).toEqual([]);
    await ask('Question about B', 'Answer about B');
    expect(lastThreadId()).not.toBe(threadA);

    rerender(<CioPia {...props()} />);
    expect(questions(container)).toEqual(['Question about A']);
    await ask('Another about A', 'Second answer about A');
    expect(lastThreadId()).toBe(threadA);
  });

  it('carries the guest conversation over on login and continues it', async () => {
    const { container, rerender } = render(<CioPia {...props()} />);
    await ask('Is it waterproof?', 'Yes.');
    const threadId = lastThreadId();

    rerender(<CioPia {...props({ userId: 'shopper-1' })} />);
    expect(questions(container)).toEqual(['Is it waterproof?']);
    await waitFor(() => expect(window.sessionStorage.getItem(GUEST_KEY)).toBeNull());

    await ask('Does it float?', 'It does.');
    expect(lastThreadId()).toBe(threadId);
    expect(stored(window.localStorage, SHOPPER_KEY)['item-a'].entries).toHaveLength(2);
  });

  it("clears the screen and starts a new thread on logout, keeping the shopper's history", async () => {
    const { container, rerender } = render(<CioPia {...props({ userId: 'shopper-1' })} />);
    await ask('Is it waterproof?', 'Yes.');
    const threadId = lastThreadId();

    rerender(<CioPia {...props({ userId: null })} />);
    expect(questions(container)).toEqual([]);
    await ask('Guest question', 'Guest answer');
    expect(lastThreadId()).not.toBe(threadId);
    expect(stored(window.localStorage, SHOPPER_KEY)['item-a'].entries).toHaveLength(1);
  });

  it('prefers an explicit initialConversationHistory over the stored one', async () => {
    const { unmount } = render(<CioPia {...props()} />);
    await ask('Stored question', 'Stored answer');
    unmount();

    const { container } = render(
      <CioPia
        {...props({
          initialConversationHistory: [
            { id: 1, question: 'Host question', answer: 'Host answer', source: 'user' },
          ],
        })}
      />,
    );
    expect(questions(container)).toEqual(['Host question']);
  });

  it('restores nothing from another thread when threadId is passed', async () => {
    const { unmount } = render(<CioPia {...props()} />);
    await ask('Stored question', 'Stored answer');
    unmount();

    const otherThread = '550e8400-e29b-41d4-a716-446655440000';
    const { container } = render(<CioPia {...props({ threadId: otherThread })} />);
    expect(questions(container)).toEqual([]);
    await ask('New question', 'New answer');
    expect(lastThreadId()).toBe(otherThread);
  });

  it('keeps the conversation when the modal closes', async () => {
    const { container } = render(<CioPia {...props({ displayConfigs: { type: 'modal' } })} />);
    const footer = container.querySelector('.cio-pia-conversation-footer') as HTMLElement;
    client.agent.pia.getAnswerResults.mockResolvedValueOnce({ qna_result_id: 'q', value: 'Yes.' });
    const input = within(footer).getAllByRole('textbox')[0];
    fireEvent.change(input, { target: { value: 'Is it waterproof?' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    const dialog = container.querySelector('dialog') as HTMLDialogElement;
    await within(dialog).findByText('Yes.');

    fireEvent.click(within(dialog).getByRole('button', { name: 'Close' }));
    expect(questions(dialog)).toEqual(['Is it waterproof?']);
  });

  it('stores nothing when off, or in default mode', async () => {
    const { unmount } = render(<CioPia {...props({ persistConversation: undefined })} />);
    await ask('Q1', 'A1');
    unmount();

    render(<CioPia {...props({ displayConfigs: { mode: 'default' } })} />);
    await ask('Q2', 'A2');

    expect(window.sessionStorage.length).toBe(0);
    expect(window.localStorage.length).toBe(0);
  });

  it('shows nothing on the next mount after clearPersistedConversations', async () => {
    const { unmount } = render(<CioPia {...props({ userId: 'shopper-1' })} />);
    await ask('Is it waterproof?', 'Yes.');
    unmount();

    clearPersistedConversations({ apiKey: 'test-api-key', userId: 'shopper-1' });

    const { container } = render(<CioPia {...props({ userId: 'shopper-1' })} />);
    expect(questions(container)).toEqual([]);
  });
});
