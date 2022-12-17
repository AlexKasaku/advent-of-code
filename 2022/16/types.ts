export type Room = {
  name: string;
  flowRate: number;
};

export type Route = {
  moveCost: number;
  toRoomName: string;
};

export type RoomMap = Map<string, Room>;
export type RouteMap = Map<string, Route[]>;

export type Combo<T> = { me: T; elephant: T };

export type RouteState = {
  room: Combo<string | null>;
  timeRemaining: Combo<number>;
  currentFlowRate: number;
  roomsTurnedOn: Map<string, 'elephant' | 'me'>;
};
