export type Configuration = {
  workflows: Map<string, Workflow>;
  parts: Part[];
};

export type Workflow = {
  id: string;
  rule: Rule;
};

export type Transfer = {
  toWorkflow?: string;
  toAccept?: boolean;
  toReject?: boolean;
};

export type Rule = {
  condition: string;
  pass: Rule | Transfer;
  fail: Rule | Transfer;
};

export type Part = {
  x: number;
  m: number;
  a: number;
  s: number;
};
