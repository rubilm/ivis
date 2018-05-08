// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set the ranges
var y = d3.scaleBand()
          .range([height, 0])
          .padding(0.1);

var x = d3.scaleLinear()
          .range([0, width]);
          
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");



d3.csv("data/total.csv", function(error, data) {

  // format the data
  data.forEach(function(d) {
    d.Unfall = +d.Unfall;
  });

  data.sort(function(a, b) { return a.Unfall - b.Unfall; });

  // Scale the range of the data in the domains
  x.domain([0, d3.max(data, function(d){ return d.Unfall; })])
  y.domain(data.map(function(d) { return d.Kanton; }));
  //y.domain([0, d3.max(data, function(d) { return d.sales; })]);

  // append the rectangles for the bar chart
  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      //.attr("x", function(d) { return x(d.sales); })
      .attr("width", function(d) {return x(d.Unfall); } )
      .transition()
			.duration(200)
			.delay(function (d, i) {
				return i * 50;
			})
      .attr("y", function(d) { return y(d.Kanton); })
      .attr("height", y.bandwidth());

  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));
});