export const commands = ['N', 'E', 'S', 'W', 'L', 'R', 'F'] as const;
export type Command = (typeof commands)[number];

export type Instruction = { command: Command; value: number };
