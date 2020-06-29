export const stateFinished = ({ nextState, emit }) => {
  const start = async () => {
    emit("event", "Finished");
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

export default stateFinished;
