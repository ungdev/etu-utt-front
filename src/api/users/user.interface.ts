export interface User {
  id: string;
  firstName: string;
  lastName: string;
  nickname: string;
  avatar: string;
  sex: 'MALE' | 'FEMALE' | 'OTHER';
  nationality: string;
  website: string;
  passions: string;
  birthday: string;
  branch: string;
  semester: number;
  branchOption: string;
  mailUTT: string;
  mailPersonal: string;
  phone: string;
  addresses: Array<{
    street: string;
    postalCode: string;
    city: string;
    country: string;
  }>;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  twitch: string;
  spotify: string;
  discord: string;
  infoDisplayed: {
    displayBirthday: boolean;
    displayMailPersonal: boolean;
    displayPhone: boolean;
    displayAddress: boolean;
    displaySex: boolean;
    displayDiscord: boolean;
    displayTimetable: boolean;
  };
}

export interface AssoMembership {
  startAt: Date;
  endAt: Date;
  role: string;
  asso: {
    name: string;
    logo: string;
    descriptionShortTranslationId: string;
    mail: string;
  };
}
