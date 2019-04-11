export const checkBoxes = (selection, props) => {
  const {
    label,
    xfdim,
    filters
    //onOptionClicked
  } = props;

  //  `<div class="checkbox" id={}>
  //      <label>
  //          <input type="checkbox" value="${}" checked>
  //          ${}
  //      </label>
  //  </div>`

  // all keys in our dimenions
  let keys = xfdim
    .group()
    .all()
    .map(d => d.key);

  let myselect = selection
    .selectAll("input")
    .data(keys)
    .enter();

  myselect
    .append("label")
    .attr("for", d => label + "-" + d)
    .text(function(d) {
      return d;
    })
    .append("input")
    .attr("checked", true)
    .attr("type", "checkbox")
    .attr("value", d => d)
    .attr("id", d => label + "-" + d)
    .on("click", function() {
      if (this.checked) {
        filters[label].push(this.value);
      } else {
        filters[label] = filters[label].filter(d => d !== this.value);
      }
      console.log("filters = ", filters);

      xfdim.filter(d => filters[label].indexOf(d) > -1);
    });

  myselect = myselect.merge(myselect);

  myselect.exit().remove();
};
