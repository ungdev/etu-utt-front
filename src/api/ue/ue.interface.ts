export interface UE {
  code: string;
  name: string;
  info: {
    requirements: Array<string>;
    languages: Array<string>;
    minors: Array<string>;
  };
  credits: Array<{
    credits: number;
    category: {
      code: string;
      name: string;
    };
    branchOption: Array<{
      code: string;
      name: string;
      branch: {
        code: string;
        name: string;
      };
    }>;
  }>;
  openSemester: Array<{
    code: string;
    start: Date;
    end: Date;
  }>;
}

export interface DetailedUE {
  code: string;
  creationYear: number;
  updateYear: number;
  ueofs: Array<{
    name: string;
    code: string;
    siepId: string;
    inscriptionCode: string;
    credits: Array<{
      credits: number;
      category: {
        code: string;
        name: string;
      };
      branchOptions: Array<{
        code: string;
        name: string;
        branch: {
          code: string;
          name: string;
        };
      }>;
    }>;
    info: {
      objectives: string;
      program: string;
      language: string;
      minors: Array<string>;
      requirements: Array<string>;
    };
    openSemester: Array<{
      code: string;
      start: Date;
      end: Date;
    }>;
    workTime: {
      cm: number;
      td: number;
      tp: number;
      the: number;
      project: boolean;
      internship: number;
    };
  }>;
  starVotes: {
    [criterionId: string]: number;
  };
}
