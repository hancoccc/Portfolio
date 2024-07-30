import * as d3 from "https://unpkg.com/d3?module";

import lineChart from "./lineChart.js";
import scatterPlot from "./scatterPlot.js";
import tempoBarChart from "./tempoBarChart.js";

let genre = document.getElementById("group-by").value;
console.log("genre",genre);
let artistArray = [];
let dancePop, rap, indie;
const artistBarChart1 = artistBarChart(".chart-container1");
const lineChart1 = lineChart(".chart-container2");
const scatterPlot1 = scatterPlot(".chart-container3");
const tempoBarChart1 = tempoBarChart(".chart-container4");

function artistBarChart(container) {
  // initialization
  const margin = { top: 80, right: 80, bottom: 80, left: 160 };
  const width = 1400 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  const svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //Create scales without domains
  const xScale = d3.scaleBand().range([0, width]).padding(0.1);
  const yScale = d3.scaleLinear().range([height, 0]);

  const brushScale = d3.scaleTime().range([0, width]);

  //Create axes and axis title containers
  svg.append("g").attr("class", "y axis");

  svg.append("g").attr("class", "x axis");

  let xAxis = d3.axisBottom().scale(xScale);

  let yAxis = d3.axisLeft().scale(yScale);

  let y_label = svg
    .append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("x", 1)
    .attr("y", -20)
    .attr("font-size", "11px")
    .style("font-family", "Optima, sans-serif");

  const listeners = { selected: null };

  function selected(event) {
    if (event.selection) {
      let selection = event.selection.map(xScale.invert);
      listeners["selected"](selection);
    }
  }

  const path = svg.append("path").attr("class", "area").attr("fill", "#9779bd");

  var mytooltip = d3
    .select(".tooltip")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 1)
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "3px")
    .style("border-radius", "8px")
    .style("padding", "13px");

  var mouseleave = function (d) {
    mytooltip.transition().duration(200).style("opacity", 0);
  };
  
  //tooltip
  var tooltip = svg
    .append("text")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "3px")
    .style("border-radius", "8px")
    .style("padding", "15px");
  
  function update(data, genre) {
    let current_genres = data.map((e) => e.genres);
    let current_artists = [];

    for (let i = 0; i < data.length; i++) {
      if (current_genres[i].includes(genre)) {
        current_artists.push(data[i]);
      }
    }

    // update domains
    xScale.domain(current_artists.map((d) => d.artist));
    yScale.domain([0, d3.max(current_artists.map((d) => d.followers))]);

    const bars = svg.selectAll("rect").data(current_artists);

    bars
      .enter()
      .append("rect")
      .attr("class", "bars")
      .attr("fill", "#CBC3E3")
      .on("mouseover", function (event, d) {
        const [x, y] = d3.pointer(event, d);
        tooltip
          .style("display", "block")
          .style("position", "fixed")
          .style("background-color", "white")
          .style("color", "#6d8cd4")
          .style("font-family", "Optima, sans-serif")
          .html(d.artist + ", " + d.followers.toLocaleString() + " followers");
      })
      .on("mouseout", (event, d, i) => tooltip.text(""))
      .on("click", function (event, d) {
        let artist = d.artist;
        if (artistArray.length < 5) {
          if (artistArray.includes(artist)) {
            artistArray = artistArray.filter((e) => e !== artist);
            d3.select(this).style("fill", "#CBC3E3");
            if (genre === "dance pop") {
              lineChart1.update(dancePop, artistArray);
              scatterPlot1.update(dancePop, artistArray);
              tempoBarChart1.update(dancePop, artistArray);
            } 
            else if (genre === "rap") {
              lineChart1.update(rap, artistArray);
              scatterPlot1.update(rap, artistArray);
              tempoBarChart1.update(rap, artistArray);
            } else if (genre === "indie") {
              lineChart1.update(indie, artistArray);
              scatterPlot1.update(indie, artistArray);
              tempoBarChart1.update(indie, artistArray);
            }
            console.log(artistArray)
          } else {
            artistArray.push(artist);
            d3.select(this).style("fill", "#7a52aa");

            if (genre === "dance pop") {
              lineChart1.update(dancePop, artistArray);
              scatterPlot1.update(dancePop, artistArray);
              tempoBarChart1.update(dancePop, artistArray);
            } else if (genre === "rap") {
              lineChart1.update(rap, artistArray);
              scatterPlot1.update(rap, artistArray);
              tempoBarChart1.update(rap, artistArray);
            } else if (genre === "indie") {
              lineChart1.update(indie, artistArray);
              scatterPlot1.update(indie, artistArray);
              tempoBarChart1.update(indie, artistArray);
            }
            return artistArray;
          }
        }

        if (artistArray.includes(artist)) {
          artistArray = artistArray.filter((e) => e !== artist);
          d3.select(this).style("fill", "#CBC3E3");
          console.log(artistArray)
          if (genre === "dance pop") {
              lineChart1.update(dancePop, artistArray);
              scatterPlot1.update(dancePop, artistArray);
              tempoBarChart1.update(dancePop, artistArray);
            } else if (genre === "rap") {
              lineChart1.update(rap, artistArray);
              scatterPlot1.update(rap, artistArray);
              tempoBarChart1.update(rap, artistArray);
            } else if (genre === "indie") {
              lineChart1.update(indie, artistArray);
              scatterPlot1.update(indie, artistArray);
              tempoBarChart1.update(indie, artistArray);
            }
        }

        if (artistArray.length === 5) {
          return artistArray;
        }
      });

    bars.exit().remove();

    bars.on("click", function (event, d) {
      let artist = d.artist;
      if (artistArray.length < 5) {
        if (artistArray.includes(artist)) {
          artistArray = artistArray.filter((e) => e !== artist);
          d3.select(this).style("fill", "#CBC3E3");
          if (genre === "dance pop") {
            lineChart1.update(dancePop, artistArray);
            scatterPlot1.update(dancePop, artistArray);
            tempoBarChart1.update(dancePop, artistArray);
          } else if (genre === "rap") {
            lineChart1.update(rap, artistArray);
            scatterPlot1.update(rap, artistArray);
            tempoBarChart1.update(rap, artistArray);
          }
           else if (genre === "indie") {
              lineChart1.update(indie, artistArray);
              scatterPlot1.update(indie, artistArray);
              tempoBarChart1.update(indie, artistArray);
            }
        } else {
          artistArray.push(artist);
          d3.select(this).style("fill", "#7a52aa");
          if (genre === "dance pop") {
            lineChart1.update(dancePop, artistArray);
            scatterPlot1.update(dancePop, artistArray);
            tempoBarChart1.update(dancePop, artistArray);
          } else if (genre === "rap") {
            lineChart1.update(rap, artistArray);
            scatterPlot1.update(rap, artistArray);
            tempoBarChart1.update(rap, artistArray);
          }
           else if (genre === "indie") {
              lineChart1.update(indie, artistArray);
              scatterPlot1.update(indie, artistArray);
              tempoBarChart1.update(indie, artistArray);
            }
          return artistArray;
        }
      }

      if (artistArray.includes(artist)) {
        artistArray = artistArray.filter((e) => e !== artist);
        d3.select(this).style("fill", "#CBC3E3");
        if (genre === "dance pop") {
            lineChart1.update(dancePop, artistArray);
            scatterPlot1.update(dancePop, artistArray);
            tempoBarChart1.update(dancePop, artistArray);
          } else if (genre === "rap") {
            lineChart1.update(rap, artistArray);
            scatterPlot1.update(rap, artistArray);
            tempoBarChart1.update(rap, artistArray);
          }
           else if (genre === "indie") {
              lineChart1.update(indie, artistArray);
              scatterPlot1.update(indie, artistArray);
              tempoBarChart1.update(indie, artistArray);
            }
        return artistArray;
      }

      if (artistArray.length === 5) {
        return artistArray;
      }
    });

    //Update bars
    svg
      .selectAll("rect")
      .transition()
      .duration(1000)
      .attr("x", function (d, i) {
        return xScale(d.artist);
      })
      .attr("y", function (d) {
        return yScale(d.followers);
      })
      .attr("height", function (d) {
        return height - yScale(d.followers);
      })
      .attr("width", xScale.bandwidth())
      .style("fill", "#CBC3E3");

    //Update y-axis
    svg.select(".y.axis").transition().duration(1000).call(yAxis);

    svg
      .select(".x.axis")
      .transition()
      .duration(1000)
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .style("font-family", "Optima, sans-serif")
      .style("font-size", "8px")
      .attr("dx", "-.8em")
      .attr("dy", "-.95em")
      .attr("transform", function (d) {
        return "rotate(-90)";
      });

    y_label.text("Monthly Listeners");
  }

  return {
    update,
  };
}

Promise.all([
  d3.csv("./data/spotify_daily_charts_artists.csv", d3.autoType),
  d3.csv("./data/dance pop_playlist_tracks_data.csv", d3.autoType),
  d3.csv("./data/rap_playlist_tracks_data.csv", d3.autoType),
  d3.csv("./data/indie_playlist_tracks_data.csv", d3.autoType),
]).then((data) => {
  let topArtists = data[0];
  dancePop = data[1];
  rap = data[2];
  indie = data[3];
  d3.select("select").on("change", change);
  function change() {
    genre = this.options[this.selectedIndex].value;
    artistArray = [];
    if (genre === "dance pop") {
      artistBarChart1.update(topArtists, genre);
    } else if (genre === "rap") {
      artistBarChart1.update(topArtists, genre);
    } else if (genre === "indie") {
      artistBarChart1.update(topArtists, genre);
    }
  }
  artistBarChart1.update(topArtists, genre);
});
