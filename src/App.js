import React, { useState } from "react";

const months = [
  "January",
  "Frebruary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const api = {
  key: "7bbf9714ee5c41ecd0e837e748fe573f",
  base: "https://api.openweathermap.org/data/2.5/",
};

function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});

  const dateBuilder = (date) => {
    const day = days[date.getDay()];
    const numberOfDay = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${numberOfDay} ${month} ${year}`;
  };

  const search = (evt) => {
    if (query === "") return;
    if (evt.key === "Enter") {
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then((res) => res.json())
        .then((result) => {
          setQuery("");
          setWeather(result);
          console.log(result);
        });
    }
  };

  const getWeatherClass = () => {
    if (typeof weather.main !== "undefined") {
      const weatherState = weather.weather[0].main.toLowerCase();
      switch (weatherState) {
        case "clouds":
          return "app clouds";
        case "sunny":
          return "app sunny";
        case "rain":
          return "app rain";
        case "snow":
          return "app snow";
        case "clear":
          return "app clear";
        default:
          return "app";
      }
    }
    return "app";
  };

  const printErrorMessage = () => {
    return (
      <div className="error-box">
        <div className="error-message">404: {weather.message}</div>
      </div>
    );
  };

  const printWeatherData = () => {
    return (
      <div>
        <div className="location-box">
          <div className="location">
            {weather.name} {weather.sys.country}
          </div>
          <div className="date">{dateBuilder(new Date())}</div>
        </div>
        <div className="weather-box">
          <div className="temp">{Math.round(weather.main.temp)}*C</div>
          <div className="weather">{weather.weather[0].main}</div>
        </div>
      </div>
    );
  };

  const printTime = () => {
    const timeShift = weather.timezone / 3600;

    let hours = new Date().getUTCHours() + timeShift;
    const hoursFraction = hours % 1;
    const leftMinutes = hoursFraction * 60;
    let minutes = new Date().getUTCMinutes() + leftMinutes;

    if (minutes >= 60) {
      hours += Math.floor(minutes / 60);
      minutes = minutes % 60;
    }

    return (
      <div className="time-box">
        <div className="time-info">
          Current time:{" "}
          <em>
            {Math.floor(hours)}:{minutes}
          </em>
        </div>
      </div>
    );
  };

  return (
    <div className={getWeatherClass()}>
      <main className="main">
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search..."
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            onKeyDown={search}
          />
        </div>
        {weather.cod
          ? weather.cod === "404"
            ? printErrorMessage()
            : printWeatherData()
          : ""}
        {weather.timezone ? printTime() : ""}
      </main>
    </div>
  );
}

export default App;
