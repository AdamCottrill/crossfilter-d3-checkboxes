import debug from "debug";

import { prepare_data } from "./utils";

import { tsv, select } from "d3";
import crossfilter from "crossfilter2";

import { checkBoxes } from "./checkBoxArray";

const log = debug("app:log");

if (ENV !== "production") {
  debug.enable("*");
  const now = new Date().toString().slice(16, -33);
  log(`Debugging is enabled! (${now})`);
} else {
  debug.disable();
}

const column = "events";
const filters = {};

tsv("data/SomeStockingData.tsv", prepare_data).then(data => {
  let ndx = crossfilter(data);
  let yearDim = ndx.dimension(d => d.year);
  let clipaDim = ndx.dimension(d => d.clipa);
  let dev_descDim = ndx.dimension(d => d.dev_desc);
  let gridDim = ndx.dimension(d => d.grid);
  let speciesDim = ndx.dimension(d => d.species);
  let strainnameDim = ndx.dimension(d => d.strainname);

  let yearGroup = yearDim.group().reduceSum(d => d[column]);
  let clipaGroup = clipaDim.group().reduceSum(d => d[column]);
  let dev_descGroup = dev_descDim.group().reduceSum(d => d[column]);
  let gridGroup = gridDim.group().reduceSum(d => d[column]);
  let speciesGroup = speciesDim.group().reduceSum(d => d[column]);
  let strainnameGroup = strainnameDim.group().reduceSum(d => d[column]);

  //ininitialize our filters - all checked at first
  filters["species"] = speciesDim
    .group()
    .all()
    .map(d => d.key);
  filters["year"] = yearDim
    .group()
    .all()
    .map(d => d.key);
  filters["clipa"] = clipaDim
    .group()
    .all()
    .map(d => d.key);

  yearDim.filter(val => filters["year"].indexOf(val) > -1);
  clipaDim.filter(val => filters["clipa"].indexOf(val) > -1);
  speciesDim.filter(val => filters["species"].indexOf(val) > -1);

  let yearSelection = select("#year-filter");
  checkBoxes(yearSelection, {
    label: "year",
    xfdim: yearDim,
    xfgroup: yearGroup,
    filters: filters
  });

  let speciesSelection = select("#species-filter");
  checkBoxes(speciesSelection, {
    label: "species",
    xfdim: speciesDim,
    xfgroup: speciesGroup,
    filters: filters
  });

  let clipaSelection = select("#clipa-filter");
  checkBoxes(clipaSelection, {
    label: "clipa",
    xfdim: clipaDim,
    xfgroup: clipaGroup,
    filters: filters
  });

  ndx.onChange(() => {
    checkBoxes(yearSelection, {
      label: "year",
      xfdim: yearDim,
      xfgroup: yearGroup,
      filters: filters
    });
    checkBoxes(clipaSelection, {
      label: "clipa",
      xfdim: clipaDim,
      xfgroup: clipaGroup,
      filters: filters
    });
    checkBoxes(speciesSelection, {
      label: "species",
      xfdim: speciesDim,
      xfgroup: speciesGroup,
      filters: filters
    });
  });
});
