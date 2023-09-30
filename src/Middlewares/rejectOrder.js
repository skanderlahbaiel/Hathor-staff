import axios from "axios";
function handleRejectOrder(order) {
  return new Promise((resolve, reject) => {
    const { id, email, fullname, date, time } = order
    const booking_id = id
    const booking_time = time
    const booking_date = date


    // Assuming you're using a library like Axios for HTTP requests
    // Send a POST request to the confirm order route with the order data
    axios.post(" http://localhost:3000/reject-order/reject-order", { booking_id, booking_time, booking_date, email, fullname })
      .then((response) => {
        // Handle the response from the server (e.g., show a success message)
        console.log("Order rejected:", response.data);
        resolve()
      })
      .catch((error) => {
        // Handle errors (e.g., display an error message)
        console.error("Error rejecting order:", error);
        reject(error)
      });

  })

}

export default handleRejectOrder;