import { getCurrentRoomState } from "./room-state-export";

export const DEFAULT_ROOMSTATE = Object.freeze({
  edges: [],
  objects: [],
  roomHeight: 0,
  hasRoomState: false,
});

export const getRoomState = getCurrentRoomState;
