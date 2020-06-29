export const OBJECT_MODELS = {
  window: "60444",
  door: "39922",
};

export const WALL_WIDTH = 0.01;
export const WALL_HEIGHT = 0;

export const VISUAL_MODELS = {
  wallobject: { foreignKey: "wallobject_fixed", modelId: "54104" },
  wallobject_stretched: {
    foreignKey: "wallobject_stretched",
    modelId: "54106",
  },
  wall: { foreignKey: "wall_fixed", modelId: "45991" },
  wall_stretched: { foreignKey: "wall_stretched", modelId: "54105" },
  ground: { foreignKey: "ground", modelId: "45992" },
  ground_stretched: { foreignKey: "ground_stretched", modelId: "54107" },
  target: { foreignKey: "target", modelId: "118025" },
  target_fixed: { foreignKey: "target_fixed", modelId: "118044" },
};

export const HEIGHT_UPDATE_INTERVAL = 16;
export const CURRENT_EDGE_UPDATE_INTERVAL = 8;
export const FIRST_EDGE_NEAR_DISTANCE = 100;

export const STATE_STOPPED = Symbol("stopped");
export const STATE_EDGE = Symbol("walls");
export const STATE_ROOMHEIGHT = Symbol("roomheight");
export const STATE_OBJECTS = Symbol("objects");
export const STATE_FINISHED = Symbol("finished");

export const stateString = {};
stateString[STATE_STOPPED] = "Stop";
stateString[STATE_EDGE] = "Walls";
stateString[STATE_ROOMHEIGHT] = "RoomHeight";
stateString[STATE_OBJECTS] = "Objects";
stateString[STATE_FINISHED] = "Finished";
