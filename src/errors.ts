/**
 * Thrown when a Constructor agent request returns a non-2xx response.
 *
 * `status` is the HTTP status code, so callers can act on the kind of failure instead of
 * parsing the message. A 422 means the request itself was rejected as unsuitable, a 429
 * means rate limiting, and anything 500 or above means the service failed and a retry may
 * succeed. This is the error that arrives in `CioPiaRenderProps.error` when a request fails.
 */
export class AgentRequestError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(`Request failed with status ${status}`);
    this.name = 'AgentRequestError';
    this.status = status;
  }
}
