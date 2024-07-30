
import * as d3 from "https://unpkg.com/d3?module";
export default function tempoBarChart(container) {
  d3.select(".chart").append("svg");

const margin = { top: 60, right: 60, bottom: 60, left: 80 };
const width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

const svg = d3
  .select(".bar-chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let xScale = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1); //don't need ranges?

let yScale = d3.scaleLinear().range([height, 0]);

  const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

let x_axis = svg
  .append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(0, ${height})`);

let y_axis = svg.append("g").attr("class", "y-axis");

  var tooltip = svg
    .append("text")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "3px")
    .style("border-radius", "8px")
    .style("padding", "15px");
  
  var mouseleave = function (d) {
    tooltip.transition().duration(200).style("opacity", 0);
  };
  
  
  //xlabel

  let xLabel = svg
    .append("text")
    .attr("class", "x-axis-title")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + 26)
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




function update(data, artistArray) { 
  /*console.log("artistArray in tempochart", artistArray);
  
  
  let current_artists = data.map(d=> d.artist)
    let filter = []
    let newData = []
    
    for (let i = 0; i < artistArray.length; i++) {
        filter = data.filter(d=> d.artist === artistArray[i])
        for (let j = 0; j < filter.length; j++) {
          newData.push(filter[j])
        }
        //NEW DATA IS newData, figure it out
    }*/
  let xdata = data
  let passedArray = artistArray;//["Ariana Grande", "David Guetta", "Bruno Mars", "Calvin Harris"];
  let tempoArray = [];

  

  
  for (let i = 0; i < passedArray.length; i++){
      let averageTempo = 0
      data = data.filter((d) => d.artist === passedArray[i])

      for (let b = 0; b < data.length; b++){
        averageTempo = averageTempo + d3.max(data, (d) => d.tempo)

      }
      averageTempo = averageTempo/data.length
      tempoArray[i]=averageTempo
      data = xdata
  }
  
  console.log("passedArray", artistArray)

 let obj = [{
    "artist": passedArray[0],
    "tempo": tempoArray[0],
  },
{
    "artist": passedArray[1],
    "tempo": tempoArray[1],
  },
  {
    "artist": passedArray[2],
    "tempo": tempoArray[2],
  },
  {
    "artist": passedArray[3],
    "tempo": tempoArray[3],
  },
  {
    "artist": passedArray[4],
    "tempo": tempoArray[4],
  }
]
  
 
  xScale.domain(obj.map((o) => o.artist));

  yScale.domain([0, d3.max(obj, (o) => o.tempo)]);
  
  let temp_array = []
    for (let i = 0; i < passedArray.length; i++) {
      temp_array.push(obj[i].artist)
    }
    let color_domain = []
    color_domain.push(temp_array[0])
   for (let i = 0; i < temp_array.length - 1; i++) {
      if (temp_array[i]!= temp_array[i+1])
        {
          color_domain.push(temp_array[i+1])
        }
    }
    
   colorScale.domain(color_domain);
  

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg.select(".x-axis").call(xAxis)
  
    .selectAll("text")
        .style("text-anchor", "end")
        .style("font-family", "Optima, sans-serif")
        .style("font-size", "8px")
        .attr("dx", "-.85em")
        .attr("dy", "-.85em")
        .attr("transform", function (d) {
        return "rotate(-50)";
    })
  
  const bars = svg
    .selectAll(".bar")
    .data(obj, (o) => o.artist);

  
  svg.select(".y-axis").call(yAxis);

  //svg.select(".y-axis-title").text("tempo");

  bars
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("width", xScale.bandwidth())
    .attr("x", (o) => xScale(o.artist))
    .attr("y", height)
    .attr("fill", function(d){return colorScale(d.artist)})
    .merge(bars)
    .transition()
    .duration(1000)
    .attr("height", function (o, i) {
      return height - yScale([[o.tempo]]);
    })
    .attr("width", xScale.bandwidth())
    .attr("x", (o) => xScale(o.artist))
    .attr("y", (o) => yScale(o.tempo))
    //.attr("fill", "#CBC3E3")
    
    bars.exit().remove();
  
  svg
      .selectAll("rect")
      //.attr("fill", "#CBC3E3")
      .on("mouseover", function (event, d) {
        const [x, y] = d3.pointer(event, d);
        tooltip
          .style("display", "block")
          .style("position", "fixed")
          .style("font-size", "13px")
          .style("background-color", "white")
         // .style("size",  1)
         // .style("stroke", "#D3D3D3")
          .style("color", "#6d8cd4")
          .style("font-family", "Optima, sans-serif")
          .html(d.artist + " : " + (d.tempo).toFixed(3));
      })
      .on("mouseout", (event, d, i) => tooltip.text(""));
  
  /*let titles = svg
    .selectAll(".text").data(data).enter().append("text")
        .text(d => d.title)
        .style("font-family", "Optima, sans-serif")
        .style("font-size", "8px")
        .attr("x", (d) => yScale(d.title))
        .attr("y", (d) => xScale(d.title))
        //.style("text-anchor", "start")
        .attr("transform", function (d) {
        return "rotate(-90)"})*/
    
    /*.on("mouseover", function (event, d) {
      

    
    const [x, y] = d3.pointer(event, d);
      d3.select(".tooltip") 
        .style("left", x + 5 + "px")
        .style("top", y + 20 + "px")
        .style("display", "block")
        .style("position", "fixed")
        .style("background-color", "white")
        .style("stroke", "#D3D3D3")
        .style("color", "#6d8cd4")
        .style("font-family", "Optima, sans-serif")
        .html(
            "Artist: " + d.artist + "<br>" +
            "Average Tempo: " + d.tempo + "<br>")
    .on("mouseleave", function (event, d) {
      d3.select(".tooltip").style("display", "none");
    })*/
  
    svg.select(".y-axis-title").html("Average Tempo (bpm)");

    svg.select(".x-axis-title").html("Artist");


 
}
  return {
    update, 
  };

}
