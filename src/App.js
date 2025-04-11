import React, { useState, useEffect } from "react";
import "./Popup.css";

function App() {
  const [count, setCount] = useState(0);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((request) => {
      if (request.action === "updateCount") {
        setCount(request.count);
      }
    });
  }, []);

  const handleStart = () => {
    setIsSending(true);
    chrome.runtime.sendMessage({ action: "start" });
  };

  const handleStop = () => {
    setIsSending(false);
    chrome.runtime.sendMessage({ action: "stop" });
  };

  return (
    <div className="popup-container">
      <h1 className="popup-title">LinkedIn Auto Connect</h1>
      <p className="count-text">
        <h3>Connections Sent: {count}</h3>
      </p>
      <button className="btn" onClick={handleStart} disabled={isSending}>
        {isSending ? "Sending..." : "Start Sending"}
      </button>
      <button
        className="btn stop-btn"
        onClick={handleStop}
        disabled={!isSending}
      >
        Stop Sending
      </button>
    </div>
  );
}

export default App;
