import calculateSurfaceArea from "./calculateSurfaceArea";
import testRoomStates from "./test-room-states.json";

const CM_TO_MM = 10;

describe("calculateSurfaceArea", () => {
  /** Floor Area */

  it("calculates correct total floor area for a quadratic room", () => {
    const surfaceArea = calculateSurfaceArea(testRoomStates.quadraticFloor);
    return expect(surfaceArea.floorArea).toBe(100 * CM_TO_MM);
  });

  it("calculates correct total floor area for a rectangular room", () => {
    const surfaceArea = calculateSurfaceArea(testRoomStates.rectangularFloor);
    return expect(surfaceArea.floorArea).toBe(200 * CM_TO_MM);
  });

  it("calculates correct total floor area for a rhomboid room", () => {
    const surfaceArea = calculateSurfaceArea(testRoomStates.rhomboidFloor);
    return expect(surfaceArea.floorArea).toBe(40 * 20 * CM_TO_MM);
  });

  it("calculates correct total floor area for two rooms", () => {
    const surfaceArea = calculateSurfaceArea(testRoomStates.twoFloors);
    return expect(surfaceArea.floorArea).toBe(
      200 * CM_TO_MM + 40 * 20 * CM_TO_MM
    );
  });

  it("calculates correct floors amount for two rooms", () => {
    const surfaceArea = calculateSurfaceArea(testRoomStates.twoFloors);
    return expect(surfaceArea.floors.length).toBe(2);
  });

  it("calculates correct individual floor area for a quadratic room", () => {
    const surfaceArea = calculateSurfaceArea(testRoomStates.quadraticFloor);
    return expect(surfaceArea.floors[0].area).toBe(100 * CM_TO_MM);
  });

  it("calculates correct individual floor area for a rectangular room", () => {
    const surfaceArea = calculateSurfaceArea(testRoomStates.rectangularFloor);
    return expect(surfaceArea.floors[0].area).toBe(200 * CM_TO_MM);
  });

  it("calculates correct individual floor area for a rhomboid room", () => {
    const surfaceArea = calculateSurfaceArea(testRoomStates.twoFloors);
    return expect(surfaceArea.floors[0].area).toBe(40 * 20 * CM_TO_MM);
  });

  it("calculates correct individual floor area for two rooms", () => {
    const surfaceArea = calculateSurfaceArea(testRoomStates.twoFloors);
    expect(surfaceArea.floors[0].area).toBe(40 * 20 * CM_TO_MM);
    expect(surfaceArea.floors[1].area).toBe(200 * CM_TO_MM);
  });

  /** Floor Center */

  it("calculates correct floor center for a quadratic room", () => {
    const surfaceArea = calculateSurfaceArea(testRoomStates.quadraticFloor);
    return expect(surfaceArea.floors[0].center).toStrictEqual({
      x: 50,
      y: 0,
      z: 50,
    });
  });

  it("calculates correct floor center for a rectangular room", () => {
    const surfaceArea = calculateSurfaceArea(testRoomStates.rectangularFloor);
    return expect(surfaceArea.floors[0].center).toStrictEqual({
      x: 100,
      y: 0,
      z: 50,
    });
  });

  it("calculates correct floor center for a rhomboid room", () => {
    const diagonal = {
      x: 500,
      y: 200,
    };

    const center = {
      x: diagonal.x / 2,
      y: 0,
      z: diagonal.y / 2,
    };

    const surfaceArea = calculateSurfaceArea(testRoomStates.rhomboidFloor);
    return expect(surfaceArea.floors[0].center).toStrictEqual(center);
  });

  it("calculates correct floor centers for two rooms", () => {
    const diagonal = {
      x: 500,
      y: 200,
    };

    const center = {
      x: diagonal.x / 2,
      y: 0,
      z: diagonal.y / 2,
    };

    const surfaceArea = calculateSurfaceArea(testRoomStates.twoFloors);
    expect(surfaceArea.floors[0].center).toStrictEqual(center);
    expect(surfaceArea.floors[1].center).toStrictEqual({
      x: 100,
      y: 0,
      z: 50,
    });
  });

  /** Wall Area */

  it("calculates correct total wall area for a quadratic wall", () => {
    const surfaceArea = calculateSurfaceArea(testRoomStates.quadraticWall);
    return expect(surfaceArea.wallArea).toBe(10 * 10 * CM_TO_MM);
  });

  it("calculates correct total wall area for a rectangular wall", () => {
    const surfaceArea = calculateSurfaceArea(testRoomStates.rectangularWall);
    return expect(surfaceArea.wallArea).toBe(10 * 20 * CM_TO_MM);
  });

  it("calculates correct total wall area for a two walls", () => {
    const surfaceArea = calculateSurfaceArea(testRoomStates.twoWalls);
    return expect(surfaceArea.wallArea).toBe(
      10 * 10 * CM_TO_MM + 10 * 20 * CM_TO_MM
    );
  });

  it("calculates correct individual wall area for a quadratic wall", () => {
    const surfaceArea = calculateSurfaceArea(testRoomStates.quadraticWall);
    return expect(surfaceArea.walls[0].area).toBe(10 * 10 * CM_TO_MM);
  });

  it("calculates correct individual wall area for a rectangular wall", () => {
    const surfaceArea = calculateSurfaceArea(testRoomStates.rectangularWall);
    return expect(surfaceArea.walls[0].area).toBe(10 * 20 * CM_TO_MM);
  });

  it("calculates correct individual wall areas for a two walls", () => {
    const surfaceArea = calculateSurfaceArea(testRoomStates.twoWalls);
    expect(surfaceArea.walls[0].area).toBe(10 * 10 * CM_TO_MM);
    expect(surfaceArea.walls[1].area).toBe(10 * 20 * CM_TO_MM);
  });

  it("calculates correct total wall area for a wall with a door", () => {
    const surfaceArea = calculateSurfaceArea(testRoomStates.wallWithDoor);
    return expect(surfaceArea.wallArea).toBe(
      10 * 20 * CM_TO_MM - 5 * 5 * CM_TO_MM
    );
  });

  it("calculates correct invididual wall area for a wall with a door", () => {
    const surfaceArea = calculateSurfaceArea(testRoomStates.wallWithDoor);
    return expect(surfaceArea.walls[0].area).toBe(
      10 * 20 * CM_TO_MM - 5 * 5 * CM_TO_MM
    );
  });

  it("calculates correct total wall area for a wall with a window", () => {
    const surfaceArea = calculateSurfaceArea(testRoomStates.wallWithWindow);
    return expect(surfaceArea.wallArea).toBe(
      10 * 20 * CM_TO_MM - 5 * 5 * CM_TO_MM
    );
  });

  it("calculates correct invididual wall area for a wall with a window", () => {
    const surfaceArea = calculateSurfaceArea(testRoomStates.wallWithWindow);
    return expect(surfaceArea.walls[0].area).toBe(
      10 * 20 * CM_TO_MM - 5 * 5 * CM_TO_MM
    );
  });

  it("calculates correct total wall area for a wall with a window and a door", () => {
    const surfaceArea = calculateSurfaceArea(
      testRoomStates.wallWithWindowAndDoor
    );
    return expect(surfaceArea.wallArea).toBe(
      10 * 20 * CM_TO_MM - 2 * 5 * CM_TO_MM - 2 * 5 * CM_TO_MM
    );
  });

  it("calculates correct invididual wall area for a wall with a window and a door", () => {
    const surfaceArea = calculateSurfaceArea(
      testRoomStates.wallWithWindowAndDoor
    );
    return expect(surfaceArea.walls[0].area).toBe(
      10 * 20 * CM_TO_MM - 2 * 5 * CM_TO_MM - 2 * 5 * CM_TO_MM
    );
  });

  /** Wall Center */

  it("calculates correct wall center for a quadratic wall", () => {
    const surfaceArea = calculateSurfaceArea(testRoomStates.quadraticWall);
    return expect(surfaceArea.walls[0].center).toStrictEqual({
      x: 50,
      y: 50,
      z: 0,
    });
  });

  it("calculates correct wall center for a rectangular wall", () => {
    const surfaceArea = calculateSurfaceArea(testRoomStates.rectangularWall);
    return expect(surfaceArea.walls[0].center).toStrictEqual({
      x: 50,
      y: 100,
      z: 0,
    });
  });

  it("calculates correct individual wall center for a diagonal wall", () => {
    const surfaceArea = calculateSurfaceArea(
      testRoomStates.rhomboidFloorWithWall
    );
    return expect(surfaceArea.walls[0].center).toStrictEqual({
      x: 50,
      y: 100,
      z: 100,
    });
  });
});
