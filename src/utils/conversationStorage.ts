import type { ClearPersistedConversationsOptions, ConversationEntry } from '../types';

const KEY_PREFIX = 'cio-pia:chat:v1';
const STORED_VERSION = 1;
/** Matches how long the agent remembers a thread. */
export const PERSISTENCE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/** Whose conversations a store holds: a signed-in shopper's, or the guest's when `userId` is empty. */
export interface ConversationOwner {
  apiKey: string;
  userId?: string | null;
}

export interface PersistedConversation {
  threadId: string;
  entries: ConversationEntry[];
  updatedAt: number;
}

type StoredItems = Record<string, PersistedConversation>;

export const isGuest = (userId: string | null | undefined): boolean =>
  userId == null || userId === '';

export function isRestorableEntry(entry: unknown): entry is ConversationEntry {
  if (typeof entry !== 'object' || entry === null) return false;
  const { question, answer, items } = entry as Partial<ConversationEntry>;
  return (
    typeof question === 'string' &&
    typeof answer === 'string' &&
    (items === undefined || items === null || Array.isArray(items))
  );
}

function isPersistedConversation(value: unknown): value is PersistedConversation {
  if (typeof value !== 'object' || value === null) return false;
  const { threadId, entries, updatedAt } = value as Partial<PersistedConversation>;
  return (
    typeof threadId === 'string' &&
    threadId !== '' &&
    typeof updatedAt === 'number' &&
    Array.isArray(entries) &&
    entries.every(isRestorableEntry)
  );
}

function storageKeyFor({ apiKey, userId }: ConversationOwner): string {
  const parts = isGuest(userId) ? [apiKey] : [apiKey, String(userId)];
  return [KEY_PREFIX, ...parts.map(encodeURIComponent)].join(':');
}

// A guest's conversations end with the tab, so the next person at that browser never sees them.
function storageFor({ userId }: ConversationOwner): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    return isGuest(userId) ? window.sessionStorage : window.localStorage;
  } catch {
    return null;
  }
}

function readItems(storage: Storage, key: string): StoredItems {
  try {
    const parsed = JSON.parse(storage.getItem(key) ?? 'null');
    if (parsed?.version !== STORED_VERSION || typeof parsed.items !== 'object' || !parsed.items) {
      return {};
    }
    const cutoff = Date.now() - PERSISTENCE_TTL_MS;
    return Object.fromEntries(
      Object.entries(parsed.items as Record<string, unknown>).filter(
        (pair): pair is [string, PersistedConversation] =>
          isPersistedConversation(pair[1]) && pair[1].updatedAt >= cutoff,
      ),
    );
  } catch {
    return {};
  }
}

function tryWrite(storage: Storage, key: string, items: StoredItems): boolean {
  try {
    if (Object.keys(items).length === 0) storage.removeItem(key);
    else storage.setItem(key, JSON.stringify({ version: STORED_VERSION, items }));
    return true;
  } catch {
    return false;
  }
}

// When storage is full, shed other products' conversations oldest first, then this one's oldest
// turns. If not even one turn fits, this conversation is left out rather than stored half-written.
function writeFitting(storage: Storage, key: string, items: StoredItems, itemId: string): void {
  if (tryWrite(storage, key, items)) return;

  const { [itemId]: saved, ...others } = items;
  const oldestFirst = Object.keys(others).sort((a, b) => others[a].updatedAt - others[b].updatedAt);
  const fitsAfterEviction = oldestFirst.some((_, index) => {
    const kept = Object.fromEntries(oldestFirst.slice(index + 1).map((id) => [id, others[id]]));
    return tryWrite(storage, key, { ...kept, [itemId]: saved });
  });
  if (fitsAfterEviction) return;

  const fitsTrimmed = saved.entries.some((_, index) =>
    index === 0
      ? false
      : tryWrite(storage, key, { [itemId]: { ...saved, entries: saved.entries.slice(index) } }),
  );
  if (fitsTrimmed) return;

  const withoutSaved = readItems(storage, key);
  delete withoutSaved[itemId];
  tryWrite(storage, key, withoutSaved);
}

export function loadConversation(
  owner: ConversationOwner,
  itemId: string,
): PersistedConversation | undefined {
  const storage = storageFor(owner);
  return storage ? readItems(storage, storageKeyFor(owner))[itemId] : undefined;
}

/** Stores the answered turns of one product's conversation. A turn still waiting on its answer is left out. */
export function saveConversation(
  owner: ConversationOwner,
  itemId: string,
  threadId: string,
  history: ConversationEntry[],
): void {
  const entries = history.filter((entry) => entry.answer !== '');
  const storage = storageFor(owner);
  if (!storage || entries.length === 0) return;

  const key = storageKeyFor(owner);
  const items = readItems(storage, key);
  writeFitting(
    storage,
    key,
    { ...items, [itemId]: { threadId, entries, updatedAt: Date.now() } },
    itemId,
  );
}

/** On login: every guest conversation moves into the shopper's store, so none is left for the next guest. */
export function moveGuestConversations(apiKey: string, userId: string): void {
  const guest = { apiKey };
  const shopper = { apiKey, userId };
  const guestStorage = storageFor(guest);
  const shopperStorage = storageFor(shopper);
  if (!guestStorage || !shopperStorage) return;

  const guestKey = storageKeyFor(guest);
  const moved = readItems(guestStorage, guestKey);
  if (Object.keys(moved).length === 0) return;

  const shopperKey = storageKeyFor(shopper);
  const merged = readItems(shopperStorage, shopperKey);
  Object.entries(moved).forEach(([itemId, conversation]) => {
    if ((merged[itemId]?.updatedAt ?? -Infinity) <= conversation.updatedAt) {
      merged[itemId] = conversation;
    }
  });

  if (tryWrite(shopperStorage, shopperKey, merged)) tryWrite(guestStorage, guestKey, {});
}

/**
 * Deletes every stored conversation of one shopper, or of the current tab's guest when `userId` is
 * omitted. A widget already showing one keeps it on screen until its `itemId` or `userId` changes.
 */
export function clearPersistedConversations({
  apiKey,
  userId,
}: ClearPersistedConversationsOptions): void {
  const owner = { apiKey, userId };
  const storage = storageFor(owner);
  if (storage) tryWrite(storage, storageKeyFor(owner), {});
}
