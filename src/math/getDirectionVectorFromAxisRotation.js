  const resultsCache = {};

  export const getYAxisDirectionVector = (yAxisRotation) => {
    if (resultsCache?.[yAxisRotation] !== undefined) return resultsCache[yAxisRotation];
    const x = Math.sin(-yAxisRotation);
    const z = Math.cos(yAxisRotation);
    resultsCache[yAxisRotation] = {  x, y: 0, z };
    return { x, y: 0, z };
  }