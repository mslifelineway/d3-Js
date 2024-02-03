import React, { useCallback, useEffect, useRef } from "react";
import { dimensions } from "./contants";
import { TData } from "../../types";
import { ScaleLinear, select } from "d3";

const tooltip = select("body")
  .append("div")
  .attr("id", "tooltip")
  .style("width", "auto")
  .attr("height", "auto")
  .style("visibility", "hidden");

export interface BarProps {
  data: TData[];
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
}

const Bar = (props: BarProps) => {
  const ref = useRef<SVGGElement | null>(null);
  const { data, xScale, yScale } = props;

  const drawBars = useCallback(() => {
    select(ref.current)
      .attr("id", "rects-group")
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .style("fill", "#48bde9")
      .attr(
        "width",
        (dimensions.canvasWidth - 2 * dimensions.padding) / data.length
      )
      .attr("data-date", (item: TData) => item[0])
      .attr("data-gdp", (item: TData) => item[1])
      .attr("height", (item) => yScale(item[1]))
      .attr("x", (_, index) => {
        return xScale(index);
      })
      .attr("y", (item) => {
        return dimensions.canvasHeight - dimensions.padding - yScale(item[1]);
      })
      .on("mouseover", function (this: SVGRectElement, _: any, item: TData) {
        tooltip.transition().duration(0.5).style("visibility", "visible");
        tooltip.text(item[0]);
        document.querySelector("#tooltip")?.setAttribute("data-date", item[0]);
        select(this).style("fill", "#fa541c");
      })
      .on("mouseout", function (this: SVGRectElement) {
        tooltip.text("");
        tooltip.transition().duration(0.5).style("visibility", "hidden");
        document.querySelector("#tooltip")?.setAttribute("data-date", "");
        select(this).style("fill", "#48bde9");
      });
  }, [data, xScale, yScale]);

  useEffect(() => {
    drawBars();
  }, [drawBars]);

  return <g className="bars" ref={ref} />;
};

export default Bar;
