import * as d3 from 'd3';

interface Data {
    date: Date;
    event: string;
}

d3.csv("/data.csv").then((data: d3.DSVRowArray<string>) => {
    const parsedData: Data[] = data.map(d => ({
        date: new Date(d.date),
        event: d.event
    }));

    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
        .domain(d3.extent(parsedData, d => d.date) as [Date, Date])
        .range([0, width]);

    const xAxis = d3.axisBottom(x);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis);

    svg.selectAll(".event")
        .data(parsedData)
        .enter().append("circle")
        .attr("class", "event")
        .attr("cx", d => x(d.date))
        .attr("cy", height / 2)
        .attr("r", 5);

    svg.selectAll(".label")
        .data(parsedData)
        .enter().append("text")
        .attr("class", "label")
        .attr("x", d => x(d.date))
        .attr("y", height / 2 - 10)
        .attr("text-anchor", "middle")
        .text(d => d.event);
}).catch(error => {
    console.error('Error loading or parsing CSV file:', error);
});
