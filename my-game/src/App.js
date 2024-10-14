import React, { useState, useEffect } from "react";
import { socket } from "./socket";
import { ConnectionState } from "./components/ConnectionState.js";
import { ConnectionManager } from "./components/ConnectionManager";

export default function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    // set the state that ConnectionState needs
    function onConnect() {
      setIsConnected(true);
      console.log("connected to the server");
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log("disconnected from the server");
    }

    // synchronously register connect and disconnect event handlers
    // socket.on... means ADD A LISTENER
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    // socket.off... means REMOVE A LISTENER
    // basically this ensures that the listeners are only added once
    // and if the component gets re-mounted OR the dependencies change
    // and the useEffect hook runs again then the listeners only ever get added once

    // WE RETURN A CLEANUP FUNCTION WHICH REACT USES TO CALL THE NEXT TIME
    // THE COMPONENT IS MOUNTED OR USE_EFFECT HAS TO RUN - SO WE MAKE SURE
    // THERE'S A CLEAN SLATE FOR THE NEXT TIME!

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <div className="App">
      <ConnectionState isConnected={isConnected} />
      {/** Make connections in ConnectionManager and handle connection events in App */}
      <ConnectionManager />
    </div>
  );
}
