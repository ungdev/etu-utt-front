export interface Branch {
  code: string;
  name: string;
  branchOptions: BranchOption[];
}

export interface BranchOption {
  code: string;
  name: string;
}
