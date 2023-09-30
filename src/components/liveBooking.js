import React, { useState, useEffect } from "react";
import useWebSocket from "../Middlewares/socket"; // Import the custom hook
import sound from "../audio/drypop.wav";
import { useSound } from "use-sound"; // Import the useSound hook
const url = "ws://localhost:3000";

const LiveBooking = () => {
  const [receivedData, setReceivedData] = useState([]);
  const socket = useWebSocket(url); // Use the custom hook to get the socket
  const [playNotification] = useSound(sound); // Initialize the useSound hook with your audio file

  playNotification();

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleMessage = (event) => {
      console.log("Received message from server:", event.data);

      try {
        const parsedData = JSON.parse(event.data);
        console.log(parsedData);
        setReceivedData((prevData) => [...prevData, parsedData]);
        playNotification(); // Play the notification sound when receivedData
      } catch (error) {
        console.log("Received non-JSON data:", event.data);
      }
    };

    const handleError = (event) => {
      console.log("WebSocket connection error:", event);
      // Handle the connection error here, e.g. show an error message or retry the connection
    };

    const handleClose = () => {
      console.log("WebSocket connection closed");
      // Handle the connection close here, e.g. show a message or retry the connection
    };

    socket.addEventListener("message", handleMessage);
    socket.addEventListener("error", handleError);
    socket.addEventListener("close", handleClose);

    return () => {
      // Check if the socket exists before attempting to remove event listeners
      if (socket) {
        socket.removeEventListener("message", handleMessage);
        socket.removeEventListener("error", handleError);
        socket.removeEventListener("close", handleClose);
      }
    };
  }, [receivedData, socket]); // Include socket as a dependency

  return (
    <div id="booking-block" className="booking-block">
      <div className="booking-cards-block">
        {receivedData.map((item) => (
          <div key={item.id} className="card">
            <h3>{item.fullname}</h3>
            <h3>{item.subject}</h3>
            <h4>{item.email}</h4>
            <span>
              <strong>Réservation pour le</strong>: {item.date}
            </span>
            <span>
              <strong>Horaire</strong>: {item.time}
            </span>
            <span>
              <strong>Commentaires</strong>: {item.comments}
            </span>
            <span>
              <strong>Téléphone:</strong>
              {item.phone}
            </span>
            <span>
              <strong>Création de la réservation</strong>:{" "}
              {item.creationDate.slice(0, 10)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveBooking;
