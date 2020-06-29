// TODO: fix 'no-use-before-define' (remove eslint disable to see errors)
/* eslint-disable no-use-before-define */
import { generateId } from "../utils";
import {
  length as vec2length,
  add as vec2add,
  subtract as vec2subtract,
  scale as vec2scale,
  angleBetween as vec2angleBetween,
  normal as vec2normal,
  normalize as vec2normalize,
} from "../math/vector2";
import { WALL_WIDTH, WALL_HEIGHT } from "../constants";

export function getCurrentRoomState(
  { edges, objects, roomHeight, objectModels },
  wallsVisible = true
) {
  let state = createRoomState(
    edges,
    objects,
    roomHeight,
    objectModels,
    wallsVisible
  );
  state.rooms[generateId()] = {
    points: Object.keys(state.controlPoints),
  };

  return {
    name: generateId(),
    type: "room",
    state,
  };
}

function createRoomState(
  edges,
  objects,
  roomHeight,
  objectModels,
  wallsVisible
) {
  const roomState = {
    controlPoints: {},
    walls: {},
    rooms: {},
  };

  // Generate control points from captured edges.
  let points = edges.map(edge => getControlPointFrom3D(edge));
  points = adjustPointPositions(points);
  if (points.length > 2) {
    // Generate control points for captured objects.
    const parsedObjects = JSON.parse(JSON.stringify(objects)).map(object => {
      const { bottomLeft, topRight } = object;
      return Object.assign(object, {
        startPoint: getControlPointFrom3D(bottomLeft),
        endPoint: getControlPointFrom3D(topRight),
        vOffset: bottomLeft.y / 10,
        height: (topRight.y - bottomLeft.y) / 10,
      });
    });

    const walls = {};
    let lastIndex = 0;

    // Go over all captured edges and generate walls and objects.
    for (let i = 1; i < points.length + 1; i++) {
      const currentIndex = i % points.length;
      let last = points[lastIndex];
      const objects = [];

      // Add objects and additional control points for objects.
      const wallObjects = parsedObjects
        .filter(
          object => object.start === lastIndex && object.end === currentIndex
        )
        .sort(
          (a, b) =>
            vec2length(vec2subtract(last, a.startPoint)) -
            vec2length(vec2subtract(last, b.startPoint))
        );

      wallObjects.forEach(object => {
        // Generate wall from last control point to start of wall object.
        objects.push(generateWallObject(last, object.startPoint, "wall"));
        // Generate wall object for wall object.
        objects.push(
          generateWallObject(
            object.startPoint,
            object.endPoint,
            object.type,
            objectModels,
            object.height,
            object.vOffset
          )
        );
        last = object.endPoint;
      });

      // Generate wall from last wall object to next edge.
      objects.push(
        generateWallObject(last, points[currentIndex], "wall", null, null, null)
      );

      // Generate wall.
      walls[generateId()] = {
        points: [points[lastIndex].id, points[currentIndex].id],
        objects,
        width: WALL_WIDTH,
        height: roomHeight || WALL_HEIGHT,
        hidden: !wallsVisible,
      };

      lastIndex = currentIndex;
    }

    const controlPoints = {};
    points.forEach(point => (controlPoints[point.id] = point));
    Object.assign(roomState, {
      controlPoints,
      walls,
    });
  }

  return roomState;
}

function generateWallObject(
  startPoint,
  endPoint,
  type,
  models,
  height,
  verticalOffset
) {
  const length = vec2length(vec2subtract(endPoint, startPoint));

  const object = {
    id: generateId(),
    type: type,
    model: null,
    length,
  };

  if (type === "window" || type === "door") {
    Object.assign(object, {
      model: {
        id: models[type].id,
      },
      width: models[type].width,
      height,
    });
  }

  if (type === "window") {
    Object.assign(object, {
      verticalOffset,
      rotated: true,
    });
  }

  return object;
}

function getControlPointFrom3D(point) {
  return {
    id: generateId(),
    x: point.x / 10,
    y: point.z / 10,
  };
}

// Adjusts point positions so that the measured point is actually the outside of a wall.
// TODO: This only works at the moment because every control point is only used for two walls.
function adjustPointPositions(points) {
  const newPoints = JSON.parse(JSON.stringify(points));

  const numControlPoints = points.length;
  if (numControlPoints) {
    for (let i = 0; i < numControlPoints; i++) {
      const current = points[i];

      let v1;
      let v2;
      let direction;
      let length;
      let angle;
      let n1;
      let n2;

      switch (i) {
        case 0:
          // First control point
          length = WALL_WIDTH / 2;
          direction = vec2normal(points[i + 1], current);
          break;
        case numControlPoints - 1:
          // Last control point
          length = WALL_WIDTH / 2;
          direction = vec2normal(current, points[i - 1]);
          break;
        default:
          v1 = vec2subtract(points[i - 1], current);
          v2 = vec2subtract(current, points[i + 1]);

          angle = vec2angleBetween(v1, v2);
          length = WALL_WIDTH / 2 / Math.cos(Math.PI - angle / 2);
          n1 = vec2normal(points[i - 1], current);
          n2 = vec2normal(current, points[i + 1]);
          direction = vec2normalize(vec2add(n1, n2));
          break;
      }

      Object.assign(
        newPoints[i],
        vec2add(current, vec2scale(direction, length))
      );
    }
  }

  return newPoints;
}
