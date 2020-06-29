import Polygon from "polygon";

export type ExportState = {
  scene:{
    controlPoints: {
      [key: string]: {
        x: number,
        y: number,
      }
    },
    walls: {
      [key: string]: {
        points: string[],
        objects: {
          type: string,
          length: number,
          height?: number,
          verticalOffset?: number
        }[],
        height: number
      }
    },
    rooms: {
      [key: string]: {
        points: string[]
      }
    }
  }
};

export type Area = {
  area: number,
  center: {
    x: number,
    y: number,
    z: number
  }
};

export type SurfaceArea = {
  floorArea: number,
  wallArea: number,
  floors: Area[],
  walls: Area[],
};

const CM_TO_MM = 10;

function getWall({points, objects, height: wallHeight}, controlPoints) {
  let area = 0;

  const polygonPoints = [];
  for (let i = 0; i <= 1; i++) {
    const controlPoint = controlPoints[points[i]];

    if (controlPoint) {
      polygonPoints.push({
        x: controlPoint.x,
        y: controlPoint.y,
      });
    }
  }

  const wall = new Polygon(polygonPoints);
  const center = wall.center();

  for (const {type, length, height, verticalOffset} of objects) {
    switch(type) {
      case "wall":
        area += length * wallHeight;
        break;
      case "window":
        area += length * (wallHeight - (height - verticalOffset));
        break;
      case "door":
        area += length * (wallHeight - height);
        break;
    }
  }

  return {
    center: {
      x: center.x * CM_TO_MM,
      y: wallHeight / 2 * CM_TO_MM,
      z: center.y * CM_TO_MM,
    },
    area: area * CM_TO_MM,
  };
}

function getFloor({ points }, controlPoints) {
  const polygonPoints = [];

  for (const point of points) {
    const controlPoint = controlPoints[point];
    if (controlPoint) {
      polygonPoints.push({
        x: controlPoint.x,
        y: controlPoint.y,
      });
    }
  }

  const floor = new Polygon(polygonPoints);

  const center = floor.center();
  return {
    area: Math.abs(floor.area() * CM_TO_MM),    // Can be negative, depending on the order (clockwise or counter-clockwise).
    center: {
      x: center.x * CM_TO_MM,
      y: 0,
      z: center.y * CM_TO_MM,
    },
  }
}

function calculateSurfaceArea(exportState: ExportState) : SurfaceArea {
  const surfaceArea = {
    wallArea: 0,
    floorArea: 0,
    walls: [],
    floors: [],
  };

  // Get walls
  for (const wallSpec of Object.values(exportState.scene.walls)) {
    const wall = getWall(wallSpec, exportState.scene.controlPoints);
    surfaceArea.wallArea += wall.area;
    surfaceArea.walls.push(wall);
  }

  // Get floors.
  for (const floorSpec of Object.values(exportState.scene.rooms)) {
    const floor = getFloor(floorSpec, exportState.scene.controlPoints);
    surfaceArea.floorArea += floor.area;
    surfaceArea.floors.push(floor);
  }

  return surfaceArea;
}

export default calculateSurfaceArea;
