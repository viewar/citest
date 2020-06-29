type StyleDefinition = {
  [key: string]: string | number
};

type ScreenCoordinate = {
  x: number | string,
  y: number | string,
  z: number | string,
  distance: number | string,
};

/**
 * Input some points in 3d space to get css value for the positioning in the UI.
 */
function getScreenSpaceStyles(screenCoordinates: ScreenCoordinate[]): StyleDefinition[] {
  return screenCoordinates.map((screenCoordinate: any) => {
    const x = Number.parseFloat(screenCoordinate.x);
    const y = Number.parseFloat(screenCoordinate.y);
    const distance = Number.parseFloat(screenCoordinate.distance);

    let scale = isNaN(distance) ? 1 : 1000 / (distance / 2);
    if (scale > 1) {
      scale = 1;
    }

    if (isNaN(x) || isNaN(y) || x <= 0 || y <= 0 || scale < 0.2) {
      return {
        left: 0,
        top: 0,
        display: "none",
      };
    }

    const percent = 100;
    const offset = percent / 2; // distance from screen edge to center of screen

    // calculate distance of screen point to center
    const x0 = screenCoordinate.x as number * percent - offset;
    const y0 = screenCoordinate.y as number * percent - offset;

    return {
      left: x0 + offset + "%",
      top: y0 + offset + "%",
      display: "block",
      transform: `translate(-50%, -50%) scale(${scale * 1.3})`,
    };
  });
}

export default getScreenSpaceStyles;
