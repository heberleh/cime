var d3 = require('d3')
import * as React from 'react'

function intToComponents(colorBeginner) {
    var compBeginner = {
      r: (colorBeginner & 0xff0000) >> 16,
      g: (colorBeginner & 0x00ff00) >> 8,
      b: (colorBeginner & 0x0000ff)
    };

    return compBeginner
}

var interpolator = d3.interpolateRgb("rgb(255, 255, 255)", "rgb(150,150,255)")
var max = 20;

function interpolate(value) {
  return interpolator(Math.min(1.0, value))
}

function aggregateNeural(vectors, aggregation) {
  var vector = null
  if (vectors.length != 1 && aggregation) {
    return "<h5>Not applicable</h5>"
  } else if (vectors.length != 1 && !aggregation) {
    vector = { }
    for (var y = 0; y < 9; y++) {
      for (var x = 0; x < 9; x++) {
        vector[`cf${y}${x}`] = ""
      }
    }
  } else {
    vector = vectors[0]
  }


  var container = d3.create('div')
  var table = container.append('table')
  .attr("class", "neural")

  for (var y = 0; y < 9; y++) {
    var row = table.append('tr')
    for (var x = 0; x < 9; x++) {
      if (x != y) {
        row.append('td')
        .attr("class", "neuralcell")
        .style("background-color", interpolate(vector[`cf${y}${x}`] / max))
        .text(vector[`cf${y}${x}`])
      } else {
        row.append('td')
        .attr("class", "neuralcell")
        .style("background-color", "transparent")
      }
    }
  }

  var content = container.html()

  var svg = `<svg width="260" height="240" viewBox="0 0 260 240">
  <rect x="20", y="20" width="182" height="182" fill="transparent" stroke="black" stroke-width="1"></rect>

  <g font-size="10" style="text-anchor: middle">
    <text x="10" y="30">1</text>
    <text x="10" y="50">2</text>
    <text x="10" y="70">3</text>
    <text x="10" y="90">4</text>
    <text x="10" y="110">5</text>
    <text x="10" y="130">6</text>
    <text x="10" y="150">7</text>
    <text x="10" y="170">8</text>
    <text x="10" y="190">9</text>
  </g>

  <g font-size="10" style="text-anchor: middle">
    <text x="30" y="218">1</text>
    <text x="50" y="218">2</text>
    <text x="70" y="218">3</text>
    <text x="90" y="218">4</text>
    <text x="110" y="218">5</text>
    <text x="130" y="218">6</text>
    <text x="150" y="218">7</text>
    <text x="170" y="218">8</text>
    <text x="190" y="218">9</text>
  </g>

  <g font-size="10" style="text-anchor: left">
    <text x="232" y="23">50+</text>
    <text x="232" y="205">0</text>
  </g>

  <line x1="222" y1="20" x2="227" y2="20" style="stroke:black;stroke-width:1" />
  <line x1="222" y1="202" x2="227" y2="202" style="stroke:black;stroke-width:1" />

  <defs>
    <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(150,150,255);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(255,255,255);stop-opacity:1" />
    </linearGradient>
  </defs>

  <rect x="212" y="20" width="10" height="182" stroke="black" stroke-width="1" fill="url(#grad2)" />

  <foreignObject x="21" y="21" width="180" height="180">

  ${content}

  </foreignObject>

</svg>`




  return svg
}







function neuralLegend(color) {
  var content = ""
  for (var key in color) {
    var comp = intToComponents(color[key].color)

    content = content +
    `<div class="d-flex" style="width: 100%; height: 1rem">
      <small class="small flex-shrink-0" style="width: 2.5rem">${color[key].learningRate == "undefined" ? '-' : color[key].learningRate}</small>
      <div class="flex-grow-1" style="background-image: linear-gradient(to right, rgba(${comp.r}, ${comp.g}, ${comp.b}, 0.2), rgba(${comp.r}, ${comp.g}, ${comp.b},1))"></div>
     </div>`
  }


  var template = `
    <div>
      <div>
        <img src="./textures/sprites/cross.png" style="width:1rem;height:1rem; vertical-align: middle"></img>
        <span style="vertical-align: middle">Starting point</span><br>
      </div>

      <div>
        <img src="./textures/sprites/circle.png" style="width:1rem;height:1rem; vertical-align: middle"></img>
        <span style="vertical-align: middle">Intermediate </span><a href="#" onclick="window.showIntermediatePoints()">toggle</a><br>
      </div>

      <div>
        <img src="./textures/sprites/star.png" style="width:1rem;height:1rem; vertical-align: middle"></img>
        <span style="vertical-align: middle">Solution</span><br>
      </div>



      <hr />

      <h6 class="text-center">Learning Rate</h6>

      ${content}

      <div class="d-flex justify-content-between">
            <div style='margin-left: 2.5rem'>
               early
            </div>
            <div>
               late
            </div>
       </div>

    </div>`

  return template
}




export var NeuralLegend = ({ selection, aggregate }) => {
    return <div dangerouslySetInnerHTML={{ __html: aggregateNeural(selection, aggregate) }}></div>
}