import {
  Product,
  CarouselOverrides,
  ComponentOverrideProps,
} from '@constructor-io/constructorio-ui-components';
import { Question } from './hooks/mocks/types';

export type CioPiaDisplayConfigs = {
  learnMoreUrl?: string;
  showFeedback?: boolean;
};

export interface Callbacks {
  onProductCardClick?: (item: Item) => void;
}

/** Extends Product type to include PIA-specific fields */
export interface Item extends Product, Record<string, any> {
  url?: string;
  matchedTerms?: string[];
}

/**
 * Render props passed to CioPia children function
 */
export interface CioPiaRenderProps {
  items: Item[] | null;
  isLoading: boolean;
  error?: Error | null;
  currentAnswer: string;
  currentQuestion: string;
  displayedQuestions: Question[];
  handleSubmitQuestion: (question: string) => void;
}

/**
 * Component overrides for CioPia
 * Allows customization of carousel component
 */
export interface CioPiaComponentOverrides extends ComponentOverrideProps<CioPiaRenderProps> {
  carousel?: CarouselOverrides<Item>;
}

export * from './hooks/mocks/types';
