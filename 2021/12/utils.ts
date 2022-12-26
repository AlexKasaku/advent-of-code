import { EOL } from 'os';
import { Room, RoomMap } from './types';

export const parseInput = (input: string): RoomMap => {
  const roomMap = new Map<string, Room>();

  input
    .split(EOL)
    .flatMap((line) => line.split('-'))
    .forEach((room) => {
      if (!roomMap.has(room)) {
        roomMap.set(room, {
          name: room,
          big: /[A-Z]/.test(room),
          start: room === 'start',
          end: room === 'end',
          connected: [],
        });
      }
    });

  input.split(EOL).forEach((line) => {
    const [r1, r2] = line.split('-');

    roomMap.get(r1)!.connected.push(r2);
    roomMap.get(r2)!.connected.push(r1);
  });

  return roomMap;
};
