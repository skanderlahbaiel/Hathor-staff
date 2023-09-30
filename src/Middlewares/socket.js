import { useState, useEffect } from "react";

// Modify the useWebSocket hook
const useWebSocket = (url) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = new WebSocket(url);

    newSocket.addEventListener("open", () => {
      console.log("Connected to WebSocket server");
      setSocket(newSocket);
    });

    newSocket.addEventListener("close", () => {
      console.log("WebSocket connection closed");
    });

    return () => {
      if (newSocket.readyState === WebSocket.OPEN) {
        newSocket.close();
      }
    };
  }, [url]);

  return socket;
};

export default useWebSocket;


