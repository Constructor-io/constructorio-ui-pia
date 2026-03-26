Element.prototype.scrollTo = jest.fn();
HTMLDialogElement.prototype.showModal = jest.fn(function mock() {
  this.setAttribute('open', '');
});
HTMLDialogElement.prototype.close = jest.fn(function mock() {
  this.removeAttribute('open');
});
