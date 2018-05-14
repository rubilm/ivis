const width_d = 960 - margin.left - margin.right;
const height_d = 500 - margin.top - margin.bottom;

const radius = Math.min(width_d, height_d) / 2;

const color = d3.scaleOrdinal()
    .range(["#0097A7", "#00796B", "#388E3C"]);

const arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 90);

let pie = d3.pie()
    .sort(null)
    .value(function (d) {
        return d.percent;
    });

let svg_donut = d3.select("#donut")
    .attr("width", width_d)
    .attr("height", height_d)
    .append("g")
    .attr("transform", "translate(" + width_d / 2 + "," + height_d / 2 + ")");

d3.csv("data/donut.csv", type, function (error, data) {
    if (error) throw error;

    let g = svg_donut.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function (d) {
            return color(d.data.art);
        });

    g.append("text")
        .attr("transform", function (d) {
            return "translate(" + arc.centroid(d) + ")";
        })
        .attr("dy", ".35em")
        .text(function (d) {
            return d.data.art;
        });
});

function type(d) {
    d.percent = +d.percent;
    return d;
}
