import {
  scale as vec3scale,
  rot as vec3rot,
  sub as vec3sub,
  add as vec3add,
  length as vec3length,
  getPitchFromQuaternion,
  getQuaternion,
  calculateAngle,
} from "./vector3";

const INTERSECTION_OFFSET = 10; // 1cm.

/**
 * Calculates the point on the floor where the camera is looking at.
 * Expects the camera pose as input. If camera is not pointing at the
 * floor, an error is thrown.
 *
 * @param orientation
 * @param position
 *
 * @returns {x, y, z}
 */
export function calculateLookAtPosition({ orientation, position }) {
  const pitch = getPitchFromQuaternion(orientation);

  if (pitch > 0) {
    throw new Error(
      "Can't calculate position: Device is not pointing at the floor."
    );
  }

  const distance = position.y / Math.cos(pitch + Math.PI / 2);
  const direction = vec3rot({ x: 0, y: 0, z: -1 }, orientation);

  return {
    x: position.x + direction.x * distance,
    y: position.y + direction.y * distance,
    z: position.z + direction.z * distance,
  };
}

export function getRayFromPose(pose) {
  const forward = {
    x: 0,
    y: 0,
    z: -1,
  };
  const direction = vec3rot(forward, pose.orientation);

  return {
    origin: pose.position,
    direction,
  };
}

export function getPlanesFromWalls(walls) {
  const planes = [];

  for (let wall of walls) {
    const P1 = wall.start;
    const P4 = wall.end;
    const P2 = {
      x: P1.x,
      y: P1.y + 99999999,
      z: P1.z,
    };
    const P3 = {
      x: P4.x,
      y: P4.y + 99999999,
      z: P4.z,
    };

    planes.push({
      P1,
      P2,
      P3,
      P4,
      equation: {
        A: P1.y * (P2.z - P3.z) + P2.y * (P3.z - P1.z) + P3.y * (P1.z - P2.z),
        B: P1.z * (P2.x - P3.x) + P2.z * (P3.x - P1.x) + P3.z * (P1.x - P2.x),
        C: P1.x * (P2.y - P3.y) + P2.x * (P3.y - P1.y) + P3.x * (P1.y - P2.y),
        D:
          -P1.x * (P2.y * P3.z - P3.y * P2.z) -
          P2.x * (P3.y * P1.z - P1.y * P3.z) -
          P3.x * (P1.y * P2.z - P2.y * P1.z),
      },
    });
  }

  return planes;
}

export function getPlanesFromEdges(edges) {
  const planes = [];

  let lastIndex = 0;
  for (let i = 1; i < edges.length + 1; i++) {
    const currentIndex = i % edges.length;
    const P1 = edges[lastIndex];
    const P4 = edges[currentIndex];
    const P2 = {
      x: P1.x,
      y: P1.y + 99999999,
      z: P1.z,
    };
    const P3 = {
      x: P4.x,
      y: P4.y + 99999999,
      z: P4.z,
    };

    planes.push({
      start: lastIndex,
      end: currentIndex,
      P1,
      P2,
      P3,
      P4,
      equation: {
        A: P1.y * (P2.z - P3.z) + P2.y * (P3.z - P1.z) + P3.y * (P1.z - P2.z),
        B: P1.z * (P2.x - P3.x) + P2.z * (P3.x - P1.x) + P3.z * (P1.x - P2.x),
        C: P1.x * (P2.y - P3.y) + P2.x * (P3.y - P1.y) + P3.x * (P1.y - P2.y),
        D:
          -P1.x * (P2.y * P3.z - P3.y * P2.z) -
          P2.x * (P3.y * P1.z - P1.y * P3.z) -
          P3.x * (P1.y * P2.z - P2.y * P1.z),
      },
    });

    lastIndex = currentIndex;
  }

  return planes;
}

export function rayPlaneIntersection(ray, plane) {
  const { A, B, C, D } = plane.equation;
  const { origin, direction } = ray;
  let t =
    -(A * origin.x + B * origin.y + C * origin.z + D) /
    (A * direction.x + B * direction.y + C * direction.z);

  if (t > 0) {
    const offset = vec3scale(direction, t);
    const intersection = vec3add(origin, offset);
    if (intersection.y >= 0) {
      return intersection;
    }
  }

  return null;
}

/**
 * Calculates on which side of a line is a specific point.
 *
 * @param point {x, y} Point defined by x and y.
 * @param line {P1, P2} Line defined by start point and end point.
 * @returns {number}  0 if point is on line,
 *                    < 0 if point is on right side,
 *                    > 0 if point is on left side.
 */
export function getPointOnLineSide(point, line) {
  const { P1, P2 } = line;

  return (P2.x - P1.x) * (point.y - P1.y) - (point.x - P1.x) * (P2.y - P1.y);
  // return (P2.x - P1.x) * (point.y - P1.y) - (point.y - P1.y) * (point.x - P1.x);    // should be the same
}

export function pointOnLine(point, line) {
  const { P1, P2 } = line;

  const cross =
    (point.y - P1.y) * (P2.x - P1.x) - (point.x - P1.x) * (P2.y - P1.y);
  if (Math.abs(cross) > 0.1e-2) return false;

  const dot =
    (point.x - P1.x) * (P2.x - P1.x) + (point.y - P1.y) * (P2.y - P1.y);
  if (dot < 0) return false;

  const squaredLength =
    (P2.x - P1.x) * (P2.x - P1.x) + (P2.y - P1.y) * (P2.y - P1.y);
  if (dot > squaredLength) return false;

  return true;
}

export function getPoint2DFrom3D(point) {
  return {
    x: point.x,
    y: point.z,
  };
}

/**
 * Get intersections between walls and a ray.
 */
export function getRayWallsIntersections(ray, edges, addOffset = 0) {
  const planes = getPlanesFromWalls(edges);
  return getPlaneIntersections(ray, planes, addOffset);
}

/**
 * Get intersections between edges (all edges have to be connected) and a ray.
 */
export function getRayEdgesIntersections(ray, edges) {
  const planes = getPlanesFromEdges(edges);
  return getPlaneIntersections(ray, planes);
}

/**
 * Get intersections between a ray and planes.
 */
export function getPlaneIntersections(ray, planes, addOffset = 0) {
  const intersections = [];
  for (let plane of planes) {
    let intersection = rayPlaneIntersection(ray, plane);
    if (intersection) {
      const intersection2DPoint = getPoint2DFrom3D(intersection);
      const plane2DLine = {
        P1: getPoint2DFrom3D(plane.P1),
        P2: getPoint2DFrom3D(plane.P4),
      };

      const ray2DOrigin = getPoint2DFrom3D(ray.origin);

      if (getPointOnLineSide(ray2DOrigin, plane2DLine) >= 0) {
        if (pointOnLine(intersection2DPoint, plane2DLine)) {
          const rotationY = getQuaternion(
            { x: 0, y: 1, z: 0 },
            -calculateAngle(plane.P1, plane.P4, "y")
          );

          // Add offset in z-direction (camera oriented) to avoid z-fighting while placing the model.
          if (addOffset) {
            const backward = {
              x: 0,
              y: 0,
              z: addOffset,
            };

            const rotatedBackward = vec3rot(backward, rotationY);
            const offset = vec3scale(rotatedBackward, INTERSECTION_OFFSET);
            intersection = vec3add(intersection, offset);
          }

          intersections.push({
            position: intersection,
            orientation: rotationY,
            distance: vec3length(vec3sub(intersection, ray.origin)),
            start: plane.start,
            end: plane.end,
          });
        }
      }
    }
  }
  intersections.sort((a, b) => a.distance - b.distance);

  return intersections;
}

export function getPlaneIntersection(ray, edges) {
  for (const plane of getPlanesFromEdges(edges)) {
    const intersection = rayPlaneIntersection(ray, plane);
    if (intersection && plane.start === 0) {
      const rotationY = getQuaternion(
        { x: 0, y: 1, z: 0 },
        -calculateAngle(plane.P1, plane.P4, "y")
      );
      return {
        position: intersection,
        orientation: rotationY,
      };
    }
  }
}
