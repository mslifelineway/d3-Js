import React, { useCallback, useEffect, useRef, useState } from "react";
import { API_URL, dimensions } from "../components/TimeSeries/contants";
import { TData, TExtent, TSelection } from "../types";
import {
  axisBottom,
  curveMonotoneX,
  line,
  max,
  min,
  scaleLinear,
  scaleTime,
  select,
  zoom,
} from "d3";
import XYAxis, { XYAxisProps } from "../components/TimeSeries/XYAxis";
import Line, { LineProps } from "../components/TimeSeries/Line";
import Bar, { BarProps } from "../components/TimeSeries/Bar";
import Legend, { LegendProps } from "../components/TimeSeries/Legend";

const TimeSeries = () => {
  const { canvasHeight, canvasWidth, padding } = dimensions;
  const ref = useRef<SVGSVGElement | null>(null);
  const [data, setData] = useState<TData[]>([]);
  const [selection, setSelection] = useState<null | TSelection>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      const resData = await res.json();
      setData(resData.data);
    } catch (error) {
      console.log("error while fetching data....");
    }
  }, []);

  const initSvg = useCallback(() => {
    if (!selection) {
      setSelection(
        select(ref.current)
          .attr("id", "svg-gdp")
          .attr("width", canvasWidth)
          .attr("height", canvasHeight)
      );
    }
  }, [canvasHeight, canvasWidth, selection]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    initSvg();
  }, [initSvg]);

  const yMax = max(data, (item) => item[1]);
  const dateValues: Date[] = data.map((item) => new Date(item[0]));
  const minDateValues = min(dateValues);
  const maxDateValues = max(dateValues);

  const yScale = scaleLinear()
    .domain([0, yMax!])
    .range([0, dimensions.canvasHeight - 2 * dimensions.padding]);
  const xScale = scaleLinear()
    .domain([0, data.length - 1])
    .range([dimensions.padding, dimensions.canvasWidth - dimensions.padding]);

  const yAxisScale = scaleLinear()
    .domain([0, yMax!])
    .range([dimensions.canvasHeight - dimensions.padding, dimensions.padding]);
  const xAxisScale = scaleTime()
    .domain([minDateValues || 0, maxDateValues || 0])
    .range([dimensions.padding, dimensions.canvasWidth - dimensions.padding]);

  const xAxis = axisBottom(xAxisScale).tickSizeOuter(0);

  const lineGenerator = line<TData>()
    .x((_, i) => xScale(i))
    .y((item) => yScale(item[1]))
    .curve(curveMonotoneX);

  const axisProps: XYAxisProps = {
    xScale: xAxisScale,
    yScale: yAxisScale,
    canvasHeight,
    padding,
  };

  const lineProps: LineProps = {
    xScale: xAxisScale,
    yScale: yAxisScale,
    height: canvasHeight,
    lineGenerator,
    width: canvasWidth,
    data,
  };
  const barProps: BarProps = {
    xScale: xScale,
    yScale: yScale,
    data,
  };

  function zoomBehavior(svg: any) {
    const extent: TExtent = [
      [padding, padding],
      [canvasWidth - padding, canvasHeight - padding],
    ];

    svg.call(
      zoom()
        .scaleExtent([1, 15])
        .translateExtent(extent)
        .extent(extent)
        .on("zoom", zoomed)
    );

    function zoomed(event: any) {
      const transform = event.transform;
      xScale.range(
        [padding, canvasWidth - padding].map((d) => transform.applyX(d))
      );
      svg
        .selectAll(".bars rect")
        .attr("x", (_: TData, i: number) => xScale(i))
        .attr("width", transform.k);
      svg.selectAll(".x-axis").call(xAxis);
    }
  }

  selection?.call(zoomBehavior);

  const legendXProps: LegendProps = {
    id: "legend-gdp-year",
    transform: `translate(${canvasWidth / 2},${canvasHeight - padding / 2})`,
    text: "Year",
  };
  const legendYProps: LegendProps = {
    id: "legend-gdp-value",
    transform: `translate(${padding / 4},${canvasHeight / 2})`,
    textTransform: `rotate(-90deg)`,
    text: "Value",
  };

  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        width: "100%",
        height: "90vh",
      }}
    >
      <svg ref={ref} style={{ background: "#fff0cb" }}>
        <text id="title" x={canvasWidth / 2} y={padding / 2}>
          GDP
        </text>
        <XYAxis {...axisProps} />
        <Bar {...barProps} />
        <Legend {...legendXProps} />
        <Legend {...legendYProps} />
        {/* <Line {...lineProps} /> */}
      </svg>
    </div>
  );
};

export default TimeSeries;
