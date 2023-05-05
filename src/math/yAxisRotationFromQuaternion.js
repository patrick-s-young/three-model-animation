

export const yAxisRotationFromQuaterion = (sourceQuaternion) => {
  const [x, y, z, w] = sourceQuaternion.toArray();
    const angle = 2 * Math.acos(w);
    let s;
    if (1 - w * w < 0.000001) {
      s = 1;
    } else {
      s = Math.sqrt(1 - w * w);
    }
    return y/s * angle;
}