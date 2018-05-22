load_barchart("2013");
$('.donut-chart-background').hide();

$('#select-year').change(function () {
    d3.select("g").remove();
    load_barchart($(this).val());
    $('.donut-chart-background').hide();
})

function load_barchart(year) {
    // create canvas
    const canvHeight = 680;
    const canvWidth = 960;

    // calc the width and height depending on margins.
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = canvWidth - margin.left - margin.right;
    const height = canvHeight - margin.top - margin.bottom;

    // create svg for barchart
    let svg_barchart = d3.select("#barchart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // set the ranges
    const y = d3.scaleBand()
        .range([height, 0])
        .padding(0.1);

    const x = d3.scaleLinear()
        .range([0, width]);

    var tooltip = d3.select("body").append("div").attr("class", "toolTip");


    // load the data from the cleaned csv file. 
    d3.csv("data/" + year + ".csv", function (error, data) {

        // set the ranges
        const y = d3.scaleBand()
            .range([height, 0])
            .padding(0.1);

        const x = d3.scaleLinear()
            .range([0, width]);


        // format the data
        data.forEach(function (d) {
            d.Unfall = +d.Unfall;
        });

        data.sort(function (a, b) {
            return a.Unfall - b.Unfall;
        });

        // Scale the range of the data in the domains
        x.domain([0, d3.max(data, function (d) {
            return d.Unfall;
        })]);

        y.domain(data.map(function (d) {
            return d.Kanton;
        }));

        // append rectangles
        svg_barchart.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("width", function (d) {
                return x(d.Unfall);
            })
            .transition()
            .duration(200)
            .delay(function (d, i) {
                return i * 50;
            })
            .attr("y", function (d) {
                return y(d.Kanton);
            })
            .attr("height", y.bandwidth());

        svg_barchart.selectAll(".bar").on("mouseout", function () {
            console.log("UNhover the bar");
        });

        svg_barchart.selectAll(".bar")
            .on("mouseover", function (d) {
                tooltip
                    .style("left", d3.event.pageX + "px")
                    .style("top", d3.event.pageY - 70 + "px")
                    .style("display", "inline-block")
                    .html("Kanton " + d.Kanton  + ", " + d.Unfall + " Unfälle");
            })
            .on("mouseout", function (d) { tooltip.style("display", "none") });

        svg_barchart.selectAll(".bar").on("click", function (d) {
            loadDonut(d.Fatal, d.Injured, d.heavy_Injured);
        });

        // text label for the x axis
        svg_barchart.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // text label for the y axis
        svg_barchart.append("g")
            .call(d3.axisLeft(y));
    });
}

function loadDonut(fatal, injured, heavy_Injured) {
    $('.donut-chart-background').show();
    const data = [
        { name: "Fatal", value: fatal },
        { name: "Injured", value: injured },
        { name: "Heavy Injured", value: heavy_Injured }
    ];
    let text = "";

    const width = 460;
    const height = 300;
    const thickness = 40;
    const duration = 750;

    const radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    let svg_donut = d3.select("#donut")
        .attr('class', 'pie')
        .attr('width', width)
        .attr('height', height);

    let g = svg_donut.append('g')
        .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

    let arc = d3.arc()
        .innerRadius(radius - thickness)
        .outerRadius(radius);

    let pie = d3.pie()
        .value(function (d) { return d.value; })
        .sort(null);

    let path = g.selectAll('path')
        .data(pie(data))
        .enter()
        .append("g")
        .on("mouseover", function (d) {
            let g = d3.select(this)
                .style("cursor", "pointer")
                .style("fill", "black")
                .append("g")
                .attr("class", "text-group");

            g.append("text")
                .attr("class", "name-text")
                .text(`${d.data.name}`)
                .attr('text-anchor', 'middle')
                .attr('dy', '-1.2em');

            g.append("text")
                .attr("class", "value-text")
                .text(`${d.data.value}`)
                .attr('text-anchor', 'middle')
                .attr('dy', '.6em');
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style("cursor", "none")
                .style("fill", color(this._current))
                .select(".text-group").remove();
        })
        .append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => color(i))
        .on("mouseover", function (d) {
            d3.select(this)
                .style("cursor", "pointer");
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style("cursor", "none")
                .style("fill", color(this._current));
        })
        .each(function (d, i) { this._current = i; });

    g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em')
        .text(text);

    $("#injured-label").text(injured + " Injured");
    $("#heavy-injured-label").text(heavy_Injured + " Heavy Injured");
    $("#fatal-label").text(fatal + " Fatal");
    $("html, body").animate({ scrollTop: document.body.scrollHeight }, "slow");
}