import { DataSet, Timeline, TimelineOptions } from 'vis';
import * as d3 from 'd3';

interface Data {
    date: string;
    event: string;
}

d3.csv("/data.csv").then((data: d3.DSVRowArray<string>) => {
    const items = new DataSet(data.map((d, i) => ({
        id: i + 1,
        content: d.event,
        start: d.date
    })));

    const container = document.createElement('div');
    container.style.width = '800px';
    container.style.height = '200px';
    container.style.border = '1px solid lightgray';
    document.body.appendChild(container);

    const options: TimelineOptions = {
        start: '2023-01-01',
        end: '2023-12-31'
    };

    new Timeline(container, items, options);
}).catch(error => {
    console.error('Error loading or parsing CSV file:', error);
});
