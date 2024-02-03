import { axisBottom, axisLeft, select, AxisScale } from "d3";
import React, { useCallback, useEffect, useRef } from "react";

export interface AxisProps {
  scaleX?: AxisScale<Date>;
  scaleY?: AxisScale<number>;
  orient: "bottom" | "left";
  ticks?: number;
  transform: string;
  id: string;
}
const Axis = (props: AxisProps) => {
  const ref = useRef<SVGGElement | null>(null);
  const { scaleX, scaleY, orient, ticks, transform, id } = props;

  const renderAxis = useCallback(() => {
    const node = ref.current;
    let axis;

    if (orient === "bottom" && scaleX) {
      axis = axisBottom(scaleX);
    }
    if (orient === "left" && scaleY) {
      axis = axisLeft(scaleY).ticks(ticks);
    }
    if (node && axis) select(node).call(axis);
  }, [orient, scaleX, scaleY, ticks]);

  const updateAxis = useCallback(() => {
    if (orient === "left" && scaleY) {
      axisLeft(scaleY).ticks(ticks);
    }
  }, [orient, scaleY, ticks]);

  useEffect(() => {
    renderAxis();
  }, [renderAxis]);

  useEffect(() => {
    updateAxis();
  }, [updateAxis]);

  return (
    <g ref={ref} transform={transform} id={id} className={`${orient} axis`} />
  );
};
export default Axis;
