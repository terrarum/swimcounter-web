require('./main.scss');

import PubSubJS from 'pubsub-js';
import * as d3 from 'd3';
console.log(d3);
let data;

let graphsElement = document.querySelector('.js-graphs');

function loadJSON(filename, callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', `/dist/data/${filename}`, true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

// Render an axis of the accelerometer data.
const renderAxis = function renderAxis(swimData, axis) {
  const WIDTH = 1000;
  const HEIGHT  = 300;

  const mAxis = `m${axis.toUpperCase()}`;

  const graphContainer = document.createElement('div');
  document.body.appendChild(graphContainer);

  // Set up chart area.
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = WIDTH - margin.left - margin.right,
    height = HEIGHT - margin.top - margin.bottom;

  var plotChart = d3.select(graphContainer).classed('chart', true).append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var plotArea = plotChart.append('g')
    .attr('clip-path', 'url(#plotAreaClip)');

  plotArea.append('clipPath')
    .attr('id', 'plotAreaClip')
    .append('rect')
    .attr({ width: width, height: height });

  // Set up X and Y scales.
  var xScale = d3.scaleLinear()
      .domain(d3.extent(swimData, function(d) { return d.mTimestamp})).nice()
      .range([0, width]);

  var yScale = d3.scaleLinear()
      .domain([-4000, 4000]).nice()
      // .domain(d3.extent(swimData, function(d) {return d[mAxis]})).nice()
      .range([height, 0]);

  // Set up and draw X and Y axes.
  var xAxis = d3.axisBottom()
      .scale(xScale)
      .ticks(5);

  var yAxis = d3.axisLeft()
      .scale(yScale);

  plotChart.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

  plotChart.append('g')
    .attr('class', 'y axis')
    .call(yAxis);

  // Render line.
  var line = d3.line()
    .x(function(d) { return xScale(d.mTimestamp); })
    .y(function(d) { return yScale(d[mAxis]); });

  // Apply and render data.
  plotChart.append("path")
    .datum(swimData)
    .attr("class", "line")
    .attr("d", line);
};

// Render a swimming session.
const renderSession = function renderSession(session) {
  console.log(session);
  const swimData = session.swimData;

  renderAxis(swimData, 'x');
  renderAxis(swimData, 'y');
  renderAxis(swimData, 'z');
};

// Load swim data.
loadJSON('2016-07-13-08_54_07.923-swimsessions.json', (response) => {
  data = JSON.parse(response);
  const sessions = data.sessions;

  for (const sessionId in sessions) {
    const session = sessions[sessionId];
    renderSession(session);
  }
});

const init = function init() {

};

init();