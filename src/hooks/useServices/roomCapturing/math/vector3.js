export const scale = (i, s) => ({ x: i.x * s, y: i.y * s, z: i.z * s });
export const dot = (i, j) => i.x * j.x + i.y * j.y + i.z * j.z;
export const sub = (i, j) => ({ x: i.x - j.x, y: i.y - j.y, z: i.z - j.z });
export const add = (i, j) => ({ x: i.x + j.x, y: i.y + j.y, z: i.z + j.z });
export const length = i => Math.sqrt(i.x ** 2 + i.y ** 2 + i.z ** 2);
export const invert = i => scale(i, -1);
export const normalize = i => scale(i, 1 / length(i));
export const cross = (v1, v2) => ({
  x: v1.y * v2.z - v1.z * v2.y,
  y: v1.z * v2.x - v1.x * v2.z,
  z: v1.x * v2.y - v1.y * v2.x,
});

export const calculateAngle = (v1, v2, axis = "y") => {
  switch (axis) {
    case "y":
      return Math.atan2(v2.z - v1.z, v2.x - v1.x);
    default:
      throw new Error();
  }
};

export const getQuaternion = ({ x, y, z }, phi) => {
  return {
    w: Math.cos(phi / 2),
    x: x * Math.sin(phi / 2),
    y: y * Math.sin(phi / 2),
    z: z * Math.sin(phi / 2),
  };
};

export function getPitchFromQuaternion({ w, x, y, z }) {
  // From ogre's quaternion.h
  const fTx = 2 * x;
  const fTz = 2 * z;

  const fTwx = fTx * w;
  const fTxx = fTx * x;
  const fTyz = fTz * y;
  const fTzz = fTz * z;

  return Math.atan2(fTyz + fTwx, 1 - (fTxx + fTzz));
}

export const multiplyQuaternions = (q1, q2) => {
  return {
    w: q1.w * q2.w - q1.x * q2.x - q1.y * q2.y - q1.z * q2.z,
    x: q1.w * q2.x + q1.x * q2.w + q1.y * q2.z - q1.z * q2.y,
    y: q1.w * q2.y + q1.y * q2.w + q1.z * q2.x - q1.x * q2.z,
    z: q1.w * q2.z + q1.z * q2.w + q1.x * q2.y - q1.y * q2.x,
  };
};

export const matrixToQuaternion = (m0, m1, m2) => {
  const w = Math.sqrt(1 + m0.x + m1.y + m2.z) / 2;
  return {
    w,
    x: (m2.y - m1.z) / (4 * w),
    y: (m0.z - m2.x) / (4 * w),
    z: (m1.x - m0.y) / (4 * w),
  };
};

export const rot = ({ x, y, z }, { w: qw, x: qx, y: qy, z: qz }) => {
  const ix = qw * x + qy * z - qz * y;
  const iy = qw * y + qz * x - qx * z;
  const iz = qw * z + qx * y - qy * x;
  const iw = -qx * x - qy * y - qz * z;

  return {
    x: ix * qw + iw * -qx + iy * -qz - iz * -qy,
    y: iy * qw + iw * -qy + iz * -qx - ix * -qz,
    z: iz * qw + iw * -qz + ix * -qy - iy * -qx,
  };
};
