import * as d3 from "https://unpkg.com/d3?module";


// input: selector for a chart container e.g., ".chart"
export default function lineChart(container) {
  // initialization
  const margin = { top: 60, right: 60, bottom: 60, left: 80 };
  const width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  const svg = d3
    .select(".lineChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //axis initilization
  //x-axis will be scaleTime
  //y-axis will be scaleLinear
  const xAxisGraph = svg.append("g").attr("class", "axis x-axis");

  const yAxisGraph = svg.append("g").attr("class", "axis y-axis");

  const xScale = d3.scaleTime().range([0, width]); // scale

  const xAxis = d3.axisBottom().scale(xScale);

  //y-axis initialization
  const yScale = d3.scaleLinear().range([height, 0]); // scale

  const yAxis = d3.axisLeft().scale(yScale);

  //labels

  //xlabel

  let xLabel = svg
    .append("text")
    .attr("class", "x-axis-title")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .attr("font-size", "11px");

  //ylabel
  let yLabel = svg
    .append("text")
    .attr("class", "y-axis-title")
    .attr("text-anchor", "right")
    .attr("x", 1)
    .attr("y", -15)
    .attr("font-size", "11px")
    .style("font-family", "Optima, sans-serif");

  //tooltip
  var tooltip = svg
    .append("text")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "3px")
    .style("border-radius", "8px")
    .style("padding", "15px");

  const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

  /*quickly thinking through this
  since the line chart is based off the data displayed by the genre chart, 
  we might need to call a different d3.csv from the genre chart
  this can probably be done by setting the genre to a type, based on the genre, since all the song data is in seperate genre
  datasets
  this could also be difficult when looking at songs*/
  let path = svg.append("path");
  function update(data, artistArray) {
    console.log("artistArray in linchart", artistArray);

    let current_artists = data.map((d) => d.artist);

    let filter = [];
    let newData = [];

    for (let i = 0; i < artistArray.length; i++) {
      filter = data.filter((d) => d.artist === artistArray[i]);
      for (let j = 0; j < filter.length; j++) {
        newData.push(filter[j]);
      }
    }

    console.log("NEW DATA IN LINE CHART", newData);

    let temp_array = [];
    for (let i = 0; i < newData.length; i++) {
      temp_array.push(newData[i].artist);
    }
    let color_domain = [];
    color_domain.push(temp_array[0]);
    for (let i = 1; i < temp_array.length - 1; i++) {
      if (temp_array[i] != temp_array[i + 1]) {
        color_domain.push(temp_array[i + 1]);
      }
    }

    colorScale.domain(color_domain);

    //data = data.filter(d => d.artist === "Ariana Grande")
    newData = newData.sort(function (a, b) {
      return new Date(a.date) - new Date(b.date);
    });
    
  
    /* console.log("Bruno Data",data);*/
    xScale.domain(d3.extent(newData, (d) => new Date(d.date)));
    
    let max = d3.max(newData, (d) => d.danceability);

    yScale.domain([0, 1]);

    // update scales, encodings, axes

    xAxisGraph.attr("transform", `translate(0, ${height})`).call(xAxis.ticks(5));

    yAxisGraph.attr("transform", `translate(${width}), 0`).call(yAxis.ticks(10));

    let nestedData = d3.group(newData, (d) => d.artist);
    console.log("nested data", nestedData);
    console.log(nestedData.get("Bruno Mars"));

    // d3.select("svg")
    // .selectAll(".line")
    // .append("g")
    // .attr("class", "line")
    // .data(nestedData)
    // .enter()
    // .append("path")
    // .attr("d", d=>d3.line()
    //         .x(d => xScale(new Date(d.values.date)))
    //         .y(d => yScale(d.danceability))(d.values)
    // )
    // .attr("fill", "none")
    // .attr("stroke-width", 2)
    for (let i = 0; i < artistArray.length; i++) {
      console.log(nestedData.get(artistArray[i]));
    }

    for (let i = 0; i < artistArray.length; i++) {
      d3.select("svg")
        .selectAll(".line")
        .append("g")
        .attr("class", "line")
        .data(nestedData.get(artistArray[i]))
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 3)
        .attr("d", function (d) {
          return d3
            .line()
            .x(d => xScale(d.date))
            .y(d => yScale(d.danceability));
        });
    }

    //lines
    //     let line = d3.line()
    //     .x(d => xScale(new Date(d.date)))
    //     .y(d => yScale(d.danceability))

    //     path.selectAll("path").data(nestedData)
    //     .enter()
    //     .append("path")
    //     .attr("class", container )
    //     .attr("d", line)
    //     .attr("fill", "none")
    //     .attr("stroke", "black")

    //     path.exit().remove()

    //update circles
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
      .attr("cx", (d) => xScale(new Date(d.date)))
      .attr("cy", (d) => yScale(d.danceability))
      .attr("r", 3)
      .attr("fill", "#CBC3E3");

    circles
      .on("mouseover", function (event, d) {
        const [x, y] = d3.pointer(event, d);
        tooltip
          .style("display", "block")
          .style("position", "fixed")
          .style("font-size", "13px")
          .style("background-color", "white")
          .style("color", "#6d8cd4")
          .style("font-family", "Optima, sans-serif")
          .html(d.title + " by " + d.artist);
      })
      .on("mouseout", (event, d, i) => tooltip.text(""))
      .attr("fill", function (d) {
        return colorScale(d.artist);
      });

    circles.exit().remove();

    svg.select(".y-axis-title").html("Danceability");

    svg.select(".x-axis-title").html("Year Released");
  }

  return {
    update, // ES6 shorthand for "update": update
  };
}
