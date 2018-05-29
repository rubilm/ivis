load_barchart_vehicle("2013"); //load barchart with amout of vehicles
load_barchart("2013"); //load barchart with percentage of accidents
$('.donut-chart-background').hide(); //hide donut chart

/*
on change of the year dropdown load the both barchart
*/
$('#select-year').change(function () {
    d3.select("g").remove(); //remove drawed chart
    load_barchart($(this).val()); //load barchart with percentage of accidents
    d3.select("g").remove(); //remove the drawed chart
    load_barchart_vehicle($(this).val()); //load barchart with amount of vehicles
    $('.donut-chart-background').hide(); //hide donut chart
})

/*
load barchart with amount of vehicles
*/
function load_barchart_vehicle(year) {
    // create canvas
    const canvHeight = 520;
    const canvWidth = 580;

    // calc the width and height depending on margins.
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = canvWidth - margin.left - margin.right;
    const height = canvHeight - margin.top - margin.bottom;

    // create svg for barchart
    let svg_barchart = d3.select("#barchart_vehicles")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    //tooltip for barchart
    const tooltip = d3.select("body").append("div").attr("class", "toolTip");

    // load the data from the cleaned csv file based on the selected year 
    d3.csv("data/" + year + ".csv", function (error, data) {

        // set the ranges
        const y = d3.scaleBand()
            .range([height, 0])
            .padding(0.1);

        const x = d3.scaleLinear()
            .range([0, width]);


        // declare the unfall as number
        data.forEach(function (d) {
            d.anzahl_Fahrzeuge = + d.anzahl_Fahrzeuge;
        });

        //sorting based on Unfall amount
        data.sort(function (a, b) {
            return a.anzahl_Fahrzeuge - b.anzahl_Fahrzeuge;
        });

        // scale x to max Unfall
        x.domain([0, d3.max(data, function (d) {
            return d.anzahl_Fahrzeuge;
        })]);

        //scale y to Kanton name
        y.domain(data.map(function (d) {
            return d.Kanton;
        }));

        // append rectangles
        svg_barchart.selectAll(".bar_second")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar_second")
            .attr("width", function (d) {
                return x(d.anzahl_Fahrzeuge);
            })
            .transition()
            .delay(function (d, i) {
                return i * 80;
            })
            .attr("y", function (d) {
                return y(d.Kanton);
            })
            .attr("height", y.bandwidth());

        svg_barchart.selectAll(".bar_second")
            .on("mouseover", function (d) {
                tooltip
                    .style("left", d3.event.pageX + "px")
                    .style("top", d3.event.pageY - 70 + "px")
                    .style("display", "inline-block")
                    .html(d.Kanton + ", " + d.anzahl_Fahrzeuge + " registered vehicles");
            })
            .on("mouseout", function (d) { tooltip.style("display", "none") });
        // text label for the x axis
        svg_barchart.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // text label for the y axis
        svg_barchart.append("g")
            .call(d3.axisLeft(y));

        svg_barchart.selectAll(".bar_second").on("click", function (d) {
            loadDonut(d.Fatal, d.Injured, d.heavy_Injured, d.Kanton, year, d.Unfall);
        });
    });
}

/*
load barchart with percentages of accidents
*/
function load_barchart(year) {
    // create canvas
    const canvHeight = 520;
    const canvWidth = 580;

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
            d.Value = + round((d.Unfall / d.anzahl_Fahrzeuge) * 100);
        });

        //sorting based on Unfall amount
        data.sort(function (a, b) {
            return a.Value - b.Value;
        });


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
                    .html(d.Kanton + ", " + d.Value + "% possibility for an accident per vehicle");
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
            load_donut_chart(d.Fatal, d.Injured, d.heavy_Injured, d.Kanton, year, d.Unfall);
        });
    });
}

//Create Donut Chart 
function load_donut_chart(fatal, injured, heavy_Injured, canton, year, total) {
    $('.donut-chart-background').show();
    //set chart data and colors
    const data = [
        { name: "Fatal", value: fatal, color: "#FE7403" },
        { name: "Injured", value: injured, color: "#0D76AD" },
        { name: "Heavy Injured", value: heavy_Injured, color: "#0E9F3B" }
    ];

    //set properties
    const width = 800;
    const height = 300;
    const thickness = 40;

    const radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    //create donut
    let svg_donut = d3.select("#donut")
        .attr('class', 'pie')
        .attr('width', width)
        .attr('height', height);

    let g = svg_donut.append('g')
        .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

    // set arc radiuses
    let arc = d3.arc()
        .innerRadius(radius - thickness)
        .outerRadius(radius);

    // add pie chart
    let pie = d3.pie()
        .value(function (d) { return d.value; })
        .sort(null);

    let path = g.selectAll('path')
        .data(pie(data))
        .enter()
        .append("g")
        .append('path')
        .attr('d', arc)
        .attr('fill', function (d, i) { return d.data.color; })
        .each(function (d, i) { this._current = i; });

    // show explanation labels
    $("#injured-label").text(injured + " injured");
    $("#heavy-injured-label").text(heavy_Injured + " heavy injured");
    $("#fatal-label").text(fatal + " fatal");
    $("html, body").animate({ scrollTop: $(".donut-chart-background").offset().top }, "slow");

    $(".donut-chart-title").text("Types of accidents in canton " + canton + " " + year + " - " + total + " accidents reported");
}

/*
round the value a number to 3 decimal
*/
function round(value) {
    return Math.ceil(value * 1000) / 1000;
}