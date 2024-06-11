export interface Asso {
  id: string;
  name: string;
  logo: string;
  descriptionShortTranslation: string;
  president: {
    role: {
      name: string;
    };
    user: {
      firstName: string;
      lastName: string;
    };
  };
}
