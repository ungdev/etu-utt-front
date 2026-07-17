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

export interface AssoUpdateRequest {
  name?: string;
  description?: {
    fr?: string;
    en?: string;
    de?: string;
    es?: string;
    zh?: string;
  };
  descriptionShort?: {
    fr?: string;
    en?: string;
    de?: string;
    es?: string;
    zh?: string;
  };
  mail?: string;
  phoneNumber?: string;
  website?: string;
  logo?: string;
}
