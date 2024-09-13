// Set dimensions and margins for the graph
const margin = {top: 50, right: 30, bottom: 50, left: 60},
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

const svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Tooltip for displaying additional information
const tooltip = d3.select(".tooltip");

// Load the data
d3.csv("insurance.csv").then(function(data) {

  // Parse data
  data.forEach(d => {
    d.bmi = +d.bmi;
    d.charges = +d.charges;
    d.children = +d.children;
  });

  // Create scales
  const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.bmi))
      .range([0, width]);

  const y = d3.scaleLinear()
      .domain(d3.extent(data, d => d.charges))
      .range([height, 0]);

  const color = d3.scaleOrdinal()
      .domain(["yes", "no"])
      .range(["red", "blue"]);

  const size = d3.scaleLinear()
      .domain(d3.extent(data, d => d.children))
      .range([4, 20]);

  // Add X axis
  svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

  // Add Y axis
  svg.append("g")
      .call(d3.axisLeft(y));

  // Add dots
  svg.append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", d => x(d.bmi))
      .attr("cy", d => y(d.charges))
      .attr("r", d => size(d.children))
      .style("fill", d => color(d.smoker))
      .style("opacity", 0.7)
      .on("mouseover", function(event, d) {
          tooltip.transition()
              .duration(200)
              .style("opacity", 0.9);
          tooltip.html(`BMI: ${d.bmi}<br>Charges: ${d.charges}<br>Smoker: ${d.smoker}<br>Children: ${d.children}`)
              .style("left", (event.pageX + 5) + "px")
              .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
              .duration(500)
              .style("opacity", 0);
      });

  // Add labels
  svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .style("text-anchor", "middle")
      .text("BMI");

  svg.append("text")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 20)
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "middle")
      .text("Charges");

});
