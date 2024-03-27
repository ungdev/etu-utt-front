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
  "navbar.title": "TODO : JE SAIS PAS CE QU'IL FAUT METTRE LA :)",
  "navbar.profile": "Mon profil",
  "navbar.home": "Accueil",
  "navbar.uesBrowser": "Guide des UEs",
  "navbar.userBrowser": "Trombinoscope",
  "navbar.associations": "Associations",
  "navbar.myAssociations": "Mes Assos",
  "navbar.myTimetable": "Mon EdT",
  "navbar.myUEs": "Mes matières",
  "input.editableText.modify": "Modifier",
} as const;