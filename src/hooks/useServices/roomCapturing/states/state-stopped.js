export const stateStopped = ({ nextState, roomState, visuals }) => {
  const start = async () => {
    await visuals.clearVisuals();
    roomState.hasRoomState = true;
  };

  const stop = async () => {};

  const capture = async () => {};

  const undo = async () => {};

  return {
    start,
    stop,
    capture,
    undo,

    get nextState() {
      return nextState;
    },
    get canUndo() {
      return false;
    },
    get canFinish() {
      return false;
    },
    get canCapture() {
      return false;
    },
  };
};

export default stateStopped;
