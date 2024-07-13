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
const marginTop = 20;
const marginRight = 0;
const marginBottom = 30;
const marginLeft = 70;

// Inspired by https://observablehq.com/@d3/bar-chart-transitions

const x = d3.scaleBand()
    .domain(Object.values(STATES))
    .range([marginLeft, width - marginRight])
    .padding(0.1);

const xAxis = d3.axisBottom(x).tickSizeOuter(0);

const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.cases)]).nice()
    .range([height - marginBottom, marginTop]);

const svg = d3.select("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("style", `max-width: ${width}px; height: auto; font: 10px sans-serif; overflow: visible;`);

svg.append("text")
    .attr("x", (width / 2))
    .attr("y", marginTop)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .text("COVID-19 Cases by State");

const bar = svg.append("g")
    .attr("fill", "steelblue")
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", d => x(d.state))
    .attr("y", d => y(d.cases))
    .attr("height", d => y(0) - y(d.cases))
    .attr("width", x.bandwidth());

const gx = svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(xAxis);

const gy = svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove());

const BUTTON_OPTIONS = {
    "Alphabetical": (a, b) => a.state.localeCompare(b.state),
    "Increasing": (a, b) => a.cases - b.cases,
    "Decreasing": (a, b) => b.cases - a.cases
}

d3.select("#selectButton")
    .selectAll('options')
    .data(Object.keys(BUTTON_OPTIONS))
    .enter()
    .append('option')
    .text(function(d) { return d; })
    .attr("value", function(d) { return d; });

d3.select("#selectButton").on("change", function(z) {
    console.log("here")
    const sortOrder = d3.select(this).property("value");

    x.domain(data.sort(BUTTON_OPTIONS[sortOrder]).map(b => b.state));

    const t = svg.transition()
        .duration(750);

    bar.data(data, d => d.state)
        .order()
        .transition(t)
        .delay((d, i) => i * 20)
        .attr("x", d => x(d.state));

    gx.transition(t)
        .call(xAxis)
        .selectAll(".tick")
        .delay((d, i) => i * 20);
});

