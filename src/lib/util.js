export const polyline = line => line.map(p => p.join(',')).join(' ');

export const makeGetCursorPoint = svgRef => {
  const pt = svgRef.createSVGPoint();
  return ([x, y]) => {
    // https://stackoverflow.com/questions/10298658/mouse-position-inside-autoscaled-svg
    pt.x = x;
    pt.y = y;
    const r = pt.matrixTransform(svgRef.getScreenCTM().inverse());
    return [r.x, r.y];
  };
};

export const distance = (pointA, pointB) =>
  Math.sqrt(
    pointA
      .map((a, i) => Math.pow(a - pointB[i], 2))
      .reduce((acc, cur) => acc + cur, 0),
  );

export const isSamePoint = (pointA, pointB) =>
  pointA.every((a, i) => a === pointB[i]);

export const isButtonDownOrTouch = evt =>
  evt.changedTouches ? 1 : evt.buttons;
