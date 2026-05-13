Element.prototype.scrollTo = jest.fn();

global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe() {}

  unobserve() {}

  disconnect() {}
};
HTMLDialogElement.prototype.showModal = jest.fn(function mock() {
  this.setAttribute('open', '');
});
HTMLDialogElement.prototype.close = jest.fn(function mock() {
  this.removeAttribute('open');
});
