import React, { useEffect, useState } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import timeGridPlugin from "@fullcalendar/timegrid";
import transformDataToEvents from "../Middlewares/dataToEvents";

const Calendar = () => {
  const [receivedData, setReceivedData] = useState([]);
  const [selectedDateData, setSelectedDateData] = useState([]);
  const [event, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getFormattedCurrentDate());

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "http://localhost:3000/get-availability/all-availability",
          { withCredentials: false }
        );

        setReceivedData(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    // Calculate events from receivedData
    const transformedEvents = transformDataToEvents(receivedData);
    setEvents(transformedEvents);
  }, [receivedData]);

  const handleDateClick = (arg) => {
    const clickedDate = arg.dateStr.slice(0, 10);
    setSelectedDate(clickedDate);

    // Filter the data based on the clicked date
    const filteredData = receivedData.filter((item) => {
      const itemDate = item.booking_date.slice(0, 10);
      return itemDate === clickedDate;
    });

    setSelectedDateData(filteredData);
  };

  return (
    <div
      id="calendar-component-container"
      className="calendar-component-container"
    >
      <div id="FullCalendar-container" className="FullCalendar-container">
        <FullCalendar
          fixedWeekCount="false"
          plugins={[
            dayGridPlugin,
            interactionPlugin,
            bootstrapPlugin,
            timeGridPlugin,
          ]}
          editable
          selectable
          initialView="dayGridMonth"
          events={event}
          dateClick={handleDateClick}
          weekNumbers="true"
          nowIndicator
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          views={["dayGridMonth", "dayGridWeek", "dayGridDay"]}
        />
      </div>
      <div className="calendar-right-grid-container">
        <div id="calendar-days-info" className="calendar-days-info">
          {selectedDateData.length > 0 ? (
            // Render booking information when data is available
            selectedDateData.map((dataItem) => (
              <React.Fragment key={dataItem.availability_id}>
                <h1 id="details-title">{dataItem.booking_time}</h1>
                <p>
                  Places disponibles:{" "}
                  <strong>{dataItem.available_slots}</strong>
                </p>
              </React.Fragment>
            ))
          ) : (
            // Render message when no bookings are available
            <h1>Pas de réservations pour cette journée</h1>
          )}
        </div>
        <div className="selected-date">
          <p>{selectedDate}</p>
        </div>
      </div>
    </div>
  );
};

export default Calendar;

// Helper function to get the current date in yy-mm-dd format
function getFormattedCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString().slice(-2);
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
