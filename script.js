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
  var apiKey = ""
  var currentCity = "Atlanta";

  // FUNCTION DEFINITIONS
  // initialize search history from local storage

  // add new city to search history and local storage
  function storeHistory(newCity){
    searchedCities.unshift(newCity);
  }
  // ajax GET current
  function currentWeather(){
    var queryURL = "api.openweathermap.org/data/2.5/weather?q="+currentCity+"&appid="+apiKey;
    console.log(queryURL);

  }
  // ajax UV index
  // ajax GET 5 day
  // render search history
  // render current day
  // render forecast

  // FUNCTION CALLS

  // EVENT LISTENERS
  // on search click
  $("#search-button").on("click", function(event) {
    event.preventDefault();
    newCity = searchBoxEl.val();
    storeHistory(newCity);
    currentCity = newCity
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
