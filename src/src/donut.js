
var width = 960,
height = 500,
radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
.range(["#FFDF26", "#FF9933", "#FF1E16"]);

var arc = d3.svg.arc()
.outerRadius(radius - 10)
.innerRadius(radius - 90);

var pie = d3.layout.pie()
.sort(null)
.value(function(d) { return d.percent; });

var svg = d3.select("body").append("svg")
.attr("width", width)
.attr("height", height)
.append("g")
.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

d3.csv("data/donut.csv", type, function(error, data) {
if (error) throw error;

var g = svg.selectAll(".arc")
  .data(pie(data))
.enter().append("g")
  .attr("class", "arc");

g.append("path")
  .attr("d", arc)
  .style("fill", function(d) { return color(d.data.art); })

g.append("text")
  .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
  .attr("dy", ".35em")
  .text(function(d) { return d.data.art; });
});

function type(d) {
d.percent = +d.percent;
return d;
}
