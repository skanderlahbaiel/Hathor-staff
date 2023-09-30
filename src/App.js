import React from 'react';
import "./App.css";
import LiveBooking from "./components/liveBooking.js";
import DataFetcher from "./components/allBookings";
import Layout from "./components/layout";
import Calendar from './components/calendar';
import ErrorBoundary from "./errorBoundary"; // Import the ErrorBoundary component
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  console.log("App component rendered"); // Add this log statement
  return (
    <Router>
      <ErrorBoundary> {/* Wrap your entire application with ErrorBoundary */}
        <Layout>
          <Routes>
            <Route path="/live" exact element={<LiveBooking />} />
            <Route path="/all" element={<DataFetcher />} />
            <Route path="/calendar" element={<Calendar />} />
          </Routes>
        </Layout>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
