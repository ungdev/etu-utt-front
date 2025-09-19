import './global.d';

String.prototype.latinize = function () {
  return this.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export enum LocalStorageNames {
  TOKEN = 'etuutt-token',
  LANG = 'etuutt-lang',
  NAVBAR_COLLAPSED = 'etuutt-navbar-collapsed',
}
