/**
 * A promise whose settling the test controls.
 *
 * Needed to prove the out-of-order guard: hand the first call `a.promise` and the second call
 * `b.promise`, resolve `b` first, then `a`, and assert the stale response never lands.
 */
export default function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });

  return { promise, resolve, reject };
}
