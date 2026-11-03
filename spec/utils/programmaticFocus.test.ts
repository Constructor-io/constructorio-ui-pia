import { focusWithoutTracking, isFocusWithoutTracking } from '../../src/utils/programmaticFocus';

describe('programmaticFocus', () => {
  let input: HTMLInputElement;

  beforeEach(() => {
    input = document.createElement('input');
    document.body.appendChild(input);
  });

  afterEach(() => {
    input.remove();
  });

  it('flags the focus event it raises, and only that one', () => {
    const seen: boolean[] = [];
    input.addEventListener('focus', () => seen.push(isFocusWithoutTracking()));

    focusWithoutTracking(input);
    input.blur();
    input.focus();

    expect(seen).toEqual([true, false]);
    expect(isFocusWithoutTracking()).toBe(false);
  });

  it('clears the flag when focus throws', () => {
    input.addEventListener('focus', () => {
      throw new Error('handler failed');
    });
    jest.spyOn(input, 'focus').mockImplementation(() => {
      throw new Error('focus failed');
    });

    expect(() => focusWithoutTracking(input)).toThrow('focus failed');
    expect(isFocusWithoutTracking()).toBe(false);
  });
});
