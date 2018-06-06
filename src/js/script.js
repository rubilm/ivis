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
guidline / tutorial: http://hdnrnzk.me/2012/07/04/creating-a-bar-graph-using-d3js/
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

    // tooltip for barchart
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "toolTip");

    // load the data from the cleaned csv file based on the selected year 
    d3.csv("data/" + year + ".csv", function (error, data) {

        // create scale for y direction
        const y = d3.scaleBand()
            .range([height, 0])
            .padding(0.1);

        // create scale for x direction
        const x = d3.scaleLinear()
            .range([0, width]);

        // declare the amount of vehicle as number
        data.forEach(function (d) {
            d.anzahl_Fahrzeuge = + d.anzahl_Fahrzeuge;
        });

        // sorting based on vehicle amount
        data.sort(function (a, b) {
            return a.anzahl_Fahrzeuge - b.anzahl_Fahrzeuge;
        });

        // set domain to amount of vehicles 
        x.domain([0, d3.max(data,
            function (d) {
                return d.anzahl_Fahrzeuge;
            })]);

        // set domain to canton name
        y.domain(data.map(
            function (d) {
                return d.Kanton;
            }));

        // generate x axis
        svg_barchart.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // generate y axis
        svg_barchart.append("g")
            .call(d3.axisLeft(y));

        // create barchart rects
        svg_barchart.selectAll(".bar_second")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar_second")
            .attr("id", function (d) {
                return "P" + d.Kanton;
            })
            .attr("width",
                function (d) {
                    return x(d.anzahl_Fahrzeuge);
                })
            .transition()
            .delay(
                function (d, i) {
                    return i * 80;
                })
            .attr("x", 0)
            .attr("y",
                function (d) {
                    return y(d.Kanton);
                })
            .attr("height", y.bandwidth());

        // show tooltip on bar hover
        svg_barchart.selectAll(".bar_second")
            .on("mouseover",
                function (d) {
                    $('#' + d.Kanton).removeClass("bar")
                    $('#' + d.Kanton).addClass("bar_hover");
                    tooltip
                        .style("left", d3.event.pageX + "px")
                        .style("top", d3.event.pageY - 120 + "px")
                        .style("display", "inline-block")
                        .html(d.Kanton + "</br>" + d.anzahl_Fahrzeuge + " registered vehicles </br> " + d.Unfall + " accidents");
                });

        // hide tooltip on bar mouseout
        svg_barchart.selectAll(".bar_second")
            .on("mouseout",
                function (d) {
                    $('#' + d.Kanton).removeClass("bar_hover")
                    $('#' + d.Kanton).addClass("bar");
                    tooltip.style("display", "none")
                });

    });
}

/*
load barchart with percentages of accidents
guidline / tutorial: http://hdnrnzk.me/2012/07/04/creating-a-bar-graph-using-d3js/
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

    // tooltip for barchart
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "toolTip");

    // load the data from the cleaned csv file based on the selected year 
    d3.csv("data/" + year + ".csv", function (error, data) {

        // create scale for y direction
        const y = d3.scaleBand()
            .range([height, 0])
            .padding(0.1);

        // create scale for x direction
        const x = d3.scaleLinear()
            .range([0, width]);

        // declare the percentage as number and cal it
        data.forEach(function (d) {
            d.Value = + round((d.Unfall / d.anzahl_Fahrzeuge) * 100);
        });

        // sorting based on percentage rate
        data.sort(function (a, b) {
            return a.Value - b.Value;
        });

        // set domain to percentage of accidents
        x.domain([0, d3.max(data,
            function (d) {
                return d.Value;
            })]);

        //set domain to canton name
        y.domain(data.map(
            function (d) {
                return d.Kanton;
            }));

        // generate x axis
        svg_barchart.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // generate y axis
        svg_barchart.append("g")
            .call(d3.axisLeft(y));

        // create barchart rects
        svg_barchart.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("id", function (d) {
                return d.Kanton;
            })
            .attr("width",
                function (d) {
                    return x(d.Value);
                })
            .transition()
            .delay(
                function (d, i) {
                    return i * 80;
                })
            .attr("x", 0)
            .attr("y",
                function (d) {
                    return y(d.Kanton);
                })
            .attr("height", y.bandwidth());

        // show tooltip on bar hover
        svg_barchart.selectAll(".bar")
            .on("mouseover",
                function (d) {
                    $('#P' + d.Kanton).removeClass("bar_second")
                    $('#P' + d.Kanton).addClass("bar_second_hover");
                    tooltip
                        .style("left", d3.event.pageX + "px")
                        .style("top", d3.event.pageY - 70 + "px")
                        .style("display", "inline-block")
                        .html(d.Kanton + ", " + d.Value + "% possibility for an accident per vehicle");
                });

        // hide tooltip on bar mouseout
        svg_barchart.selectAll(".bar")
            .on("mouseout",
                function (d) {
                    $('#P' + d.Kanton).removeClass("bar_second_hover")
                    $('#P' + d.Kanton).addClass("bar_second");
                    tooltip.style("display", "none")
                });


        // load donut chart on bar click
        svg_barchart.selectAll(".bar").on("click",
            function (d) {
                load_donut_chart(d.Fatal, d.Injured, d.heavy_Injured, d.Kanton, year, d.Unfall);
            });
    });
}

/*
create donut chart
guidline / tuturial: http://www.adeveloperdiary.com/d3-js/create-a-simple-donut-chart-using-d3-js/
*/
function load_donut_chart(fatal, injured, heavy_Injured, canton, year, total) {
    // set chart data and colors
    const data = [
        { name: "Fatal", value: fatal, color: "#FE7403" },
        { name: "Injured", value: injured, color: "#0D76AD" },
        { name: "Heavy Injured", value: heavy_Injured, color: "#0E9F3B" }
    ];

    // show legend chart
    $('.donut-chart-background').show();

    //set properties
    const width = 800;
    const height = 300;

    // create svg for donutchart
    let svg_donut = d3.select("#donut")
        .attr('class', 'donut')
        .attr('width', width)
        .attr('height', height);

    // set properties from donut
    const border_thickness = 50;
    const radius = Math.min(width, height) / 2;

    // set inner and outter arc radius
    let arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(radius - border_thickness);

    // assign accident types from data list
    let donut = d3.pie()
        .value(function (d) {
            return d.value;
        });

    // append g to the svg
    let g = svg_donut.append('g')
        .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

    // add parts from donut
    let path = g.selectAll('path')
        .data(donut(data))
        .enter()
        .append("g")
        .append('path')
        .attr('d', arc)
        .attr('fill',
            function (d, i) {
                return d.data.color;
            });

    // show explanation labels
    $("#injured-label").text(injured + " injured");
    $("#heavy-injured-label").text(heavy_Injured + " heavy injured");
    $("#fatal-label").text(fatal + " fatal");

    // scroll down to donut chart
    $("html, body").animate({ scrollTop: $(".donut-chart-background").offset().top }, "slow");

    // set title
    $(".donut-chart-title").text("Types of accidents in canton " + canton + " " + year + " - " + total + " accidents reported");
}

/*
round the value a number to 3 decimal
*/
function round(value) {
    return Math.ceil(value * 1000) / 1000;
}