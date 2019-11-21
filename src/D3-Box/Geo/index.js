import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

function GeoChart() {

  useEffect(() => {
    const width = 600;
    const height = 500;
    let svg = d3
      .select("#geo")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(0,0)");

      let projection = d3
        .geoMercator()
        .center([104, 38])
        .scale(500)
        .translate([width / 2, height / 2]);
      let path = d3.geoPath().projection(projection);
      d3.json("china.json").then(geojson => {
        svg
          .append("path")
          .attr("d", path(geojson))
          .attr("fill", "grey")
          .attr("stroke", "DarkGrey")
          .attr("stroke-width", 1);
      });

      // d3.json("data.json").then(geojson => {
      //   console.log("data",geojson)
      // });
    //   d3.text("./china.json")        // convert to plain text
    //   .then(text => console.log(">>>>>>>",text))
    // return () => { };
  }, []);

  return (
    <div style={{ height: '100%' }}>
      {/* <div id={`line-tooltip${data.name}`} /> */}
      <svg id={`geo`} width="100%" height="100%" />
    </div>
  );
}

export default GeoChart;
