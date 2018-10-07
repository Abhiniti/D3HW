// SVG
var margin = {top: 40, right: 20, bottom: 50, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

// scale X
var xValue = function(d) { return d.healthcare;}, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");
	
// scale Y
var yValue = function(d) { return d.obesity;}, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");
	
// multicolored
var cValue = function(d) { return d.abbr;},
    color = d3.scale.category10();


var svg = d3.select("#scatter").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");	


var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0.5);	
	
	
	
// read CSV file
d3.csv("assets/data/data.csv", function(data) {

	var healthcare = [];
	var obesity = [];

	data.forEach(function(d) {
		d.healthcare = +d.healthcare;
		d.obesity = +d.obesity;
		d.stateAbbr = d.abbr;
		healthcare.push(d.healthcare);
		obesity.push(d.obesity);

	// end of forEach
	});

	xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
	yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

	// title
	svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "20px") 
        .style("text-decoration", "underline")  
        .text("Healthcare vs. Obesity");
	
	// x-axis
	svg.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + height + ")")
	  .call(xAxis)
	.append("text")
	  .attr("class", "label")
	  .attr("x", width*0.55)
	  .attr("y", +45)
	  .style("text-anchor", "end")
	  .text("Healthcare (%)");

	// y-axis
	svg.append("g")
	  .attr("class", "y axis")
	  .call(yAxis)
	.append("text")
	  .attr("class", "label")
	  .attr("transform", "rotate(-90)")
	  .attr("y", 6)
	  .attr("dy", ".71em")
	  .style("text-anchor", "end")
	  .text("Obesity (%)");	  

	// scatter points
	var circles = svg.selectAll(".circle")
	  .data(data)
	.enter().append("circle")
	  .attr("class", "dot")
	  .attr("r", 12)
	  .attr("cx", xMap)
	  .attr("cy", yMap)
	  .style("fill", function(d) { return color(cValue(d));})
	  .on("mouseover", function(d) {
		  tooltip.transition()
			   .duration(200)
			   .style("opacity", 1);
		  tooltip.html("<b>" + d["state"] + "</b>" + "<br/> Healthcare: " + xValue(d) + " (%)" 
			+ "<br/> Obesity: " + yValue(d) + " (%)")
			   .style("left", (d3.event.pageX + 15) + "px")
			   .style("top", (d3.event.pageY - 20) + "px")
	  })
	  .on("mouseout", function(d) {
		  tooltip.transition()
			   .duration(500)
			   .style("opacity", 0);
	  });
	  //console.log(circles);

	// state inside circle
	xstateMap = function(d) { return xScale(xValue(d))-10;}
	ystateMap = function(d) { return yScale(yValue(d))+6;}
	
	var test = svg.selectAll(".text")
				.data(data)
				.enter()
				.append("text")
				.attr("x", xstateMap)
				.attr("y", ystateMap)
				.text(function(d) {
                    return d.abbr;
                })
				.attr("font-size", "12px")
				.attr("fill", "white")
				.attr("font-weight", "bold");	
	  
// end of d3csv
});