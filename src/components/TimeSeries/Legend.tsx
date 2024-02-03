import React, { useRef } from "react";
import { select } from "d3";

export interface LegendProps {
  transform: string;
  id: string;
  text: string;
  textTransform?: string;
}

const Legend = (props: LegendProps) => {
  const { id, text, transform, textTransform = "" } = props;
  const ref = useRef<SVGGElement | null>(null);

  const legend = select(ref.current)
    .attr("id", id)
    .attr("transform", transform);
  legend
    .append("text")
    .text(text)
    .style("font-size", "15px")
    .style("margin-left", "40px")
    .style("transform", textTransform)
    .attr("alignment-baseline", "middle");

  return <g ref={ref}>Legend</g>;
};

export default Legend;
