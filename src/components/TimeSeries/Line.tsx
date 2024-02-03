import { select, selectAll, transition, Line as TLine } from "d3";
import React, { useCallback, useEffect, useRef } from "react";
import { TData } from "../../types";

export interface LineProps {
  // xScale: d3.ScaleBand<string>;
  xScale: d3.ScaleTime<number, number, never>;
  yScale: d3.ScaleLinear<number, number, never>;
  data: TData[];
  lineGenerator: TLine<TData>;
  width: number;
  height: number;
}

const Line = (props: LineProps) => {
  const ref = useRef<SVGGElement | null>(null);
  const { xScale, yScale, data, lineGenerator } = props;

  const updateChart = useCallback(() => {
    const t = transition().duration(1000);

    const line = select("#line");
    const dot = selectAll(".circle");

    line.datum(data).transition(t).attr("d", lineGenerator);

    // dot
    //   .data(data)
    //   .transition(t)
    //   .attr('cx', (d, key) => xScale(key))
    //   .attr('cy', d => yScale(d.count));
  }, [data, lineGenerator]);

  const drawChart = useCallback(() => {
    const node = ref.current;

    // const initialData = data.map((d) => ({
    //   name: d[0],
    //   value: d[1],
    // }));

    select(node)
      .append("path")
      .datum(data)
      .attr("id", "line")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("fill", "none")
      .attr("d", lineGenerator);

    // select(node)
    //   .selectAll('circle')
    //   .data(data)
    //   .enter()
    //   .append('circle')
    //   .attr('class', 'circle')
    //   .attr('stroke', '#ECC417')
    //   .attr('stroke-width', '2')
    //   .attr('fill', '#333')
    //   .attr('r', 3)
    //   .attr('cx', (d, key) => xScale(key))
    //   .attr('cy', d => yScale(d.count));

    updateChart();
  }, [data, lineGenerator, updateChart]);

  useEffect(() => {
    drawChart();
  }, [drawChart]);

  useEffect(() => {
    updateChart();
  }, [updateChart]);

  return <g className="line-group" ref={ref} />;
};

export default Line;
