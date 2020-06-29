// TODO: fix 'no-use-before-define' (remove eslint disable to see errors)
/* eslint-disable no-use-before-define */
import viewarApi from "viewar-api";
import { getRayFromPose, getRayEdgesIntersections } from "../math/math";
import { getTypeName } from "../utils";

export const stateObjects = ({ nextState, roomState, emit, visuals }) => {
  let currentObject = null;
  let currentType = false;

  const start = async () => {
    currentObject = null;
    currentType = false;
  };

  const stop = async () => {
    if (currentObject) {
      await undo();
    }
  };

  const capture = async type => {
    currentType = type;
    const pose = await viewarApi.cameras.arCamera.updatePose();
    const ray = getRayFromPose(pose);
    const intersections = getRayEdgesIntersections(ray, roomState.edges);
    let finished = false;
    let captured = false;

    if (intersections.length) {
      if (intersections[0].position.y <= roomState.roomHeight) {
        if (!currentObject) {
          // Captured first point of wall object.
          const { position, orientation } = intersections[0];
          if (type === "door") {
            position.y = 0;
          }

          await visuals.setCurrentWallObjectPose({ position, orientation });

          currentObject = intersections[0];
          captured = true;

          emit("event", `Captured${getTypeName(type)}FirstPoint`);
        } else {
          // Captured second point of wall object.
          let intersection;
          const currentWallIntersections = intersections.filter(
            intersection =>
              intersection.start === currentObject.start &&
              intersection.end === currentObject.end
          );

          if (currentWallIntersections.length) {
            intersection = currentWallIntersections[0];

            let bottomLeft;
            let topRight;
            if (currentObject.position.y < intersection.position.y) {
              bottomLeft = currentObject.position;
              topRight = intersection.position;
            } else {
              topRight = currentObject.position;
              bottomLeft = intersection.position;
            }

            const id = await visuals.insertWallObject(bottomLeft, topRight);
            await visuals.hide("currentwallobject");

            roomState.objects.push({
              instanceId: id,
              start: currentObject.start,
              end: currentObject.end,
              bottomLeft,
              topRight,
              type,
            });
            currentObject = null;
            captured = true;
            finished = true;

            emit("event", `Captured${getTypeName(type)}`);
          } else {
            console.log(
              "Top right point not on same wall as bottom left point."
            );
          }
        }
      } else {
        emit("event", "NoWallIntersection");
        console.log("Object placed too high.");
      }
    } else {
      emit("event", "NoWallIntersection");
      console.log("No intersection with any wall.");
    }

    return {
      finished,
      captured,
    };
  };

  const undo = async () => {
    if (!currentObject) {
      if (roomState.objects.length) {
        const type = roomState.objects[roomState.objects.length - 1].type;
        roomState.objects.splice(roomState.objects.length - 1, 1);
        await visuals.removeLastWallObject();
        emit("event", `Undid${getTypeName(type)}`);
        return true;
      }
    } else {
      await visuals.hide("currentwallobject");
      currentObject = null;
      emit("event", `Undid${getTypeName(currentType)}FirstPoint`);
      return true;
    }

    return false;
  };

  return {
    start,
    stop,
    capture,
    undo,

    get nextState() {
      return nextState;
    },
    get canUndo() {
      return !!(currentObject || roomState.objects.length);
    },
    get canFinish() {
      return !currentObject;
    },
    get canCapture() {
      return true;
    },
  };
};

export default stateObjects;
