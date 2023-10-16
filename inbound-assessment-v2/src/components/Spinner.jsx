import React, { useEffect } from "react";

const Spinner = () => {
  const setLocalStorageWithTimestamp = () => {
    const currentTime = new Date().getTime();
    localStorage.setItem(
      "myData",
      JSON.stringify({ value: "yourValue", timestamp: currentTime })
    );
  };
  const checkAndRemoveLocalStorage = () => {
    const storedData = localStorage.getItem("myData");
    if (storedData) {
      const { value, timestamp } = JSON.parse(storedData);
      const currentTime = new Date().getTime();
      const oneHourInMilliseconds = 60 * 1000;

      if (currentTime - timestamp >= oneHourInMilliseconds) {
        // One hour has passed, remove the item from localStorage
        console.log("wellcome to localstorage");
        localStorage.removeItem("myData");
      }
    }
  };
  useEffect(() => {
    setLocalStorageWithTimestamp();

    // Check and remove localStorage every minute (you can adjust the interval)
    const interval = setInterval(() => {
      checkAndRemoveLocalStorage();
    }, 60000); // Check every minute

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="spinner_outer">
      <div className="spinner-border text-warning " role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
