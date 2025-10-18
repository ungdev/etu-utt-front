/* eslint-disable */
// Yeah, I know, a TS file, what ? The day you will be able to do
// import json from 'path/to/json.json' as const;
// or something similar, you will be able to remove the .ts extension
//
// Basically, using a TS file here allows to get a type like this :
// {
//   "navbar.profile": "Mon profil",
//   "navbar.home": "Accueil",
//   ...
// }
// Instead of this :
// {
//   "navbar.profile": string,
//   "navbar.home": string,
//   ...
// }

export default {
  'filter.all': 'Tous',
  'filter.filters': 'Filtres',
  'input.editableText.modify': 'Modifier',
  loading: 'Chargement',
  'navbar.addWidget': 'Ajouter',
  'navbar.associations': 'Associations',
  'navbar.home': 'Accueil',
  'navbar.myAssociations': 'Mes Assos',
  'navbar.myTimetable': 'Mon EdT',
  'navbar.myUEs': 'Mes matières',
  'navbar.profile': 'Mon profil',
  'navbar.uesBrowser': 'Guide des UEs',
  'navbar.userBrowser': 'Trombinoscope',
  or: 'Ou',
  results: 'résultats',
  confirm: 'Confirmer',
  '404': '404 - Page not found',
  'rte.dnd.drop': "Déposez le fichier pour l'importer",
  'rte.toolbar.uploadImage': "Cliquez pour sélectionner l'image",
} as const;
