import viewarApi from "viewar-api";
import {
  getRayFromPose,
  getRayWallsIntersections,
  rayPlaneIntersection,
} from "../math/math";
import { createWall, createWallFromRoomState } from "./wall";

/**
 * Keep track of all the captured walls in the scene.
 * Import walls from room state to be able to load walls from a project.
 */
function createWallManager() {
  // Keep separate track of walls and room state walls to be able to reset
  // them separately (e.g. when changing the room layout we don't want to
  // loose all other captured walls).
  let walls = [];
  let roomWalls = [];
  let ceiling = 0;

  //------------------
  // PUBLIC METHODS
  //------------------

  /**
   * Reset all walls.
   */
  const reset = () => {
    walls = [];
    roomWalls = [];
    ceiling = 0;
  };

  /**
   * Import all walls from a room state (see viewarApi.roomManager.roomDescription).
   * Will override all existing previously set room walls.
   */
  const setRoomWalls = roomState => {
    roomWalls = [];

    if (roomState && roomState.Walls && roomState.SegmentPoints) {
      roomWalls = [
        ...roomState.Walls.map(wall =>
          createWallFromRoomState(wall, roomState.SegmentPoints)
        ),
      ];
    }
  };

  /**
   * Add a single captured wall.
   * @param {Object} start The starting point (x/y/z).
   * @param {Object} end The ending point (x/y/z).
   */
  const addWall = (start, end) => {
    walls.push(createWall({ start, end }));
  };

  /**
   * Get all intersections between the camera ray and the walls.
   */
  const getCameraRayIntersections = async (addOffset = 0) => {
    if (viewarApi.coreInterface.platform === "Mock") {
      return [
        {
          x: 0,
          y: 0,
          z: 0,
        },
      ];
    }

    const pose = await viewarApi.cameras.arCamera.updatePose();
    const ray = getRayFromPose(pose);

    const intersections = getRayWallsIntersections(ray, getWalls(), addOffset);
    return intersections;
  };

  /**
   * Set ceiling height.
   */
  const setCeiling = newCeiling => {
    ceiling = newCeiling;
  };

  /**
   * Get intersection (if existing) between camera ray and a given ceiling height.
   */
  const getCameraRayCeilingIntersection = async ceilingHeight => {
    if (viewarApi.coreInterface.platform === "Mock") {
      return {
        x: 0,
        y: ceilingHeight,
        z: 0,
      };
    }

    const ray = getRayFromPose(await viewarApi.cameras.arCamera.updatePose());

    return rayPlaneIntersection(ray, {
      equation: {
        A: 0,
        B: 1,
        C: 0,
        D: -ceilingHeight,
      },
    });
  };

  //------------------
  // PRIVATE METHODS
  //------------------

  /**
   * Combine normal walls and room walls.
   */
  const getWalls = () => [...walls, ...roomWalls];

  //------------------
  // INTERFACE
  //------------------

  return {
    reset,
    addWall,
    setRoomWalls,
    getCameraRayIntersections,
    setCeiling,
    getCameraRayCeilingIntersection,

    get ceiling() {
      return ceiling;
    },
    get walls() {
      return getWalls();
    },
  };
}

export default createWallManager();
