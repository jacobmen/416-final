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
const marginTop = 20;

// Inspired by https://d3-graph-gallery.com/graph/pie_annotation.html
// and https://d3-graph-gallery.com/graph/pie_changeData.html
const radius = 400

const svg = d3.select("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("style", `max-width: ${width}px; height: auto; font: 10px sans-serif; overflow: visible;`)
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

const cases = data.map(d => {
    return {
        value: d.cases,
        state: d.state
    };
});

const deaths = data.map(d => {
    return {
        value: d.deaths,
        state: d.state
    };
});

const color = d3.scaleOrdinal()
    .range(d3.schemeTableau10);
const format = d3.format(",d");

const draw = (content) => {
    const pie = d3.pie()
        .value(function(d) { return d.value })
        .sort(function(a, b) { return d3.ascending(a.value, b.value); });
    const pie_data = pie(content);

    const arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    svg.selectAll('slices')
        .data(pie_data)
        .join('path')
        .transition()
        .duration(1000)
        .attr('d', arcGenerator)
        .attr('fill', function(d) { return (color(d.data.state)) })
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 1);

    svg.selectAll('slices')
        .data(pie_data)
        .join('text')
        .transition()
        .duration(1000)
        .text(function(d) { return `${d.data.state}\n${format(d.data.value)}` })
        .attr("transform", function(d) { return `translate(${arcGenerator.centroid(d)})` })
        .style("text-anchor", "middle")
        .style("font-size", 17);
};

draw(cases);

d3.select("#cases_btn").on("click", () => draw(cases));
d3.select("#deaths_btn").on("click", () => draw(deaths));
