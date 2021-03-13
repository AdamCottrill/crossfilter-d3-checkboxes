import debug from "debug";

import { tsv, select, selectAll } from "d3";
import crossfilter from "crossfilter2";

import { checkBoxes } from "./checkBoxArray";
import createTable from "./createTable";

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

const hideShowTableRows = (row_ids) => {
  // get all of the rows in the current able and set the visibility
  // if the id of the row is in the rowIds attribute.

  selectAll("#table-div tbody tr").each(function () {
    select(this).style("display", (d) =>
      row_ids.indexOf(d.id) >= 0 ? "" : "None"
    );
  });
};

// the name of the column with our response:
const column = "count";

const filters = {};

const categoryPopup = {
  A: "Apple",
  B: "Banana",
  C: "Carrot",
};

const colorPopup = {
  red: "Scarlet",
  blue: "Saphire",
  green: "Forest",
  yellow: "Sunshine",
  violet: "Plum Crazy",
};

const groupPopup = {
  1: "Small",
  2: "Medium",
  3: "Large",
};

tsv("data/data.tsv", prepare_data).then((data) => {
  data.forEach((d, id) => (d.id = id));

  const tableselection = select("#table-div");
  createTable(tableselection, data, ["category", "color", "group", "count"]);

  let ndx = crossfilter(data);
  let categoryDim = ndx.dimension((d) => d.category);
  let groupDim = ndx.dimension((d) => d.group);
  let colorDim = ndx.dimension((d) => d.color);

  let categoryGroup = categoryDim.group().reduceSum((d) => d[column]);
  let groupGroup = groupDim.group().reduceSum((d) => d[column]);
  let colorGroup = colorDim.group().reduceSum((d) => d[column]);

  const activeIds = () => ndx.allFiltered().map((x) => x.id);

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
    popup: categoryPopup,
    xfdim: categoryDim,
    xfgroup: categoryGroup,
    filters: filters,
  });

  let colorSelection = select("#color-filter");
  checkBoxes(colorSelection, {
    label: "color",
    popup: colorPopup,
    xfdim: colorDim,
    xfgroup: colorGroup,
    filters: filters,
  });

  let groupSelection = select("#group-filter");
  checkBoxes(groupSelection, {
    label: "group",
    popup: groupPopup,
    xfdim: groupDim,
    xfgroup: groupGroup,
    filters: filters,
  });

  ndx.onChange(() => {
    hideShowTableRows(activeIds());

    checkBoxes(categorySelection, {
      label: "category",
      popup: categoryPopup,
      xfdim: categoryDim,
      xfgroup: categoryGroup,
      filters: filters,
    });
    checkBoxes(groupSelection, {
      label: "group",
      popup: groupPopup,
      xfdim: groupDim,
      xfgroup: groupGroup,
      filters: filters,
    });
    checkBoxes(colorSelection, {
      label: "color",
      popup: colorPopup,
      xfdim: colorDim,
      xfgroup: colorGroup,
      filters: filters,
    });
  });
});
