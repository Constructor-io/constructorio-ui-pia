import { renderHook, act } from '@testing-library/react';
import useViewportCallbacks from '../../../src/hooks/useViewportCallbacks';

describe('Testing Hook: useViewportCallbacks', () => {
  let observeCallback;
  let mockDisconnect;

  const mockContext = { itemId: 'test-item', threadId: 'test-thread' };

  beforeEach(() => {
    mockDisconnect = jest.fn();

    global.IntersectionObserver = jest.fn((callback) => {
      observeCallback = callback;
      return {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: mockDisconnect,
      };
    });
  });

  afterEach(() => {
    observeCallback = undefined;
    jest.restoreAllMocks();
  });

  function renderAndAttach(props) {
    const { result } = renderHook(() => useViewportCallbacks(props));
    const mockElement = document.createElement('div');
    act(() => {
      result.current.containerRef(mockElement);
    });
    return { result, mockElement };
  }

  it('returns a containerRef callback', () => {
    const { result } = renderHook(() =>
      useViewportCallbacks({ callbacks: {}, context: mockContext }),
    );
    expect(typeof result.current.containerRef).toBe('function');
  });

  it('does not throw when callbacks are not provided', () => {
    expect(() => {
      renderAndAttach({ context: mockContext });
    }).not.toThrow();
  });

  it('does not call onOutOfView on initial non-intersection', () => {
    const onView = jest.fn();
    const onOutOfView = jest.fn();

    renderAndAttach({ callbacks: { onView, onOutOfView }, context: mockContext });

    observeCallback([{ isIntersecting: false }]);
    expect(onView).not.toHaveBeenCalled();
    expect(onOutOfView).not.toHaveBeenCalled();
  });

  it('calls onView with context when element becomes visible', () => {
    const onView = jest.fn();

    renderAndAttach({ callbacks: { onView }, context: mockContext });

    observeCallback([{ isIntersecting: true }]);
    expect(onView).toHaveBeenCalledWith(mockContext);
    expect(onView).toHaveBeenCalledTimes(1);
  });

  it('calls onView only once even with repeated intersections', () => {
    const onView = jest.fn();

    renderAndAttach({ callbacks: { onView }, context: mockContext });

    observeCallback([{ isIntersecting: true }]);
    observeCallback([{ isIntersecting: false }]);
    observeCallback([{ isIntersecting: true }]);
    expect(onView).toHaveBeenCalledTimes(1);
  });

  it('calls onOutOfView with context only after widget was previously visible', () => {
    const onView = jest.fn();
    const onOutOfView = jest.fn();

    renderAndAttach({ callbacks: { onView, onOutOfView }, context: mockContext });

    observeCallback([{ isIntersecting: true }]);
    expect(onView).toHaveBeenCalledTimes(1);

    observeCallback([{ isIntersecting: false }]);
    expect(onOutOfView).toHaveBeenCalledWith(mockContext);
    expect(onOutOfView).toHaveBeenCalledTimes(1);
  });

  it('calls onOutOfView only once and disconnects observer', () => {
    const onView = jest.fn();
    const onOutOfView = jest.fn();

    renderAndAttach({ callbacks: { onView, onOutOfView }, context: mockContext });

    observeCallback([{ isIntersecting: true }]);
    observeCallback([{ isIntersecting: false }]);
    expect(mockDisconnect).toHaveBeenCalledTimes(1);

    observeCallback([{ isIntersecting: true }]);
    observeCallback([{ isIntersecting: false }]);

    expect(onView).toHaveBeenCalledTimes(1);
    expect(onOutOfView).toHaveBeenCalledTimes(1);
  });

  it('disconnects previous observer when ref is called with a new node', () => {
    const { result } = renderHook(() =>
      useViewportCallbacks({ callbacks: {}, context: mockContext }),
    );

    const firstElement = document.createElement('div');
    act(() => {
      result.current.containerRef(firstElement);
    });
    expect(mockDisconnect).not.toHaveBeenCalled();

    const secondElement = document.createElement('div');
    act(() => {
      result.current.containerRef(secondElement);
    });
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });
});
