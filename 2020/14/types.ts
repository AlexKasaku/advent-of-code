export type SetMaskCommand = {
  type: 'mask';
  value: string;
};

export type SetAddressCommand = {
  type: 'address';
  location: number;
  value: number;
};

export type Command = SetMaskCommand | SetAddressCommand;
