function transformDataToEvents(receivedData) {
    if (!Array.isArray(receivedData)) {
      return [];
    }
  
    return receivedData.map((availability) => {
      // Calculate start and end times based on booking_time
      let start, end;
      if (availability.booking_time === 'matin') {
        start = availability.booking_date.slice(0,10) + 'T08:00:00';
        end = availability.booking_date.slice(0,10) + 'T13:00:00';
      } else if (availability.booking_time === 'soir') {
        start = availability.booking_date.slice(0,10) + 'T14:00:00';
        end = availability.booking_date.slice(0,10) + 'T22:00:00';
      }
  
      // Create the event object
      return {
        id: availability.availability_id,
        title: "Places: " + availability.available_slots.toString(),
        start,
        end,
      };
    });
  }
  
  export default transformDataToEvents;