$(document).ready(function () {
  console.log("hello world");

  // DOM VARIABLES
  var searchBoxEl = $("#search-box");
  var searchButtonEl = $("#search-button");
  var searchHistoryEl = $("#search-history");

  var currentWeatherEl = $("#current-weather");
  var forecastEl = $("#five-day");

  // JAVASCRIPT VARIABLES
  var searchedCities = ["Philadelphia"];
  var apiKey = "f432f02d81a54e742898a8a15f6316f9";
  var currentCity = "Atlanta";

  // FUNCTION DEFINITIONS
  // initialize search history from local storage

  // add new city to search history and local storage
  function storeHistory(newCity) {
    searchedCities.unshift(newCity);
  }
  // ajax GET current
  function currentWeather() {
    let queryURL =
      "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" +
      currentCity +
      "&appid=" +
      apiKey;

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);

      let location = response.city;
      let currentTemp = response.main.temp;
      let humidity = response.main.humidity;
      let windSpeed = response.wind.speed;
            // let windDirection = response.wind.deg; // TODO add degrees for direction for bonus
      let latitude = response.coord.lat;
      let longitude = response.coord.lon;
      // console.log($(this));
      weather(latitude,longitude);
    });
  }
  // ajax UV index
  // ajax GET 5 day
  // ajax One call API

  function weather(lat,lon) {
    let queryURL =
      "https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=" +
      lat +
      "&lon="+lon+"&exclude=minutely,hourly,alerts&appid=" +
      apiKey;

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      
      // daily data
      let currentTemp = response.current.temp;
      let currentHumidity = response.current.humidity;
      let currentWindSpeed = response.current.wind_speed;
      let currentWindDir= response.current.wind_deg;
      let currentUV=response.current.uvi;
      let currentIcon = response.current.weather.icon;

      // 5 day forecast (daily array 0:8 is 7 day forecast)
      let forecastDays = response.daily;

      for( let j =1; j<6; j++){
        let forecastIcon = response.daily[j].weather[0].icon;
        let forestTemp = response.daily[j].temp.day;
        let forecastHumidity = response.daily[j].humidity;
     

      }

    });

  }
  // render search history
  // render current day
  // render forecast

  // FUNCTION CALLS

  // EVENT LISTENERS
  // on search click
  $("#search-button").on("click", function (event) {
    event.preventDefault();
    newCity = searchBoxEl.val();
    storeHistory(newCity);
    currentCity = newCity;
    currentWeather();
  });
  // on search history click with event delegation

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
