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
