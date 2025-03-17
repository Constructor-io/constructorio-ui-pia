/* eslint-disable max-classes-per-file, @typescript-eslint/lines-between-class-members */
export interface MockConstructorClientOptions {
  apiKey: string;
  version?: string;
  serviceUrl?: string;
  quizzesServiceUrl?: string;
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

class EventDispatcher {
  events: any[] = [];
  enabled: boolean = true;
  waitForBeacon: boolean = true;
  active: boolean = false;
}

class EventEmitter {
  _events: Record<string, any> = {};
  _eventsCount: number = 0;
}

class Humanity {
  isHumanBoolean: boolean = false;
}

class Module {
  options: MockConstructorClientOptions;
  eventDispatcher: EventDispatcher;

  constructor(options: MockConstructorClientOptions) {
    this.options = { ...options };
    this.eventDispatcher = new EventDispatcher();
  }
}

class Requests {
  options: MockConstructorClientOptions;
  eventemitter: EventEmitter;
  humanity: Humanity;
  requestPending: boolean = false;
  pageUnloading: boolean = false;
  sendTrackingEvents: boolean = true;

  constructor(options: MockConstructorClientOptions) {
    this.options = options;
    this.eventemitter = new EventEmitter();
    this.humanity = new Humanity();
  }
}

class Tracker {
  options: MockConstructorClientOptions;
  eventemitter: EventEmitter;
  requests: Requests;
  behavioralV2Url: string;

  constructor(options: MockConstructorClientOptions) {
    this.options = { ...options };
    this.eventemitter = new EventEmitter();
    this.requests = new Requests(options);
    this.behavioralV2Url = `${options.serviceUrl || 'https://test.cnstrc.com'}/v2/behavioral_action/`;
  }

  // eslint-disable-next-line class-methods-use-this
  trackEvent(): boolean {
    // Mock tracking implementation
    return true;
  }
}

// Main MockConstructorIOClient class
class MockConstructorIOClient {
  options: MockConstructorClientOptions;
  search: Module;
  browse: Module;
  autocomplete: Module;
  recommendations: Module;
  quizzes: Module;
  tracker: Tracker;

  constructor(options: MockConstructorClientOptions) {
    this.options = {
      version: options.version || 'cio-ui-asa-pdp-0.0.0',
      serviceUrl: options.serviceUrl || 'https://test.cnstrc.com',
      quizzesServiceUrl: options.quizzesServiceUrl || 'https://quizzestest.cnstrc.com',
      sessionId: options.sessionId || 1,
      clientId: options.clientId || 'this-is-a-random-client-id',
      sendTrackingEvents:
        options.sendTrackingEvents !== undefined ? options.sendTrackingEvents : true,
      beaconMode: options.beaconMode !== undefined ? options.beaconMode : true,
      networkParameters: options.networkParameters || {},
      ...options,
    };

    this.search = new Module(this.options);
    this.browse = new Module(this.options);
    this.autocomplete = new Module(this.options);
    this.recommendations = new Module(this.options);
    this.quizzes = new Module(this.options);
    this.tracker = new Tracker(this.options);

    // Add methods to modules
    this.addModuleMethods();
  }

  private addModuleMethods(): void {
    // Search
    this.search = Object.assign(this.search, {
      getSearchResults: async (query: string, params?: any) => ({
        request: { query, params },
        response: { results: [] },
      }),
    });

    // Browse
    this.browse = Object.assign(this.browse, {
      getBrowseResults: async (filterName: string, filterValue: string, params?: any) => ({
        request: { filterName, filterValue, params },
        response: { results: [] },
      }),
    });

    // Autocomplete
    this.autocomplete = Object.assign(this.autocomplete, {
      getAutocompleteResults: async (query: string, params?: any) => ({
        request: { query, params },
        response: { sections: { products: [], queries: [] } },
      }),
    });

    // Recommendations
    this.recommendations = Object.assign(this.recommendations, {
      getRecommendations: async (podId: string, params?: any) => ({
        request: { podId, params },
        response: { results: [] },
      }),
    });

    // Quizzes
    this.quizzes = Object.assign(this.quizzes, {
      getQuizResults: async (quizId: string, answers: any[], params?: any) => ({
        request: { quizId, answers, params },
        response: { results: [] },
      }),
    });
  }

  setClientOptions(options: MockConstructorClientOptions): void {
    this.options = {
      ...this.options,
      ...options,
    };

    this.search.options = { ...this.options };
    this.browse.options = { ...this.options };
    this.autocomplete.options = { ...this.options };
    this.recommendations.options = { ...this.options };
    this.quizzes.options = { ...this.options };
    this.tracker.options = { ...this.options };
    this.tracker.requests.options = { ...this.options };
  }
}

export default MockConstructorIOClient;
