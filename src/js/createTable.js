const createTable = (selection, data, columns) => {
  const table = selection.append("table").attr("class", "ui table");
  const thead = table.append("thead");
  const tbody = table.append("tbody");

  // append the header row
  thead
    .append("tr")
    .selectAll("th")
    .data(columns)
    .enter()
    .append("th")
    .text((column) => column);

  // add key to each to each row to allow us to toggle visibility:
  const rows = tbody
    .selectAll("tr")
    .data(data)
    .enter()
    .append("tr")
    .attr("id", (d) => "row-" + d.id);

  rows
    .selectAll("td")
    .data((row) => {
      return columns.map((column) => {
        return { column: column, value: row[column] };
      });
    })

    .enter()
    .append("td")
    .text((d) => d.value);
  return table;
};

export default createTable;
