import React from "react";
import Axis, { AxisProps } from "./Axis";

export interface XYAxisProps {
  xScale: d3.ScaleTime<number, number, never>;
  yScale: d3.ScaleLinear<number, number, never>;
  canvasHeight: number;
  padding: number;
}
const XYAxis = (props: XYAxisProps) => {
  const { xScale, yScale, canvasHeight, padding } = props;

  const xSettings: AxisProps = {
    id: "x-axis",
    scaleX: xScale,
    orient: "bottom",
    transform: `translate(0 , ${canvasHeight - padding})`,
  };
  const ySettings: AxisProps = {
    id: "y-axis",
    scaleY: yScale,
    orient: "left",
    transform: `translate(${padding}, 0)`,
    ticks: 6,
  };

  return (
    <g className="axis-group">
      <Axis {...xSettings} />
      <Axis {...ySettings} />
    </g>
  );
};

export default XYAxis;
