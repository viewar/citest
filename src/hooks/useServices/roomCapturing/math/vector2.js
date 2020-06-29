export function scale(v, s) {
  return {
    x: v.x * s,
    y: v.y * s,
  };
}

export function invert(v) {
  return scale(v, -1);
}

export function normalize(v) {
  return scale(v, 1 / length(v));
}

export function subtract(v1, v2) {
  return {
    x: v2.x - v1.x,
    y: v2.y - v1.y,
  };
}

export function add(v1, v2) {
  return {
    x: v1.x + v2.x,
    y: v1.y + v2.y,
  };
}

export function length(v) {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

export function angleBetween(v1, v2) {
  const angle = Math.atan2(v2.y, v2.x) - Math.atan2(v1.y, v1.x);
  return angle < 0 ? angle + 2 * Math.PI : angle;
}

export function dotProduct(v1, v2) {
  return v1.x * v2.x + v1.y * v2.y;
}

export function normal(p1, p2) {
  const v = subtract(p1, p2);

  return normalize({
    x: -v.y,
    y: v.x,
  });
}
