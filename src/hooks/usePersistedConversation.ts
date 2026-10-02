import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ConversationEntry } from '../types';
import {
  isGuest,
  loadConversation,
  moveGuestConversations,
  saveConversation,
} from '../utils/conversationStorage';

export interface UsePersistedConversationProps {
  enabled: boolean;
  apiKey: string;
  userId?: string | null;
  itemId: string;
  /** A caller's thread: only a stored conversation on that same thread is restored. */
  threadId?: string;
}

export interface PersistedConversationState {
  /** Changes whenever the conversation on screen is replaced by another stored one. */
  key: number;
  threadId: string;
  history: ConversationEntry[];
  save: (history: ConversationEntry[]) => void;
}

interface Target {
  enabled: boolean;
  apiKey: string;
  userId?: string;
  itemId: string;
  threadIdProp?: string;
}

interface Shown extends Target {
  key: number;
  threadId: string;
  history: ConversationEntry[];
  loggedIn: boolean;
}

function loadIfEnabled({
  enabled,
  apiKey,
  userId,
  itemId,
  threadIdProp,
}: Target): Pick<Shown, 'threadId' | 'history'> {
  if (!enabled) return { threadId: '', history: [] };
  const stored = loadConversation({ apiKey, userId }, itemId);
  if (stored && (!threadIdProp || stored.threadId === threadIdProp)) {
    return { threadId: stored.threadId, history: stored.entries };
  }
  // A product with nothing stored starts its own thread, so returning to another product resumes
  // a thread that only ever heard about that product.
  return { threadId: threadIdProp || crypto.randomUUID(), history: [] };
}

/** The stored conversation for this product and shopper, or `undefined` while persistence is off. */
export default function usePersistedConversation({
  enabled,
  apiKey,
  userId: userIdProp,
  itemId,
  threadId: threadIdProp,
}: UsePersistedConversationProps): PersistedConversationState | undefined {
  const userId = isGuest(userIdProp) ? undefined : String(userIdProp);

  const target: Target = { enabled, apiKey, userId, itemId, threadIdProp };

  const [shown, setShown] = useState<Shown>(() => ({
    ...target,
    key: 0,
    loggedIn: false,
    ...loadIfEnabled(target),
  }));

  // Adjusted during render, not in an effect: React re-renders before committing, so the first
  // request after a switch of product or shopper already goes out on the new thread.
  let current = shown;
  if (
    shown.enabled !== enabled ||
    shown.apiKey !== apiKey ||
    shown.userId !== userId ||
    shown.itemId !== itemId ||
    shown.threadIdProp !== threadIdProp
  ) {
    const loggedIn =
      enabled &&
      shown.enabled &&
      shown.apiKey === apiKey &&
      shown.userId === undefined &&
      userId !== undefined;
    // A login continues the conversation on screen as the shopper's own.
    const keepsConversation =
      loggedIn && shown.itemId === itemId && shown.threadIdProp === threadIdProp;
    const conversation = keepsConversation
      ? { key: shown.key, threadId: shown.threadId, history: shown.history }
      : { key: shown.key + 1, ...loadIfEnabled(target) };
    current = { ...target, loggedIn, ...conversation };
    setShown(current);
  }

  useEffect(() => {
    if (shown.loggedIn && shown.userId) moveGuestConversations(shown.apiKey, shown.userId);
  }, [shown]);

  const shownRef = useRef(shown);
  useEffect(() => {
    shownRef.current = shown;
  }, [shown]);

  const save = useCallback((history: ConversationEntry[]) => {
    const latest = shownRef.current;
    if (!latest.enabled) return;
    saveConversation(
      { apiKey: latest.apiKey, userId: latest.userId },
      latest.itemId,
      latest.threadId,
      history,
    );
  }, []);

  const { key, threadId, history } = current;
  return useMemo(
    () => (current.enabled ? { key, threadId, history, save } : undefined),
    [current.enabled, key, threadId, history, save],
  );
}
