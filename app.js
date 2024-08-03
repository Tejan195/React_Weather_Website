const toggle = document.getElementById('darkModeToggle');
const moonIcon = document.getElementById('moonIcon');
const sunIcon = document.getElementById('sunIcon');
const API_KEY = "3bd69578ab43c1a20c22ec17a6931867";
const location_live = document.getElementById('location-live');
const location_time = document.getElementById('location-time');
const location_date = document.getElementById('location-date');
const temp = document.getElementById('temperature');
const feeltemp = document.getElementById('feelTemp');
const weatherConditon = document.getElementById('weatherCondition');
const humidity = document.getElementById('humidity');
const windspeed = document.getElementById('windspeed');
const pressure = document.getElementById('pressure');
const clouds = document.getElementById('cloud');
const forecast = document.querySelector('.forecast li');
const inputCity = document.getElementById('inputCity');
const searchBtn = document.getElementById('searchBtn');
const currentLocationBtn = document.getElementById('currentLocationBtn');
let hourly = [],
    daily = [];
let weather = '';
let timeZone = 0;

const fetchWeatherData = async (city) => {
    const BASE_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
            throw new Error("Response from Network was not ok");
        }
        const data = await response.json();
        console.log(data);
        displayWeatherData(data);
    } catch (error) {
        console.error("Fetching data problem", error);
        alert("input valid location");
    }
};

const displayWeatherData = (data) => {
    location_live.textContent = data.name;
    temp.textContent = `${data.main.temp}`;
    weatherConditon.textContent =`${data.weather[0].main}`;
    feeltemp.innerHTML = `<p id="feelTemp">Feels like: ${data.main.feels_like}°C</p>`;
    humidity.textContent = `${data.main.humidity}%`;
    windspeed.textContent = `${data.wind.speed} km/h`;
    pressure.textContent = `${data.main.pressure} hPa`;
    clouds.textContent = `${data.clouds.all}%`;
    weather=data.weather[0].description;
    timeZone = data.timezone;
    updatetime();
    updateSunRiseSet(data);
    updateBg(weather);
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'block';
};

const updatetime = () => {
    const now = new Date();
    const localTime = new Date(now.getTime()+(timeZone*1000));
    const hours = localTime.getHours();
    const minutes = localTime.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;
    location_time.innerHTML = `${formattedHours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;

    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayOfWeek = weekDays[now.getDay()];
    const day = localTime.getDate();
    const month = months[localTime.getMonth()];
    const year = localTime.getFullYear();
    location_date.textContent = `${dayOfWeek}, ${day < 10 ? '0' + day : day} ${month}`;
};

setInterval(updatetime, 60000);

const updateWeatherTimely = (city) => {
    fetchWeatherData(city);
    setInterval(() => {
        fetchWeatherData(city);
    }, 900000);
};

const fetchHrAndDl = async (city) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Response from Network was not ok");
        }
        const data = await response.json();
        console.log(data);
        hourly = data.list.filter((_, index) => index < 8).slice(0,5);
        daily = data.list.filter((_, index) => index % 8 === 0).slice(0, 5);
        updateTabs(hourly, daily);
    } catch (error) {
        console.error("Fetching data problem", error);
    }
};
const weatherIcon = {
    "clear sky":"fa-sun",
    "few clouds":"fa-cloud-sun",
    "scattered clouds":"fa-cloud",
    "broken clouds":"fa-cloud",
    "shower rain":"fa-cloud-showers-heavy",
    "rain":"fa-cloud-showers-heavy",
    "light rain":"fa-cloud-showers-heavy",
    "thunderstorm":"fa-bolt",
    "snow":"fa-snowflake",
    "mist":"fa-smog"
};
const updateTabs = (hourly, daily) => {
    const dailyContainer = document.getElementById('daily');
    const hourlyContainer = document.getElementById('hourly');

    dailyContainer.innerHTML = '';
    hourlyContainer.innerHTML = '';
    dailyContainer.innerHTML = `<h5 class="card-title">5 Days Forecast:</h5>
                                <ul class="forecast list-unstyled">
                                    ${daily.map(day => {
                                        const date = new Date(day.dt * 1000);
                                        const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });
                                        const formattedDate = date.getDate();
                                        const month = date.toLocaleDateString('en-US', { month: 'short' });
                                        const weatherICon = weatherIcon[day.weather[0].description]||'fa-cloud';
                                        return `<li>
                                                    <i class="fas ${weatherICon}"></i> ${day.main.temp}°C
                                                    <span class="float-right">${dayOfWeek}, ${formattedDate} ${month}</span>
                                                </li>`;
                                    }).join('')}
                                </ul>`;

                                hourlyContainer.innerHTML = `<h5 class="card-title">Hourly Forecast:</h5>
                                <div class="d-flex justify-content-between">
                                    ${hourly.map(hour => {
                                       const date = new Date(hour.dt * 1000);
                                       const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
                                       const weatherICon = weatherIcon[hour.weather[0].description]||'fa-cloud';
                                       console.log(hour.weather[0].description);
                                       return `<div class="text-center">
                                                   <small>${time}</small><br>
                                                   <i class="fas ${weatherICon}"></i><br>
                                                   <small>${hour.main.temp}°C</small><br>
                                                   <small>${hour.wind.speed} km/h</small>
                                               </div>`;
                                    }).join('')}
                                </div>`;
};
const updateSunRiseSet =(data)=>{
    const sunrise = document.getElementById('Sunrise');
    const sunset = document.getElementById('Sunset');

    const sunRiseDate = new Date(data.sys.sunrise*1000);
    const sunSetDate = new Date(data.sys.sunset*1000);
    const sunRiseTime = sunRiseDate.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',hour12:true});
    const sunSetTime = sunSetDate.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',hour12:true});
    sunrise.innerHTML=`<i class="fas fa-sunrise"></i> Sunrise: ${sunRiseTime}`;
    sunset.innerHTML = `<i class="fas fa-sunset"></i> Sunset: ${sunSetTime}`;
}
const fetchWeatherDataByCoords=async (lat,lon)=>{
    const BASE_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    try{
        const response = await fetch(BASE_URL);
        if(!response.ok){
            throw new Error("Response form the Network was not Ok");
        }
        const data = await response.json();
        console.log(data);
        displayWeatherData(data);
    }catch(error){
        console.error("Fetching data problem",error);
    }
};
searchBtn.addEventListener('click',()=>{
    const city = inputCity.value;
    if(city){
        localStorage.setItem('lastSearchedCity',city);
    fetchWeatherData(city);
    fetchHrAndDl(city);
    updateWeatherTimely(city);
    }
});
document.addEventListener('DOMContentLoaded', () => {
    applySavedTheme();
    const lastSearchedCity = localStorage.getItem('lastSearchedCity');
    if(lastSearchedCity){
        fetchWeatherData(lastSearchedCity);
        fetchHrAndDl(lastSearchedCity);
        updateWeatherTimely(lastSearchedCity);
    }else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherDataByCoords(latitude, longitude);
            setInterval(() => {
                fetchWeatherDataByCoords(latitude, longitude);
            }, 900000);
        }, error => {
            console.error("Error getting location", error);
            const defaultCity = "New Delhi";
            fetchWeatherData(defaultCity);
            fetchHrAndDl(defaultCity);
            updateWeatherTimely(defaultCity);
        });
    } else {
        const defaultCity = "New Delhi";
        fetchWeatherData(defaultCity);
        fetchHrAndDl(defaultCity);
        updateWeatherTimely(defaultCity);
        console.error("Geolocation is not supported by this browser");
    }
});
const updateBg=(weather)=>{
    const body = document.body;
    body.classList.remove('clear-weather','cloudy-weather','rainy-weather');
    if(weather.includes('clear')){
        body.classList.add('clear-weather');
    }else if(weather.includes('cloud')){
        body.classList.add('cloudy-weather');
    }else if(weather.includes('rain')){
        body.classList.add('rainy-weather');
    }else{
        body.classList.add('clear-weather');
    }
    if(body.classList.contains('dark-mode')){
        body.classList.add('dark-mode');
    }
};
const applySavedTheme=()=>{
    const darkMode = localStorage.getItem('darkMode')==='true';
    if(darkMode){
        document.body.classList.add('dark-mode');
        moonIcon.style.display='none';
        sunIcon.style.display='inline';
    }else{
        document.body.classList.remove('dark-mode');
        moonIcon.style.display='inline';
        sunIcon.style.display='none';
    }
};

const saveThemePreferences=(isDarkMode)=>{
    localStorage.setItem('darkMode',isDarkMode ? 'true':'false');
};

currentLocationBtn.addEventListener('click',()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position=>{
            const{latitude,longitude}=position.coords;
            fetchWeatherDataByCoords(latitude,longitude);
            setInterval(()=>{
                fetchWeatherDataByCoords(latitude,longitude);
            },900000);
        },error=>{
            console.error("Error getting location",error);
            const defaultCity = "New Delhi";
            fetchWeatherData(defaultCity);
            fetchHrAndDl(defaultCity);
            updateWeatherTimely(defaultCity);
        });
    }else{
        console.error("Geolocation is not supported by this browser");
    }
});
toggle.addEventListener('click', () => {
   const isDarkMode = document.body.classList.toggle('dark-mode');
    if (moonIcon.style.display === 'none') {
        moonIcon.style.display = 'inline';
        sunIcon.style.display = 'none';
    } else {
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'inline';
    }
    saveThemePreferences(isDarkMode);
    updateBg(weather);
});
