export interface UE {
  code: string;
  inscriptionCode: string;
  name: string;
  info: {
    requirements: Array<{ code: string }>;
    comment: string;
    degree: string;
    languages: string;
    minors: string;
    objectives: string;
    program: string;
  };
  credits: Array<{
    credits: number;
    category: {
      code: string;
      name: string;
    };
  }>;
  branchOption: Array<{
    code: string;
    name: string;
    branch: {
      code: string;
      name: string;
    };
  }>;
  openSemester: Array<{
    code: string;
    start: Date;
    end: Date;
  }>;
}

export interface DetailedUE extends UE {
  validationRate: number;
  workTime: {
    cm: number;
    td: number;
    tp: number;
    the: number;
    project: number;
    internship: number;
  };
  starVotes: {
    criterionId: string;
    createdAt: Date;
    value: number;
  };
}
