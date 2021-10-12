// set the dimensions and margins of the graph
var margin = { top: 30, right: 30, bottom: 70, left: 60 },
    width = 960 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Initialize the X axis
var x = d3.scaleBand()
    .range([0, width])
    .padding(1);
var xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")

// Initialize the Y axis
var y = d3.scaleLinear()
    .range([height, 0]);
var yAxis = svg.append("g")
    .attr("class", "myYaxis")

// A function that create / update the plot for a given variable:
function update(selectedVar) {

    // Parse the Data
    d3.csv("data.csv").then(function(data) {

        // X axis
        x.domain(data.map(function(d) { return d.Month; }))
        xAxis.transition().duration(1000).call(d3.axisBottom(x))

        // Add Y axis
        y.domain([0, d3.max(data, function(d) { return +d[selectedVar] })]);
        yAxis.transition().duration(1000).call(d3.axisLeft(y));

        // variable u: map data to existing circle
        var j = svg.selectAll(".myLine")
            .data(data)
            // update lines
        j
            .enter()
            .append("line")
            .attr("class", "myLine")
            .merge(j)
            .transition()
            .duration(1000)
            .attr("x1", function(d) { console.log(x(d.Month)); return x(d.Month); })
            .attr("x2", function(d) { return x(d.Month); })
            .attr("y1", y(0))
            .attr("y2", function(d) { return y(d[selectedVar]); })
            .attr("stroke", "grey")
            .delay(function(d, i) { return i * 500 });


        // variable u: map data to existing circle
        var u = svg.selectAll("circle")
            .data(data)
            // update bars
        u
            .enter()
            .append("circle")
            .merge(u)
            .transition()
            .duration(1000)
            .attr("cx", function(d) { return x(d.Month); })
            .attr("cy", function(d) { return y(d[selectedVar]); })
            .attr("r", 20)
            .attr("fill", "red")
            .delay(function(d, i) { return i * 500 });

        // Create axes labels
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 10)
            .attr("x", 0 - (height / 1.50))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .attr("fill", "red")
            .text("Number of Incidents");

        svg.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
            .attr("class", "axisText active")
            .attr("id", "month")
            .attr("fill", "red")
            .text("Month");

        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([80, -105])
            .html(function(d) {
                return (`<strong>${d.Month}<strong><hr><strong>${d[selectedVar]}</strong>`);
            });

        svg.selectAll("circle").call(toolTip);


        // Step 3: Create "mouseover" event listener to display tooltip
        svg.selectAll("circle").on("mouseover", function(event, d) {
                toolTip.show(d, this);

                //make bubbles big
                d3.select(this)
                    .transition()
                    .duration(1000)
                    .attr("r", 40);
            })
            // Step 4: Create "mouseout" event listener to hide tooltip
            .on("mouseout", function(event, d) {
                toolTip.hide(d);

                d3.select(this)
                    .transition()
                    .duration(1000)
                    .attr("r", 20);
            });


    });

}


// Initialize plot
update('Burglary')