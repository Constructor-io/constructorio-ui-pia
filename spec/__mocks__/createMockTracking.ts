export default function createMockTracking() {
  return {
    trackViews: jest.fn(),
    trackView: jest.fn(),
    trackOutOfView: jest.fn(),
    trackFocus: jest.fn(),
    trackQuestionClick: jest.fn(),
    trackQuestionSubmit: jest.fn(),
    trackAnswerView: jest.fn(),
    trackAnswerFeedback: jest.fn(),
    trackResultClick: jest.fn(),
  };
}
