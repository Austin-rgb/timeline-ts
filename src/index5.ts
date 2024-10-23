import * as d3 from 'd3';

interface Data {
    date: Date;
    event: string;
}

d3.csv("/data.csv").then((data: d3.DSVRowArray<string>) => {
    const parsedData: Data[] = data.map(d => ({
        date: new Date(d.EventInfo_Time),
        event: d.EventInfo_Name
    }));

    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 1200 - margin.top - margin.bottom;

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

    svg.selectAll(".event")
        .data(parsedData)
        .enter().append("circle")
        .attr("class", "event")
        .attr("cx", width / 2)
        .attr("cy", d => y(d.date))
        .attr("r", 5);

    const labels = svg.selectAll(".label")
        .data(parsedData)
        .enter().append("text")
        .attr("class", "label")
        .attr("x", width / 2 + 10)
        .attr("y", d => y(d.date))
        .attr("text-anchor", "start")
        .text(d => d.event);

    // Avoid label overlap by adjusting y positions
    const adjustLabels = () => {
        const spacing = 12;  // Minimum spacing between labels
        let previousY: number | null = null;  // Explicitly define type for previousY
        labels.each(function (d, i) {
            const currentLabel = d3.select(this);
            const currentY = y(d.date);

            if (previousY !== null && currentY - previousY < spacing) {
                const newY = previousY + spacing;
                currentLabel.attr("y", newY);
                d3.select(`circle:nth-child(${i + 1})`).attr("cy", newY);  // Adjust the circle position as well
            } else {
                previousY = currentY;
            }
        });
    };

    adjustLabels();

}).catch(error => {
    console.error('Error loading or parsing CSV file:', error);
});
