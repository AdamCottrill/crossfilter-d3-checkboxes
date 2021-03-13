import debug from "debug";

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

const prepare_data = (data) => {
  return {
    category: data.category,
    color: data.color,
    group: data.group,
    count: +data.count,
  };
};

// the name of the column with our response:
const column = "count";

const filters = {};

tsv("data/data.tsv", prepare_data).then((data) => {
  let ndx = crossfilter(data);
  let categoryDim = ndx.dimension((d) => d.category);
  let groupDim = ndx.dimension((d) => d.group);
  let colorDim = ndx.dimension((d) => d.color);

  let categoryGroup = categoryDim.group().reduceSum((d) => d[column]);
  let groupGroup = groupDim.group().reduceSum((d) => d[column]);
  let colorGroup = colorDim.group().reduceSum((d) => d[column]);

  //ininitialize our filters - all checked at first
  filters["color"] = colorDim
    .group()
    .all()
    .map((d) => d.key);
  filters["category"] = categoryDim
    .group()
    .all()
    .map((d) => d.key);
  filters["group"] = groupDim
    .group()
    .all()
    .map((d) => d.key);

  categoryDim.filter((val) => filters["category"].indexOf(val) > -1);
  groupDim.filter((val) => filters["group"].indexOf(val) > -1);
  colorDim.filter((val) => filters["color"].indexOf(val) > -1);

  let categorySelection = select("#category-filter");
  checkBoxes(categorySelection, {
    label: "category",
    xfdim: categoryDim,
    xfgroup: categoryGroup,
    filters: filters,
  });

  let colorSelection = select("#color-filter");
  checkBoxes(colorSelection, {
    label: "color",
    xfdim: colorDim,
    xfgroup: colorGroup,
    filters: filters,
  });

  let groupSelection = select("#group-filter");
  checkBoxes(groupSelection, {
    label: "group",
    xfdim: groupDim,
    xfgroup: groupGroup,
    filters: filters,
  });

  ndx.onChange(() => {
    checkBoxes(categorySelection, {
      label: "category",
      xfdim: categoryDim,
      xfgroup: categoryGroup,
      filters: filters,
    });
    checkBoxes(groupSelection, {
      label: "group",
      xfdim: groupDim,
      xfgroup: groupGroup,
      filters: filters,
    });
    checkBoxes(colorSelection, {
      label: "color",
      xfdim: colorDim,
      xfgroup: colorGroup,
      filters: filters,
    });
  });
});
