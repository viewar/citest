// TODO: fix 'no-use-before-define' (remove eslint disable to see errors)
/* eslint-disable no-use-before-define */
import isEqual from "lodash/isEqual";
import throttle from "lodash/throttle";
import { length as vec3length, sub as vec3sub } from "../math/vector3";
import {
  CURRENT_EDGE_UPDATE_INTERVAL,
  FIRST_EDGE_NEAR_DISTANCE,
} from "../constants";

export const stateEdge = ({ nextState, roomState, emit, visuals }) => {
  let edgeUpdate = 0;
  let wasNearFirstEdge = false;
  let isClosed = false;
  let updateMutex = Promise.resolve();
  const queueUpdate = fn => (updateMutex = updateMutex.then(fn, fn));

  const start = async () => {
    isClosed = false;
    edgeUpdate = 0;
  };

  const stop = async () => {
    const points = roomState.edges.map(edge => ({
      x: edge.x,
      y: edge.z,
    }));

    if (isRoomCounterClockwise(points)) {
      await swapEdges();
    }

    if (
      roomState.edges.length > 2 &&
      !isEqual(roomState.edges[roomState.edges.length - 1], roomState.edges[0])
    ) {
      await visuals.insertWall(
        roomState.edges[roomState.edges.length - 1],
        roomState.edges[0]
      );
    }

    stopEdgeUpdate();
    await visuals.hide("target");
    await visuals.hide("closingwalltarget");
  };

  const captureFn = () => queueUpdate(capture);
  const capture = async () => {
    stopEdgeUpdate();
    const { position, isNear } = await getTargetPosition();

    await visuals.setCurrentWallPosition(position);

    if (isNear) {
      isClosed = true;
      await visuals.hide("currentwall");
      await visuals.hide("target");
      await visuals.hide("closingwalltarget");
      emit("roomClosed");
    } else {
      if (roomState.edges.length) {
        await visuals.insertWall(
          roomState.edges[roomState.edges.length - 1],
          position
        );
        emit("event", "CapturedEdge");
      } else {
        emit("event", "CapturedFirstEdge");
      }

      roomState.edges.push(position);
      startEdgeUpdate();
    }
  };

  const undoFn = () => queueUpdate(() => undo());
  const undo = async () => {
    if (roomState.edges.length) {
      await visuals.show("target");

      if (isClosed) {
        isClosed = false;
        await visuals.hideClosingWall();
        await visuals.setCurrentWallPosition(
          roomState.edges[roomState.edges.length - 1]
        );

        emit("event", "UndidEdge");
      } else {
        if (roomState.edges.length > 1) {
          await visuals.removeLastWall();
        }

        roomState.edges.splice(roomState.edges.length - 1, 1);
        if (roomState.edges.length) {
          await visuals.setCurrentWallPosition(
            roomState.edges[roomState.edges.length - 1]
          );
          emit("event", "UndidEdge");
        } else {
          stopEdgeUpdate();
          await visuals.hide("currentwall");
          emit("event", "UndidFirstEdge");
        }
      }

      return true;
    }
    return false;
  };

  // Edge update
  //--------------------------------------------------------------------------------------------------------------------

  function startEdgeUpdate() {
    if (!edgeUpdate) {
      updateMutex = Promise.resolve();
      wasNearFirstEdge = false;
      edgeUpdate = setInterval(updateEdge, CURRENT_EDGE_UPDATE_INTERVAL);
    }
  }

  function stopEdgeUpdate() {
    clearInterval(edgeUpdate);
    edgeUpdate = 0;
  }

  const getTargetPosition = async () => {
    let position = await visuals.getTargetPosition();
    const isNear = roomState.edges.length > 2 && isNearFirstEdge(position);

    if (isNear) {
      position = roomState.edges[roomState.edges.length - 1];
    }

    return {
      position,
      isNear,
    };
  };

  async function updateEdge() {
    if (edgeUpdate) {
      const { position, isNear } = await getTargetPosition();
      let length = 0;
      if (roomState.edges.length) {
        await updateClosingEdge(isNear);
        length = vec3length(
          vec3sub(position, roomState.edges[roomState.edges.length - 1])
        );
      }

      if (edgeUpdate) {
        emit("length", length);
      }
    }
  }

  function isNearFirstEdge(position) {
    const distance = vec3length(vec3sub(position, roomState.edges[0]));
    return distance <= FIRST_EDGE_NEAR_DISTANCE;
  }

  const updateClosingEdge = throttle(async isNear => {
    if (isNear !== wasNearFirstEdge) {
      if (isNear) {
        await visuals.hide("target");
        await visuals.hide("currentwall");
        await visuals.showClosingWall(
          roomState.edges[roomState.edges.length - 1],
          roomState.edges[0]
        );
        emit("snapped", true);
      } else {
        await visuals.hideClosingWall();
        await visuals.show("target");
        await visuals.show("currentwall");
        emit("snapped", false);
      }
      wasNearFirstEdge = isNear;
    }
  }, 200);

  const swapEdges = async () => {
    roomState.edges.reverse();
    await visuals.removeAll("wall");
    for (let i = 0; i < roomState.edges.length - 1; i++) {
      const p1 = roomState.edges[i];
      const p2 = roomState.edges[(i + 1) % roomState.edges.length];
      await visuals.insertWall(p1, p2);
    }
  };

  const isRoomCounterClockwise = points => {
    let signedArea = 0;
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];

      signedArea += p1.x * p2.y - p2.x * p1.y;
    }

    return signedArea < 0;
  };

  //--------------------------------------------------------------------------------------------------------------------

  return {
    start,
    stop,
    capture: captureFn,
    undo: undoFn,

    get nextState() {
      return nextState;
    },
    get canUndo() {
      return !!roomState.edges.length;
    },
    get canFinish() {
      return roomState.edges.length >= 3;
    },
    get canCapture() {
      return !isClosed;
    },
  };
};

export default stateEdge;
