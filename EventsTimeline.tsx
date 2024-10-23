import React, { useState, useEffect, useRef } from 'react';
import { DataSet, Timeline, TimelineOptions, DataItem, IdType } from 'vis-timeline/standalone';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';
import Papa from 'papaparse';
import { Scenario } from '../types';

const EventsTimeline = () => {
    const [error, setError] = useState('');
    const timelineRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('scenarions.csv');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const csv = await response.text();

                Papa.parse<Scenario>(csv, {
                    header: true,
                    dynamicTyping: true,
                    complete: (results) => {
                        const items = new DataSet<DataItem>(results.data.map((item, index) => ({
                            id: index as IdType,
                            content: item.Scenario_Name,
                            start: new Date(item.EventInfo_Time),
                            title: `${item.Scenario_Name} - ${item.Scenario_Status}`,
                            style: `background-color: ${getStyleByStatus(item.Scenario_Status)};` // Apply direct styling
                        })));

                        if (timelineRef.current) {
                            const options: TimelineOptions = {
                                stack: true,
                                verticalScroll: true,
                                horizontalScroll: true,
                                zoomKey: 'ctrlKey',
                                zoomMin: 10,
                                zoomMax: 1000 * 60 * 60 * 24 * 30,
                                height: '400px',
                                width: '100%',
                                editable: false,
                                order: (a, b) => a.start.valueOf() - b.start.valueOf() || Number(a.id) - Number(b.id),
                                orientation: 'top',
                            };
                            new Timeline(timelineRef.current, items, options);
                        }
                    }
                });
            } catch (error) {
                console.error('Failed to fetch the CSV:', error);
                setError('Failed to load data'); // Set error message
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <div>Error: {error}</div>; // Display error message
    }

    return <div ref={timelineRef} style={{ height: '400px', width: '100%' }} />;
};

// Helper function to determine the style color based on status
function getStyleByStatus(status: string): string {
    switch (status.toLowerCase()) {
        case 'success':
            return '#28a745';  // Green
        case 'failure':
            return '#dc3545';  // Red
        case 'abandoned':
            return '#fd7e14';  // Orange
        case 'timeout':
            return '#007bff';  // Blue
        default:
            return '#6c757d';  // Default to a neutral gray
    }
}

export default EventsTimeline;
