const useEmblaCarousel = jest.fn(() => [
  jest.fn(),
  {
    canScrollPrev: jest.fn(() => true),
    canScrollNext: jest.fn(() => true),
    scrollPrev: jest.fn(),
    scrollNext: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    rootNode: jest.fn(() => null),
    slideNodes: jest.fn(() => []),
  },
]);

module.exports = useEmblaCarousel;
module.exports.__esModule = true;
module.exports.default = useEmblaCarousel;
