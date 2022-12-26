export type RouteInput = {
  from: string;
  to: string;
};

export type Room = {
  name: string;
  big: boolean;
  start: boolean;
  end: boolean;

  connected: string[];
};

export type RoomMap = Map<string, Room>;

export type State = {
  room: string;
  visited: Set<string>;
  visitedSmallCaveTwice: boolean;
  route: string;
};
