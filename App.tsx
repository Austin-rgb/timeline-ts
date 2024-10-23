import React from 'react';
import './App.css';  // Assuming you have some CSS styles you might want to apply
import EventsTimeline from './components/EventsTimeline';

function App() {
  return (
    <div className="App">
        <h1>Event Timeline</h1>
      <main>
        <EventsTimeline />
      </main>
    </div>
  );
}

export default App;

