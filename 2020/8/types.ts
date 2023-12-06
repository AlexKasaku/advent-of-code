export type Operator = 'nop' | 'jmp' | 'acc';

export type Operation = {
  id: number;
  operator: Operator;
  operand: number;
};
