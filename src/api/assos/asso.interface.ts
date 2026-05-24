export interface AssoOverview {
  id: string;
  name: string;
  logo: string;
  shortDescription: string;
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

export interface Asso {
  id: string;
  name: string;
  logo: string;
  description: string;
  mail: string;
  phoneNumber: string;
  website: string;
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
