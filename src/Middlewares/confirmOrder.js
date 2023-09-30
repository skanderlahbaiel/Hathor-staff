import axios from "axios";

function handleConfirmOrder(order) {
  return new Promise((resolve, reject) => {
    const { id, time, subject, date, email, fullname, comments, phone } = order;
    const booking_date = date.slice(0, 10);
    const booking_time = time;
    const booking_id = id;

    // Assuming you're using a library like Axios for HTTP requests
    // Send a POST request to the confirm order route with the order data
    axios
      .post(" http://localhost:3000/database/check-confirm-decrement-manual", {
        booking_date,
        booking_time,
        booking_id,
        email,
        subject,
        fullname,
        comments,
        phone

      })
      .then((response) => {
        // Handle the response from the server (e.g., show a success message)
        console.log("Order confirmed:", response.data);
        resolve(); // Resolve the promise on success
      })
      .catch((error) => {
        // Handle errors (e.g., display an error message)
        console.error("Error confirming order:", error);
        reject(error); // Reject the promise on error
      });
  });
}

export default handleConfirmOrder;
