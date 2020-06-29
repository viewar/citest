// TODO: fix 'no-use-before-define' (remove eslint disable to see errors)
/* eslint-disable no-use-before-define */
import { HEIGHT_UPDATE_INTERVAL } from "../constants";
import { getRayFromPose, getRayEdgesIntersections } from "../math/math";
import viewarApi from "viewar-api";

export const stateRoomheight = ({ nextState, roomState, emit, visuals }) => {
  let heightUpdate = 0;
  let currentHeight = 0;

  const start = async () => {
    heightUpdate = 0;
    currentHeight = 0;
    await visuals.hide("currentwall");
    startHeightUpdate();
  };

  const stop = async () => {
    stopHeightUpdate();
    await visuals.setWallHeight(0);
  };

  const capture = async () => {
    if (currentHeight) {
      stopHeightUpdate();
      roomState.roomHeight = currentHeight;
      emit("event", "CapturedRoomHeight");
    }
  };

  const undo = async () => {
    if (roomState.roomHeight) {
      currentHeight = 0;
      startHeightUpdate();
      roomState.roomHeight = null;

      emit("event", "UndidRoomHeight");
      emit("height", 0);
      visuals.setWallHeight(0);
      return true;
    }

    return false;
  };

  // Height measuring
  //--------------------------------------------------------------------------------------------------------------------

  function startHeightUpdate() {
    if (!heightUpdate) {
      heightUpdate = setInterval(updateHeight, HEIGHT_UPDATE_INTERVAL);
    }
  }

  function stopHeightUpdate() {
    if (heightUpdate) {
      clearInterval(heightUpdate);
      heightUpdate = 0;
    }
  }

  async function updateHeight() {
    if (heightUpdate) {
      let height = 0;
      if (viewarApi.coreInterface.platform === "Mock") {
        // Set measured height to 2m for mock mode.
        height = 2000;
      } else {
        const pose = await viewarApi.cameras.arCamera.updatePose();
        const ray = getRayFromPose(pose);
        const intersections = getRayEdgesIntersections(ray, roomState.edges);

        if (intersections.length) {
          height = intersections[0].position.y;
          if (height < 0) {
            height = 0;
          }
        }
      }

      if (heightUpdate) {
        currentHeight = height;

        emit("canCapture", !!(!roomState.roomHeight && currentHeight));
        emit("height", height);
        visuals.setWallHeight(height);
      }
    }
  }

  return {
    start,
    stop,
    capture,
    undo,

    get nextState() {
      return nextState;
    },
    get canUndo() {
      return !!roomState.roomHeight;
    },
    get canFinish() {
      return !!roomState.roomHeight;
    },
    get canCapture() {
      return !!(!roomState.roomHeight && currentHeight);
    },
  };
};

export default stateRoomheight;
