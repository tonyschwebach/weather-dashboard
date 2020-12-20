$(document).ready(function () {
  // DOM VARIABLES
  var searchBoxEl = $("#search-box");
  var searchButtonEl = $("#search-button");
  var searchHistoryEl = $("#search-history");

  var currentWeatherEl = $("#current-weather");
  var forecastEl = $("#five-day");

  // JAVASCRIPT VARIABLES
  var searchHistory = ["Philadelphia"];
  var apiKey = "f432f02d81a54e742898a8a15f6316f9";
  var selectedCity = "Atlanta";
  // var latitude = "";
  // var longitude = "";

  // FUNCTION DEFINITIONS
  // initialize search history from local storage
  function initHistory() {
    let storedHistory = JSON.parse(localStorage.getItem("storedHistory"));
    if (storedHistory) {
      searchHistory = storedHistory;
    }
  }
  // add new city to search history and local storage
  function storeHistory(newCity) {
    // if not in the list add to the end of the history array
    if (searchHistory.indexOf(newCity) === -1){
      searchHistory.push(newCity);
      // if on the list, move that instance to end of the array so it's first in render
    } else{
      let index =searchHistory.indexOf(newCity);
      searchHistory.splice(index,1);
      searchHistory.push(newCity);
    }
  // localStorage.setItem("storedHistory", JSON.stringify(searchHistory));
  }
  // function to get city coordinates then current weather and forecast
  function locationWeather(city) {
    let queryURL =
      "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" +
      city +
      "&appid=" +
      apiKey;

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);

      let location = response.city;
      let latitude = response.coord.lat;
      let longitude = response.coord.lon;

      currentWeather(latitude, longitude);
      forecastWeather(latitude, longitude);
    });
  }

  // function to get current weather data
  function currentWeather(lat, lon) {
    let queryURL =
      "https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=" +
      lat +
      "&lon=" +
      lon +
      "&exclude=minutely,hourly,daily,alerts&appid=" +
      apiKey;

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      // daily data
      currentWeatherEl.show();
      let currentDate = Date(response.current.dt);
      let currentTemp = response.current.temp;
      let currentHumidity = response.current.humidity;
      let currentWindSpeed = response.current.wind_speed;
      let currentWindDir = response.current.wind_deg;
      let currentUV = response.current.uvi;
      let currentIcon = response.current.weather.icon;
      console.log(currentDate);
    });
  }

  // function to get forecast weather
  function forecastWeather(lat, lon) {
    let queryURL =
      "https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=" +
      lat +
      "&lon=" +
      lon +
      "&exclude=current,minutely,hourly,alerts&appid=" +
      apiKey;

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      // 5 day forecast (daily array 0:8 is 7 day forecast)
      console.log(response);
      forecastEl.show();
      let forecastDays = response.daily;

      for (let j = 1; j < 6; j++) {
        let forecastDate = Date(response.daily[j].dt);
        let forecastIcon = response.daily[j].weather[0].icon;
        let forestTemp = response.daily[j].temp.day;
        let forecastHumidity = response.daily[j].humidity;
        console.log(forecastDate);
      }
    });
  }

  // render search history
  function renderHistory() {
    searchHistoryEl.empty();
    for (let j = 0; j < searchHistory.length; j++) {
      console.log(searchHistory[j]);
      let historyEl = $("<li>").text(searchHistory[j]);
      historyEl.addClass("searched-city"); // for event listener
      historyEl.addClass(""); // for bootstrap
      searchHistoryEl.prepend(historyEl);
    }
  }
  // render current day

  // render forecast

  // FUNCTION CALLS
  currentWeatherEl.hide();
  forecastEl.hide();
  // initHistory();

  // EVENT LISTENERS
  // on search click
  searchButtonEl.on("click", function (event) {
    event.preventDefault();
    newCity = searchBoxEl.val();
    storeHistory(newCity);
    selectedCity = newCity;
    locationWeather(selectedCity);
    renderHistory();
  });
  // on search history click with event delegation
  searchHistoryEl.on("click",".searched-city",function(event){
    selectedCity=$(this).text();
    locationWeather(selectedCity);
  })


  // GIVEN a weather dashboard with form inputs
  // WHEN I search for a city
  // THEN I am presented with current and future conditions for that city and that city is added to the search history
  // WHEN I view current weather conditions for that city
  // THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
  // WHEN I view the UV index
  // THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
  // WHEN I view future weather conditions for that city
  // THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
  // WHEN I click on a city in the search history
  // THEN I am again presented with current and future conditions for that city
  // WHEN I open the weather dashboard
  // THEN I am presented with the last searched city forecast
});
