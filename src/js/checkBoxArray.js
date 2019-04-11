export const checkBoxes = (selection, props) => {
  const { label, xfdim, xfgroup, filters } = props;

  // semantic-ui checkbox markup:
  //  `<div class="checkbox" id={}>
  //      <label>
  //          <input type="checkbox" value="${}" checked>
  //          ${}
  //      </label>
  //  </div>`

  let myfilters = filters[label];

  let keys = xfgroup.top("Infinity").filter(d => d.value > 0);
  //.map(d => d.key);
  keys.sort((a, b) => a.key - b.key);

  let cbarray = selection
    .enter()
    .append("div")
    .merge(selection);

  let boxes = cbarray.selectAll("div").data(keys, d => d.key);

  boxes.exit().remove();

  let boxesEnter = boxes
    .enter()
    .append("div")
    .attr("class", "inline field");

  boxesEnter = boxesEnter.merge(boxes);

  let uiCheckbox = boxesEnter
    .append("div")

    .attr("class", "checkbox");

  const get_checked = (x, filters) => {
    let checked = filters.indexOf(x.key) > -1 ? true : false;
    if (label === "species") {
      console.log("checked = ", checked);
      console.log("filters = ", filters, "; x.key = ", x.key);
    }

    return checked;
  };

  uiCheckbox
    .append("input")
    .attr("type", "checkbox")
    .attr("checked", d => get_checked(d, myfilters))
    .attr("value", d => d.key)
    .on("click", function() {
      //console.log("this.checked = ", this.checked);

      //debugger;
      if (this.checked) {
        // add the value that was just selected.
        myfilters.push(this.value);
      } else {
        // remove the value of the box that was just unchecked
        myfilters = myfilters.filter(val => val !== this.value);
      }
      console.log("myfilters = ", myfilters);

      xfdim.filter(val => myfilters.indexOf(val) > -1);
      filters[label] = myfilters;
    });

  uiCheckbox.append("label").text(d => d.key + " (n=" + d.value + ")");
};
