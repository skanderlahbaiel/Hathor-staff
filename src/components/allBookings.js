import React, { useState, useEffect } from "react";
import axios from "axios";
import handleConfirmOrder from "../Middlewares/confirmOrder";
import handleRejectOrder from "../Middlewares/rejectOrder";

function DataFetcher() {
  // Update formData state when input values change
  function handleInputChange(e) {
    const { name, value } = e.target;

    // Update the corresponding key in formData
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }
  // Define state variables to store form input values
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    time: "",
    date: "",
    email: "",
    comments: "",
    id: "",
    status: "",
    creationDate: "",
    subject: "",
  });

  const [sortCriteria, setSortCriteria] = useState("booking_date");
  const [sortOrder, setSortOrder] = useState("asc"); // Add sorting order state

  const handleSortChange = (criteria) => {
    setSortCriteria(criteria);
  };
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const sortData = () => {
    return [...data].sort((a, b) => {
      switch (sortCriteria) {
        case "booking_date":
          const dateA =  new Date(a.date)
          const dateB =  new Date(b.date);
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        case "creation_date":
          const creationDateA = new Date(a.creationDate);
          const creationDateB = new Date(b.creationDate);
          return sortOrder === "asc" ? creationDateA - creationDateB : creationDateB - creationDateA;
        case "name":
          return (a.fullname || "").localeCompare(b.fullname || "");
        case "status":
          return (a.status || "").localeCompare(b.status || "");
        case "time":
          return (a.time || "").localeCompare(b.time || "");
        case "email":
          return (a.email || "").localeCompare(b.email || "");
        default:
          const defaultDateA = new Date(a.booking_date);
          const defaultDateB = new Date(b.booking_date);
          return sortOrder === "asc" ? defaultDateA - defaultDateB : defaultDateB - defaultDateA;
      }
    });
  };
  

  // Function to send the Axios request with query parameters
  async function sendRequest() {
    try {
      // Filter out empty values from the formData object
      const queryParams = {};
      for (const key in formData) {
        if (formData[key] !== "") {
          queryParams[key] = formData[key];
        }
      }
      setIsLoading(true);

      // Send the Axios GET request with non-empty query parameters
      const response = await axios.get(
        "http://localhost:3000/booking/filtered-bookings",
        {
          withCredentials: false,
          params: queryParams,
        }
      );

      console.log(response.data);
      setData(response.data);
      setIsLoading(false);
    } catch (error) {
      // Handle any errors here
      setError(error);
      setIsLoading(false);
    }
  }

  const refreshDataConfirm = (item) => {
    handleConfirmOrder(item)
      .then(() => {
        sendRequest();
      })
      .catch((error) => {
        // Handle any errors if needed
        console.error("Error confirming order:", error);
      });
  };

  const refreshDataReject = (item) => {
    handleRejectOrder(item)
    .then(() => {
      sendRequest();
    })
    .catch((error)=>
    {
      console.error("Error rejecting order:", error);
    })
   
  };

  // Call sendRequest initially or as needed
  useEffect(() => {
    sendRequest();
  }, [formData]); // Execute when formData changes

  return (
    <>
      <div className="dashboard">
        <p className="dashboard-title">Mon tableau de bord</p>
        <div className="all-bookings-filter-form">
          <input
            type="text"
            id="fullname"
            placeholder="Nom"
            name="fullname"
            value={formData.fullname}
            onChange={handleInputChange}
          />

          <input
            type="number"
            id="phone"
            placeholder="Téléphone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />

          <input
            type="text"
            id="time"
            placeholder="Session"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
          />

          <input
            type="text"
            id="subject"
            placeholder="Sujet de la réservation"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
          />

          <input
            type="text"
            id="date"
            placeholder="Date de la réservation"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
          />

          <input
            type="text"
            id="creationDate"
            name="creationDate"
            placeholder="Création de la réseravation"
            value={formData.creationDate}
            onChange={handleInputChange}
          />

          <input
            type="text"
            placeholder="E-mail"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />

          <input
            type="text"
            placeholder="Commentaires"
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleInputChange}
          />

          <input
            type="text"
            id="id"
            placeholder="ID"
            name="id"
            value={formData.id}
            onChange={handleInputChange}
          />

          <input
            type="text"
            id="status"
            placeholder="Statut"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          />
        </div>
        <div className="sort-options">
          <select
            className="sortSelect"
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option>Trier par</option>
            <option value="booking_date">Date de réservation</option>
            <option value="creation_date">Date de création</option>
            <option value="name">Nom</option>
            <option value="status">Statut</option>
            <option value="time">Session</option>
            <option value="email">Email</option>
          </select>
          <button onClick={toggleSortOrder}>
            {sortOrder === "asc" ? "Ordre descendant" : "Ordre ascendant"}
          </button>
        </div>
      </div>

      <div className="allbookings-container">
        <ul>
          {sortData().map((item) => (
            <li
              className={`item ${
                new Date(item.date) < new Date()
                  ? "past-booking"
                  : "future-booking"
              }`}
              key={item.id}
            >
              <article>
                <h3>{item.subject}</h3>
                <h4>{item.fullname}</h4>
                <span className="hover-info">
                  <span className="info-item">
                    <strong>N° téléphone:</strong> {item.phone}
                  </span>
                  <span className="info-item-booking_date">
                    <strong>Date:</strong> {item.date.slice(0, 10)}
                  </span>
                  <span className="info-item">
                    <strong>Horaire:</strong> {item.time}
                  </span>
                  <span className="info-item">
                    <strong>Création de la réservation:</strong>{" "}
                    {item.creationDate}
                  </span>
                  <span className="info-item">
                    <strong>E-mail:</strong> {item.email}
                  </span>
                  <span className="info-item">
                    <strong>Commentaires:</strong> {item.comments}
                  </span>
                  <span className="info-item">
                    <strong>ID:</strong> {item.id}
                  </span>
                  <span className="info-item-status">
                    <strong>Statut:</strong> {item.status}
                  </span>
                </span>
                {/* Conditionally render the button if status is 'pending' */}
                {item.status === "pending" && (
                  <div className="buttons">
                    <button
                      className="info-button confirm"
                      onClick={() => refreshDataConfirm(item)}
                    >
                      Confirmer
                    </button>

                    <button
                      className="info-button reject"
                      onClick={() => refreshDataReject(item)}
                    >
                      Refuser
                    </button>
                  </div>
                )}
              </article>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default DataFetcher;
