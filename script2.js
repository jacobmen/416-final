import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const STATES = {
    "arizona": "AZ",
    "alabama": "AL",
    "alaska": "AK",
    "arkansas": "AR",
    "california": "CA",
    "colorado": "CO",
    "connecticut": "CT",
    "district of columbia": "DC",
    "delaware": "DE",
    "florida": "FL",
    "georgia": "GA",
    "hawaii": "HI",
    "idaho": "ID",
    "illinois": "IL",
    "indiana": "IN",
    "iowa": "IA",
    "kansas": "KS",
    "kentucky": "KY",
    "louisiana": "LA",
    "maine": "ME",
    "maryland": "MD",
    "massachusetts": "MA",
    "michigan": "MI",
    "minnesota": "MN",
    "mississippi": "MS",
    "missouri": "MO",
    "montana": "MT",
    "nebraska": "NE",
    "nevada": "NV",
    "new hampshire": "NH",
    "new jersey": "NJ",
    "new mexico": "NM",
    "new york": "NY",
    "north carolina": "NC",
    "north dakota": "ND",
    "ohio": "OH",
    "oklahoma": "OK",
    "oregon": "OR",
    "pennsylvania": "PA",
    "rhode island": "RI",
    "south carolina": "SC",
    "south dakota": "SD",
    "tennessee": "TN",
    "texas": "TX",
    "utah": "UT",
    "vermont": "VT",
    "virginia": "VA",
    "washington": "WA",
    "west virginia": "WV",
    "wisconsin": "WI",
    "wyoming": "WY",
    "american samoa": "AS",
    "guam": "GU",
    "northern mariana islands": "MP",
    "puerto rico": "PR",
    "virgin islands": "VI",
};

const data = await d3.csv("us-states.csv", (d) => {
    const parts = d.date.split('-');
    return {
        cases: Number(d.cases),
        date: new Date(parts[0], parts[1] - 1, parts[2]),
        deaths: Number(d.deaths),
        fips: Number(d.fips),
        state: STATES[d.state.toLowerCase()],
    }
});

const width = 1280;
const height = 800;
const margin = 1;

const format = d3.format(",d");

const color = d3.scaleOrdinal(d3.schemeTableau10);

const pack = d3.pack()
    .size([width - margin * 2, height - margin * 2])
    .padding(3);

const root = pack(d3.hierarchy({ children: data })
    .sum(d => d.deaths));

var tooltip = d3.select("#container").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

const svg = d3.select("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("style", `max-width: ${width}px; height: auto; font: 10px sans-serif; overflow: visible;`);

const node = svg.append("g")
    .selectAll()
    .data(root.leaves())
    .join("g")
    .attr("transform", d => `translate(${d.x},${d.y})`);

node.append("title")
    .text(d => `${d.data.state}\n${format(d.data.deaths)}`);

node.append("circle")
    .attr("fill-opacity", 0.7)
    .attr("fill", d => color(d.data))
    .attr("r", d => d.r);

const text = node.append("text")
    .attr("clip-path", d => `circle(${d.r})`);

text.selectAll()
    .data(d => d.data.state)
    .join("tspan")
    .attr("x", 0)
    .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.35}em`)
    .text(d => d);

text.append("tspan")
    .attr("x", 0)
    .attr("y", d => `${d.data.state.length / 2 + 0.75}em`)
    .attr("fill-opacity", 0.7)
    .text(d => format(d.value));

node.on('mouseover', function(event, d) {
    tooltip.transition()
        .duration(50)
        .style("opacity", 1);

    let extraInfo = `Death Ratio for ${d.data.state}: ${d.data.deaths / d.data.cases}`;

    tooltip.html(extraInfo)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 15) + "px");

}).on('mouseout', function(d, i) {
    tooltip.transition()
        .duration('50')
        .style("opacity", 0);
});
