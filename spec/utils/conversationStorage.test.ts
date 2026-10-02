import {
  PERSISTENCE_TTL_MS,
  clearPersistedConversations,
  loadConversation,
  moveGuestConversations,
  saveConversation,
} from '../../src/utils/conversationStorage';
import { ConversationEntry } from '../../src/types';

const guest = { apiKey: 'key' };
const shopper = { apiKey: 'key', userId: 'u1' };

const turn = (question: string, answer = `answer to ${question}`): ConversationEntry => ({
  id: 1,
  question,
  answer,
  source: 'user',
});

beforeEach(() => {
  jest.restoreAllMocks();
  window.sessionStorage.clear();
  window.localStorage.clear();
});

describe('conversationStorage', () => {
  it('leaves out a turn still waiting on its answer', () => {
    saveConversation(guest, 'item', 't1', [turn('q1'), turn('q2', '')]);
    expect(loadConversation(guest, 'item')?.entries.map((e) => e.question)).toEqual(['q1']);
  });

  it('stores nothing for a conversation with no answered turn', () => {
    saveConversation(guest, 'item', 't1', [turn('q1', '')]);
    expect(window.sessionStorage.length).toBe(0);
  });

  it('drops conversations idle past the TTL', () => {
    const now = Date.now();
    jest.spyOn(Date, 'now').mockReturnValue(now);
    saveConversation(guest, 'item', 't1', [turn('q1')]);

    jest.spyOn(Date, 'now').mockReturnValue(now + PERSISTENCE_TTL_MS + 1);
    expect(loadConversation(guest, 'item')).toBeUndefined();
  });

  it('ignores malformed or foreign data', () => {
    const key = 'cio-pia:chat:v1:key';
    window.sessionStorage.setItem(key, '{not json');
    expect(loadConversation(guest, 'item')).toBeUndefined();

    window.sessionStorage.setItem(
      key,
      JSON.stringify({
        version: 1,
        items: {
          good: { threadId: 't', updatedAt: Date.now(), entries: [turn('q')] },
          bad: { threadId: 't', updatedAt: Date.now(), entries: [{ question: 1 }] },
        },
      }),
    );
    expect(loadConversation(guest, 'good')).toBeDefined();
    expect(loadConversation(guest, 'bad')).toBeUndefined();
  });

  it('keeps working when storage is blocked', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    expect(() => saveConversation(guest, 'item', 't1', [turn('q1')])).not.toThrow();
    expect(loadConversation(guest, 'item')).toBeUndefined();
  });

  describe('when storage is full', () => {
    function limitStorageTo(maxChars: number) {
      const realSetItem = Storage.prototype.setItem;
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(function setItem(
        this: Storage,
        key: string,
        value: string,
      ) {
        if (value.length > maxChars) throw new DOMException('full', 'QuotaExceededError');
        realSetItem.call(this, key, value);
      });
    }

    it("evicts other products' conversations, oldest first", () => {
      const now = Date.now();
      const spy = jest.spyOn(Date, 'now');
      spy.mockReturnValue(now);
      saveConversation(guest, 'oldest', 't1', [turn('x'.repeat(200))]);
      spy.mockReturnValue(now + 1);
      saveConversation(guest, 'newer', 't2', [turn('y'.repeat(200))]);

      const size = window.sessionStorage.getItem('cio-pia:chat:v1:key')!.length;
      limitStorageTo(size + 20);
      spy.mockReturnValue(now + 2);
      saveConversation(guest, 'current', 't3', [turn('z'.repeat(200))]);

      expect(loadConversation(guest, 'oldest')).toBeUndefined();
      expect(loadConversation(guest, 'newer')).toBeDefined();
      expect(loadConversation(guest, 'current')).toBeDefined();
    });

    it("then drops the saved conversation's oldest turns", () => {
      limitStorageTo(400);
      saveConversation(guest, 'item', 't1', [turn('a'.repeat(200)), turn('b'.repeat(100))]);
      expect(loadConversation(guest, 'item')?.entries.map((e) => e.question[0])).toEqual(['b']);
    });

    it('stores nothing rather than keep a stale copy when not even one turn fits', () => {
      saveConversation(guest, 'item', 't1', [turn('small')]);
      limitStorageTo(50);
      saveConversation(guest, 'item', 't1', [turn('small'), turn('c'.repeat(200))]);
      expect(loadConversation(guest, 'item')).toBeUndefined();
    });
  });

  it('encodes the api key and user id, so a separator inside one cannot collide with another', () => {
    const owner = { apiKey: 'key:a', userId: 'u:1' };
    saveConversation(owner, 'item', 't1', [turn('q')]);

    expect(window.localStorage.getItem('cio-pia:chat:v1:key%3Aa:u%3A1')).not.toBeNull();
    expect(loadConversation({ apiKey: 'key', userId: 'a:u:1' }, 'item')).toBeUndefined();
    expect(loadConversation(owner, 'item')?.threadId).toBe('t1');
  });

  it("moves every guest conversation into the shopper's store on login", () => {
    saveConversation(guest, 'a', 't1', [turn('guest a')]);
    saveConversation(shopper, 'b', 't2', [turn('shopper b')]);

    moveGuestConversations('key', 'u1');

    expect(window.sessionStorage.length).toBe(0);
    expect(loadConversation(shopper, 'a')?.threadId).toBe('t1');
    expect(loadConversation(shopper, 'b')?.threadId).toBe('t2');
  });

  it("clears one shopper's or the guest's history only", () => {
    saveConversation(guest, 'a', 't1', [turn('q')]);
    saveConversation(shopper, 'a', 't2', [turn('q')]);
    saveConversation({ apiKey: 'key', userId: 'u2' }, 'a', 't3', [turn('q')]);

    clearPersistedConversations({ apiKey: 'key', userId: 'u1' });
    expect(loadConversation(shopper, 'a')).toBeUndefined();
    expect(loadConversation({ apiKey: 'key', userId: 'u2' }, 'a')).toBeDefined();
    expect(loadConversation(guest, 'a')).toBeDefined();

    clearPersistedConversations({ apiKey: 'key' });
    expect(loadConversation(guest, 'a')).toBeUndefined();
  });
});
