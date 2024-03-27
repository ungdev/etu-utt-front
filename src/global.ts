import './global.d';

String.prototype.latinize = function () {
  return this.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};
