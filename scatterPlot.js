import * as d3 from "https://unpkg.com/d3?module";

// input: selector for a chart container e.g., ".chart"
export default function scatterPlot(container) {
  d3.select(".chart").append("svg");
  // initialization
  const margin = { top: 60, right: 60, bottom: 60, left: 80 };
  const width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  const svg = d3
    .select(".scatterplot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")

    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  let xScale = d3.scaleLinear().range([0, width]);

  let yScale = d3.scaleLinear().range([0, height]);

  var xDomain, data;
  var selected = null,
    xDomain,
    data;

  let x_axis = svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`);

  let y_axis = svg.append("g").attr("class", "y-axis");

  const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

  let xLabel = svg
    .append("text")
    .attr("class", "x-axis-title")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .attr("font-size", "11px");

  //ylabel
  let y_label = svg
    .append("text")
    .attr("class", "y-axis-title")
    .attr("x", 1)
    .attr("y", -15)
    .attr("font-size", "11px")
    .attr("text-anchor", "right")
    .style("font-family", "Optima, sans-serif");

  //tooltip
  var tooltip = svg
    .append("text")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "3px")
    .style("border-radius", "8px")
    .style("padding", "15px");

  function update(data, artistArray) {
    let current_artists = data.map(d=> d.artist)
    let filter = []
    let newData = []
    
    for (let i = 0; i < artistArray.length; i++) {
        filter = data.filter(d=> d.artist === artistArray[i])
        for (let j = 0; j < filter.length; j++) {
          newData.push(filter[j])
        }
    }
    console.log(newData)
    let temp_array = []
    for (let i = 0; i < newData.length; i++) {
      temp_array.push(newData[i].artist)
    }
    let color_domain = []
    color_domain.push(temp_array[0])
   for (let i = 1; i < temp_array.length - 1; i++) {
      if (temp_array[i]!=temp_array[i+1])
        {
          color_domain.push(temp_array[i+1])
        }
    }
    
   colorScale.domain(color_domain);
  
    let durationMin = d3.min(newData, (d) => d.duration),
      durationMax = d3.max(newData, (d) => d.duration);

    let popMin = d3.min(newData, (d) => d.popularity),
      popMax = d3.max(newData, (d) => d.popularity);

    let artistMin = d3.min(newData, (d) => d.artist),
      artistMax = d3.max(newData, (d) => d.artist);

    xScale.domain([durationMin / 60000, durationMax / 60000]).ticks(10);
    yScale.domain([popMax, 0]);

   const circles = svg
      .selectAll("circle")
      .data(newData, (d) => d.song)
      .join("circle");

    circles
      .enter()
      .append("circle")
      .attr("class", "circle")
      .attr("stroke-width", 1.5)
      .merge(circles)
      .attr("cx", (d) => xScale(d.duration / 60000))
      .attr("cy", (d) => yScale(d.popularity))
      .attr("r", 4);


    //update tooltip
    svg
      .selectAll("circle")
      .attr("fill", function(d){return colorScale(d.artist)})
      .on("mouseover", function (event, d) {
        const [x, y] = d3.pointer(event, d);
        tooltip
          .style("display", "block")
          .style("font-size", "13px")
          .style("position", "fixed")
          .style("background-color", "white")
          .style("color", "#6d8cd4")
          .style("font-family", "Optima, sans-serif")
          .html(d.title + " by " + d.artist);
      })
      .on("mouseout", (event, d, i) => tooltip.text(""));

    //update axes
    const xAxis = d3.axisBottom(xScale);

    const yAxis = d3.axisLeft(yScale);

    svg.select(".x-axis").call(xAxis);

    svg.select(".y-axis").call(yAxis);

    //y-axis title

    svg.select(".y-axis-title").html("Popularity (out of 100)");

    svg.select(".x-axis-title").html("Duration (in minutes)");

    circles.exit().remove();
  }

  return {
    update, // ES6 shorthand for "update": update
  };
}