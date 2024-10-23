import * as d3 from 'd3';

interface Data {
    date: Date;
    event: string;
    [key: string]: any;
}

d3.csv("/data.csv").then((data: d3.DSVRowArray<string>) => {
    const parsedData: Data[] = data.map(d => ({
        date: new Date(d.EventInfo_Time),
        event: d.EventInfo_Name,
        basetype:d.EventInfo_BaseType,
        source:d.EventInfo_Source
    }));

    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 1800 - margin.top - margin.bottom;

    const svg = d3.select("#timeline")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const y = d3.scaleTime()
        .domain(d3.extent(parsedData, d => d.date) as [Date, Date])
        .range([0, height]);

    const yAxis = d3.axisLeft(y);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    const eventGroups = svg.selectAll(".event-group")
        .data(parsedData)
        .enter().append("g")
        .attr("class", "event-group")
        .attr("transform", d => `translate(${width / 2}, ${y(d.date)})`);

    eventGroups.append("circle")
        .attr("class", "event")
        .attr("r", 5);

    eventGroups.append("text")
        .attr("class", "label")
        .attr("x", 10)
        .attr("y", -5)
        .attr("text-anchor", "start")
        .text(d => d.event);

    eventGroups.selectAll(".event-detail")
        .data(d => Object.entries(d).filter(([key]) => key !== 'date' && key !== 'event'))
        .enter().append("text")
        .attr("class", "event-detail")
        .attr("x", 10)
        .attr("y", (d, i) => (i + 1) * 15)
        .attr("text-anchor", "start")
        .text(d => `${d[0]}: ${d[1]}`);

    // Avoid label overlap by adjusting y positions
    const adjustLabels = () => {
        const spacing = 25;  // Minimum spacing between labels to prevent overlap
        let previousY: number | null = null;  // Explicitly define type for previousY
        eventGroups.each(function (d, i) {
            const currentGroup = d3.select(this);
            const currentY = y(d.date);

            if (previousY !== null && currentY - previousY < spacing) {
                const newY = previousY + spacing;
                currentGroup.attr("transform", `translate(${width / 2}, ${newY})`);
                previousY = newY;
            } else {
                previousY = currentY;
            }
        });
    };

    adjustLabels();

}).catch(error => {
    console.error('Error loading or parsing CSV file:', error);
});
