import { axisBottom, axisLeft, extent, scaleLinear } from "d3";

export default function scatterplot(selection, props) {
  const { height, width, margin, circleRadius, xColumn, yColumn, data } = props;

  let xdata = d => d[xColumn];
  let ydata = d => d[yColumn];

  var innerWidth = width - margin.left - margin.right;
  var innerHeight = height - margin.top - margin.bottom;

  //selection = selection.append( 'svg' )
  //      .attr( 'width', innerWidth + margin.left + margin.right )
  //      .attr( 'height', innerHeight + margin.top + margin.bottom )
  const plot = selection.selectAll(".container").data([null]);
  const plotEnter = plot
    .enter()
    .append("g")
    .attr("class", "container");

  plotEnter
    .merge(plot)
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // scales

  let xscale = scaleLinear()
    //.domain([0, max(data, xdata)])
    .domain(extent(data, d => d[xColumn]))
    .range([0, innerWidth]);

  let yscale = scaleLinear()
    //.domain([0, max(data, ydata)])
    .domain(extent(data, ydata))
    .range([innerHeight, 0]);

  // axis
  let xAxis = axisBottom()
    .tickSize(-innerHeight)
    .scale(xscale);

  let xAxisG = plot.select(".x-axis");
  let xAxisGEnter = plotEnter.append("g").attr("class", "x-axis");

  xAxisG
    .merge(xAxisGEnter)
    .attr("transform", `translate( 0 , ${innerHeight} )`)
    .call(xAxis);

  let yAxis = axisLeft()
    .scale(yscale)
    .tickSize(-innerWidth);

  let yAxisG = plot.select(".y-axis");
  let yAxisGEnter = plotEnter.append("g").attr("class", "y-axis");
  yAxisG.merge(yAxisGEnter).call(yAxis);

  // xAxis-Label
  const xaxisLabel = plot
    .merge(plotEnter)
    .selectAll(".xlabel-text")
    .data(data);

  xaxisLabel
    .enter()
    .append("text")
    .attr("class", "xlabel-text")
    .style("text-anchor", "middle")
    .style("text-transform", "capitalize")
    .attr(
      "transform",
      `translate( ${innerWidth / 2} , ${innerHeight + margin.bottom - 10} )`
    );

  xaxisLabel.merge(xaxisLabel).text(xColumn.replace("_", " ").toLowerCase());

  // yAxis-Label
  plot
    .append("text")
    .attr("x", 0 - innerHeight / 2)
    .attr("y", 0 - margin.left)
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .style("text-transform", "capitalize")
    .text(yColumn.replace("_", " ").toLowerCase());

  // add the circles.
  const circles = plot
    .merge(plotEnter)
    .selectAll("circle")
    .data(data);

  circles
    .enter()
    .append("circle")
    .attr("cx", d => xscale(xdata(d)))
    .attr("cy", d => yscale(ydata(d)))
    .attr("r", circleRadius)
    .attr("opacity", 0.3)
    .attr("fill", "red")
    .attr("stroke", "red")
    .attr("stroke-width", 1);

  // upate new and existing circles
  circles
    .merge(circles)
    .attr("cx", d => xscale(xdata(d)))
    .attr("cy", d => yscale(ydata(d)));

  circles.exit().remove();
}
