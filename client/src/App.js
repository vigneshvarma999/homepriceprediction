import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Custom styles

const App = () => {
  const [sqft, setSqft] = useState(1000);
  const [bhk, setBhk] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Fetch location names on component load
    axios
      .get("http://localhost:5000/api/get_location_names")
      .then((response) => {
        if (response.data) {
          setLocations(response.data.locations);
        }
      })
      .catch((error) => {
        setErrorMessage("Failed to load locations.");
      });
  }, []);

  const handleEstimatePrice = () => {
    // Input validation
    if (!sqft || isNaN(parseFloat(sqft))) {
      setErrorMessage("Please enter a valid square feet area.");
      return;
    }

    if (!location) {
      setErrorMessage("Please select a location.");
      return;
    }

    setErrorMessage(""); // Clear previous errors

    const url = "http://localhost:5000/api/predict_home_price";
    const payload = {
      total_sqft: parseFloat(sqft),
      bhk: bhk,
      bath: bathrooms,
      location: location,
    };

    axios
      .post(url, payload)  // Sending JSON data
      .then((response) => {
        setEstimatedPrice(response.data.estimated_price);
      })
      .catch((error) => {
        setErrorMessage("Failed to estimate price. Please try again.");
        console.error("Error: ", error.response || error);
      });
  };

  return (
    <div className="container">
      <div className="img"></div>
      <form className="form">
        <h2>Area (Square Feet)</h2>
        <input
          className="area"
          type="text"
          value={sqft}
          onChange={(e) => setSqft(e.target.value)}
        />
        <h2>BHK</h2>
        <div className="switch-field">
          {[1, 2, 3, 4, 5].map((val) => (
            <React.Fragment key={val}>
              <input
                type="radio"
                id={`radio-bhk-${val}`}
                name="uiBHK"
                value={val}
                checked={bhk === val}
                onChange={() => setBhk(val)}
              />
              <label htmlFor={`radio-bhk-${val}`}>{val}</label>
            </React.Fragment>
          ))}
        </div>
      </form>

      <form className="form">
        <h2>Bath</h2>
        <div className="switch-field">
          {[1, 2, 3, 4, 5].map((val) => (
            <React.Fragment key={val}>
              <input
                type="radio"
                id={`radio-bath-${val}`}
                name="uiBathrooms"
                value={val}
                checked={bathrooms === val}
                onChange={() => setBathrooms(val)}
              />
              <label htmlFor={`radio-bath-${val}`}>{val}</label>
            </React.Fragment>
          ))}
        </div>
        <h2>Location</h2>
        <div>
          <select
            className="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="" disabled>
              Choose a Location
            </option>
            {locations.map((loc, index) => (
              <option key={index} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
        <button
          className="submit"
          type="button"
          onClick={handleEstimatePrice}
        >
          Estimate Price
        </button>
        {estimatedPrice && (
          <div className="result">
            <h2>{estimatedPrice} Lakh</h2>
          </div>
        )}
        {errorMessage && (
          <div className="error">
            <p>{errorMessage}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default App;
