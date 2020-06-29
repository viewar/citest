export function createWall({ start, end }) {
  return {
    get start() {
      return start;
    },
    get end() {
      return end;
    },
  };
}

export function createWallFromRoomState(wall, segmentPoints) {
  const startSegmentPoint = segmentPoints.find(
    point => point.uid === wall.startSP
  );
  const endSegmentPoint = segmentPoints.find(point => point.uid === wall.endSP);

  return createWall({
    start: startSegmentPoint.position,
    end: endSegmentPoint.position,
  });
}
