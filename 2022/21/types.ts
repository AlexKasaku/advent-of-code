export type MonkeyInput = {
  name: string;
  value?: number;
  operation?: string;
  left?: string;
  right?: string;
};

export type MonkeyNode = {
  name: string;

  value?: number;
  operation?: string;

  left?: MonkeyNode;
  right?: MonkeyNode;
};

export type MonkeyValues = Map<string, number>;
