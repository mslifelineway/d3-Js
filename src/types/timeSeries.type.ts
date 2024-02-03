import { Selection } from "d3";

export type TData = [string, number];
export type TSelection = Selection<
  SVGSVGElement | null,
  unknown,
  null,
  undefined
>;
export type TExtent = [[number, number], [number, number]];
