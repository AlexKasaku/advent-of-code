export type Rule = {
  field: string;
  validRanges: { low: number; high: number }[];
};

export type TicketInfo = {
  rules: Rule[];
  myTicket: number[];
  otherTickets: number[][];
};
