export const checkBoxes = (selection, props) => {
  const { label, xfdim, xfgroup, filters, updatefilters } = props;

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

  // an object to contain the checkbox status for each checkbox
  let checkbox_map = {};
  keys.forEach(
    d => (checkbox_map[d.key] = myfilters.indexOf(d.key) > -1 ? true : false)
  );

  //  if (label === "species" && myfilters.length < 5) {
  //    debugger;
  //  }

  let cbarray = selection
    .enter()
    .append("div")
    .merge(selection);

  //let boxes = cbarray.selectAll("div").data(keys);
  let boxes = cbarray.selectAll("div").data(keys, d => d.key);

  boxes.exit().remove();

  let boxesEnter = boxes
    .enter()
    .append("div")
    .attr("class", "inline field");

  boxesEnter = boxesEnter.merge(boxes);

  let uiCheckbox = boxesEnter.append("div").attr("class", "checkbox");

  uiCheckbox
    .append("input")
    .attr("type", "checkbox")
    .property("checked", d => {
      if (label === "species") {
        //        console.log(
        //          "d = ",
        //          d,
        //          "; checkbox_map[d.key]; = ",
        //          checkbox_map[d.key]
        //        );
      }

      return checkbox_map[d.key];
    })
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
      // console.log("myfilters = ", myfilters);

      xfdim.filter(val => myfilters.indexOf(val) > -1);
      updatefilters(label, myfilters);
      this.checked = !this.checked;
    });

  uiCheckbox.append("label").text(d => d.key + " (n=" + d.value + ")");
};
