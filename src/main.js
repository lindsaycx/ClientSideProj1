import "./../sass/styles.scss";
import { getJSONData } from "./Toolkit";
import { Spinner } from "spin.js";
import "spin.js/spin.css";
import StorageManager from "./Toolkit";

// makes a variable from StorageManager function
const storageManager = new StorageManager();
// defines a variable to store the cities.json url
const cityURL = "http://localhost:3000/cities.json";
// a variable to store JSON data fetched from cities.json url
let jsonData;
// used for debugging of theres an issue with cities.json
console.log(cityURL);

// adds the spinner and declares it on top of my loading overlay
let spinner = new Spinner({ color:"#FF00FF", lines: 12 });
spinner.spin(document.querySelector(".g-loading-overlay"));

// function used to populate the cities.json dropdown
function populateDropdown(){
    
    // retrieves the g-dropdown id from html and assigns it to a var
    const dropdown = document.getElementById("g-dropdown");
    // retrieves the names of the cities from my jsonData
    const cities = jsonData.data.cities;
    
    // loops through each city in the cities.json data
    for (let i = 0; i < cities.length; i++) {
        const city = cities[i]; // selects the current city from the array
        const option = document.createElement("option"); // creates a temporary element
        option.value = `${city.name}, ${city.province}`; // assigns the city name and province to the value of option
        option.textContent = `${city.name}, ${city.province}`; // changes the value of option to city and province
        dropdown.appendChild(option); // adds the option to g-dropdown
    }
    
    // unpacks the selected city variable, brackets are needed as js' destructuring syntax
    let [chosenLocation] = storageManager.read("chosenLocation");
    
    // if there is no selected city, dropdown options default to the first option
    if (!chosenLocation){
        chosenLocation = dropdown.options[0].value;
        // storage manager changes slected city to the first dropdown option
        storageManager.write("chosenLocation", chosenLocation);
    }
    // changes whatever the value of dropdown is to the chosen city
    dropdown.value = chosenLocation;
    
    // makes a var of city and province and splits so they are 2 seperate variables
    const [cityName, province] = chosenLocation.split(",");
    fetchWeatherData(cityName, province); // calls the fetching function to get the info for the city
    
    // event handler for dropdown, so when user changes it's selection, everything updates
    dropdown.addEventListener("change", function(e){
        const chosenLocation = e.target.value; // makes chosenLocation it's target value, target refers to the dropdown element
        const [cityName, province] = chosenLocation.split(","); // remakes the city and province variable and splits it
        storageManager.write("chosenLocation", chosenLocation); // writes the selected city to the chosen province
        
        fetchWeatherData(cityName, province); // fetchs the weather data to get city info
    });
    
}

// function that gets weather info using the city and province name with a weather API
function fetchWeatherData(cityName, province) {
    
    // makes a temporary class to gray out screen when loading
    document.querySelector(".s-content").classList.add("loading");
    
    // declaring my api key and URL of OpenWeather
    const apiKey = "b72cc735f44d7a19071de521d1860f06";
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
    
    //uses getJSONData function to fetch data from given URL, weatherData is the successful fetch callback, error is failure callback
    getJSONData(weatherURL, // my weather URL defined above
        (weatherData) => { // name of successful callback
            // used for debugging, prints weatherData in console
            console.log(weatherData);
            
            // checks to see if weatherdata is NOT found
            if (!weatherData.weather){
                const dataError = document.getElementById("s-dataError"); // taregts dataError in html
                dataError.innerHTML = "City not found :("; // adds erro message to the html
                // removes all content
                document.querySelector(".s-content").classList.remove("loading");
                document.getElementById("s-weatherDisplay").innerHTML = "";
                document.getElementById("s-temp").innerHTML = "";
                document.getElementById("s-visibility").innerHTML = "";
                document.getElementById("s-humidity").innerHTML = "";
                document.getElementById("s-air").innerHTML = "";
                document.getElementById("s-wind").innerHTML = "";
                return; // exit function because weather isn't valid
            } else{
                //sets dataError to blank if data is found
                const dataError = document.getElementById("s-dataError");
                dataError.innerHTML = "";
                
                // gets description from first element in the weather list
                const description = weatherData.weather[0].description;
                const weatherDisplay = document.getElementById("s-weatherDisplay"); // targets weatherDispla in html
                // adds icon base on ID, description based on weather list, city and province, to weaterDisplay html
                weatherDisplay.innerHTML = `<i class = "wi wi-owm-${weatherData.weather[0].id}"></i>\n${description}\n${cityName}, ${province}`;
                
                // retreives temperature info from API 
                const tempCurrent = weatherData.main.temp;
                const tempLow = weatherData.main.temp_min;
                const tempHigh = weatherData.main.temp_max;
                const tempFeel = weatherData.main.feels_like;
                const temp = document.getElementById("s-temp"); // targets temp in html
                // adds icons, and temp info to html
                temp.innerHTML = `<i class="wi wi-thermometer"></i><strong>Temperature</strong>\n${tempCurrent}°C Current\n${tempLow}°C Low\n${tempHigh}°C High\nFeels like ${tempFeel}°C`;
                
                // gets visibility info, targets visibility in html, adds icon and current visibility
                const visibilityCurrent = weatherData.visibility;
                const visibility = document.getElementById("s-visibility");
                visibility.innerHTML = `<i class="wi wi-horizon"></i><strong>Visibility</strong>\n${visibilityCurrent}m`;
                
                // gets humidity info, targets humidity in html, adds icon and current humidity
                const humidityCurrent = weatherData.main.humidity;
                const humidity = document.getElementById("s-humidity");
                humidity.innerHTML = `<i class="wi wi-humidity"></i><strong>Humidity</strong>\n${humidityCurrent}%`;
                
                // gets air pressure info, targets air pressure in html, adds icon and current air pressure
                const airPressure = weatherData.main.pressure;
                const air = document.getElementById("s-air");
                air.innerHTML = `<i class="wi wi-barometer"></i><strong>Air Pressure</strong>\n${airPressure} hPa`;
                
                // gets degrees info, targets wind in html, adds wind icon depending on the degrees, then adds current degrees and wind speed
                const windDegrees = weatherData.wind.deg;
                const windSpeed = weatherData.wind.speed;
                const wind = document.getElementById("s-wind");
                wind.innerHTML = `<i class="wi wi-wind towards-${windDegrees}-deg"></i><strong>Wind</strong>\n${windDegrees}°\n${windSpeed} km/h speed`;
            }
            
            // removes the loading screen since it loaded
            document.querySelector(".s-content").classList.remove("loading");
        
        },
        (error) => { // error call back to catch any errors 
            console.log("Error fetching weather data:", error);  // error message in console to debug        
        }
    
    );
}

// callback function from toolkit to handle the success of leading cities.json
function success(data){
    console.log("JSON data loaded:", data);
    jsonData = data; // assigns jsonData to the actual data processed
    if (jsonData.data.cities.length > 0){ // if jsonData isnt empty
        populateDropdown(); // calls dropdown menu to handle all info
        document.querySelector(".g-loading-overlay").style.display = "none"; // takes off overlay
    } else {
        // logs an error message, not needed but you cant be too careful :)
        console.error("No cities found in JSON data.");
    }
}

// if failed, send error message to console and thros the error to stop execution
function failure(error) {
    console.log(`error: ${error.message}`);
    throw error;
}

// main function to process fetching cities, success, and failure
function main() {
    getJSONData(cityURL, success, failure);
}

// RUN RUN RUN
main();