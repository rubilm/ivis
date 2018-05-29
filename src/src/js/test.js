function load_barchart(year) {
    // create canvas
    const canvHeight = 520;
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

    const tooltip = d3.select("body").append("div").attr("class", "toolTip");

    // load the data from the cleaned csv file. 
    d3.csv("data/" + year + ".csv", function (error, data) {

        // set the ranges
        const y = d3.scaleBand()
            .range([height, 0])
            .padding(0.1);

        const x = d3.scaleLinear()
            .range([0, width]);


        // declare the unfall as number
        data.forEach(function (d) {
            d.Value = + round(d.Unfall / d.anzahl_Fahrzeuge);
        });

        //sorting based on Unfall amount
        data.sort(function (a, b) {
            return a.Value - b.Value;
        });

        // scale x to max Unfall
        x.domain([0, d3.max(data, function (d) {
            return d.Value;
        })]);

        //scale y to Kanton name
        y.domain(data.map(function (d) {
            return d.Kanton;
        }));

        // append rectangles
        svg_barchart.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("width", function (d) {
                return x(d.Value);
            })
            .transition()
            .delay(function (d, i) {
                return i * 80;
            })
            .attr("y", function (d) {
                return y(d.Kanton);
            })
            .attr("height", y.bandwidth());

        svg_barchart.selectAll(".bar")
            .on("mouseover", function (d) {
                tooltip
                    .style("left", d3.event.pageX + "px")
                    .style("top", d3.event.pageY - 70 + "px")
                    .style("display", "inline-block")
                    .html(d.Kanton + ", " + d.Value + " accidents per vehicle");
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

        svg_barchart.selectAll(".bar").on("click", function (d) {
            loadDonut(d.Fatal, d.Injured, d.heavy_Injured, d.Kanton, year, d.Unfall);
        });
    });
}