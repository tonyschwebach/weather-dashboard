$(document).ready(function () {
  // DOM VARIABLES
  var searchBoxEl = $("#search-box");
  var searchButtonEl = $("#search-button");
  var searchHistoryEl = $("#search-history");
  var locationEl = $("#selected-city");
  var currentConditions = $("#current-conditions");
  var forecastEl = $("#five-day");

  // JAVASCRIPT VARIABLES
  var searchHistory = [];
  var apiKey = "f432f02d81a54e742898a8a15f6316f9";
  var selectedCity = "";

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
    if (searchHistory.indexOf(newCity) === -1) {
      searchHistory.push(newCity);
      // if on the list, move that instance to end of the array so it's first in render
    } else {
      let index = searchHistory.indexOf(newCity);
      searchHistory.splice(index, 1);
      searchHistory.push(newCity);
    }
    localStorage.setItem("storedHistory", JSON.stringify(searchHistory));
  }
  // function to get city coordinates then current weather and forecast
  function locationWeather(city) {
    locationEl.empty();
    let queryURL =
      "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" +
      city +
      "&appid=" +
      apiKey;

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      locationEl.append($("<h3>").text(response.name));
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
      // current day weather
      currentConditions.empty();

      // set date
      let dateString = new Date(response.current.dt * 1000);
      dateString = dateString.toLocaleDateString();
      let currentDate = $("<h3>").text("(" + dateString + ")");
      locationEl.append(currentDate);

      //set icon
      let currentIcon = $("<img>").attr(
        "src",
        iconURL(response.current.weather[0].icon)
      );
      currentIcon.attr("alt", response.current.weather[0].description);
      locationEl.append(currentIcon);

      // get weather readings
      let currentTemp = $("<li>").text(
        "Temperature: " + Math.round(response.current.temp) + " °F"
      );
      let currentHumidity = $("<li>").text(
        "Humidity: " + Math.round(response.current.humidity) + "%"
      );
      let currentWindSpeed = $("<li>").text(
        "Wind Speed: " + Math.round(response.current.wind_speed) + " MPH"
      );
      let currentUV = $("<li>").text("UV Index: ");
      let uvIndex = $("<span>").text(response.current.uvi);
      uvIndex.addClass(uvRating(response.current.uvi));
      currentUV.append(uvIndex);

      currentConditions.append(
        currentTemp,
        currentHumidity,
        currentWindSpeed,
        currentUV
      );
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
      forecastEl.empty();

      // 5 day forecast (daily array 0:8 is 7 day forecast)
      //create card for each day in the forecast
      for (let j = 1; j < 6; j++) {
        let card = $("<div>").addClass(
          "card col-md-2 card-body bg-primary text-white"
        );
        let dateString = new Date(response.daily[j].dt * 1000);
        dateString = dateString.toLocaleDateString();
        let forecastDate = $("<h5>").text(dateString);
        let forecastIcon = $("<img>").attr(
          "src",
          iconURL(response.daily[j].weather[0].icon)
        );

        forecastIcon.attr("alt", response.daily[j].weather[0].description);
        let forecastTemp = $("<p>").text(
          "Temp: " + Math.round(response.daily[j].temp.max) + " °F"
        );
        let forecastHumidity = $("<p>").text(
          "Humidity: " + Math.round(response.daily[j].humidity) + " %"
        );
        card.append(forecastDate, forecastIcon, forecastTemp, forecastHumidity);
        forecastEl.append(card);
      }
    });
  }
  // render search history
  function renderHistory() {
    searchHistoryEl.empty();
    for (let j = 0; j < searchHistory.length; j++) {
      let historyEl = $("<li>").text(searchHistory[j]);
      historyEl.addClass("searched-city"); // for event listener
      historyEl.addClass("list-group-item"); // for bootstrap
      searchHistoryEl.prepend(historyEl);
    }
  }
  // get icon url
  function iconURL(iconCode) {
    var iconURL = "http://openweathermap.org/img/wn/" + iconCode + ".png";
    return iconURL;
  }

  // function to add class for UV index
  function uvRating(uvNumber) {
    if (uvNumber <= 2) {
      return "uv low";
    } else if (uvNumber <= 5) {
      return "uv medium";
    } else if (uvNumber <= 7) {
      return "uv high";
    } else if (uvNumber <= 10) {
      return "uv very-high";
    } else if (uvNumber > 10) {
      return "uv extreme";
    }
  }

  // FUNCTION CALLS
  $("main").hide();
  initHistory();
  renderHistory();

  // EVENT LISTENERS
  // on search click
  searchButtonEl.on("click", function (event) {
    event.preventDefault();
    if (searchBoxEl.val()) {
      newCity = searchBoxEl.val();
      selectedCity = newCity;
      locationWeather(selectedCity);
      storeHistory(newCity);
      renderHistory();
      $("main").show();
      searchBoxEl.val("");
    }
  });
  // on search history click with event delegation
  searchHistoryEl.on("click", ".searched-city", function (event) {
    $("main").show();
    selectedCity = $(this).text();
    locationWeather(selectedCity);
    storeHistory(selectedCity);
    renderHistory();
  });

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
