export interface MockConstructorClientOptions {
  apiKey: string;
  version?: string;
  serviceUrl?: string;
  quizzesServiceUrl?: string;
  assistantServiceUrl?: string;
  sessionId?: string | number;
  clientId?: string;
  userId?: string;
  segments?: string[];
  testCells?: Record<string, string>;
  idOptions?: any;
  fetch?: any;
  trackingSendDelay?: number;
  sendTrackingEvents?: boolean;
  sendReferrerWithTrackingEvents?: boolean;
  eventDispatcher?: any;
  beaconMode?: boolean;
  networkParameters?: any;
}

export type Nullable<T> = T | null;
