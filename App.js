// Importera Firebase-funktioner
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Firebase-konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyA6A71DIwrLphGxwz3KI8W6aIOKiWYgdLw",
  authDomain: "i-hetaste-laget-40387.firebaseapp.com",
  databaseURL: "https://i-hetaste-laget-40387-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "i-hetaste-laget-40387",
  storageBucket: "i-hetaste-laget-40387.appspot.com",
  messagingSenderId: "823859085015",
  appId: "1:823859085015:web:44a33377dbe0dd3f017a92",
};


// Initialisera Firebase 
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const sensorRef = ref(database, 'sensor'); // Referens till "sensor"-noden

let currentTemperature = null;
let currentHumidity = null;

// Temperaturgraf
const tempCtx = document.getElementById('temperatureChart').getContext('2d');
const temperatureLabels = []; // X-axel för temperatur(Datum/tid)
const temperatureData = []; // Temperaturdata

const temperatureChart = new Chart(tempCtx, {
    type: 'line',
    data: {
        labels: temperatureLabels,
        datasets: [{
            label: 'Temperatur (°C)',
            data: temperatureData,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
            tension: 0.2
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Luftfuktighetsgraf
const humidityCtx = document.getElementById('humidityChart').getContext('2d');
const humidityLabels = []; // X-axel för luftfuktighet
const humidityData = []; // Luftfuktighetsdata

const humidityChart = new Chart(humidityCtx, {
    type: 'line',
    data: {
        labels: humidityLabels,
        datasets: [{
            label: 'Luftfuktighet (%)',
            data: humidityData,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
            tension: 0.2
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Funktion för att formatera tidsstämpeln
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1)
  const day = String(date.getUTCDate())
  const hours = String(date.getUTCHours()).padStart(2, '0'); 
  const minutes = String(date.getUTCMinutes()).padStart(2, '0'); 
  const seconds = String(date.getUTCSeconds()).padStart(2, '0'); // Används inte, men finns om jag vill ha mer exakta tidpunkter

    return `${day}/${month}-${year}__${hours}:${minutes}`;
}

// Lyssna på förändringar i Firebase och uppdatera båda graferna
onValue(sensorRef, (snapshot) => {
    const data = snapshot.val();

    if (data) {
        const timestamps = Object.keys(data); // Hämtar alla tidsstämplar

        // Sortera tidsstämplarna för att få de senaste
        timestamps.sort(); 
        const latestTimestamps = timestamps.slice(-50); 

        // Töm graferna för att fylla med de senaste 50 värdena
        temperatureLabels.length = 0;
        temperatureData.length = 0;
        humidityLabels.length = 0;
        humidityData.length = 0;

        latestTimestamps.forEach(timestamp => {
            const currentData = data[timestamp];

            currentTemperature = currentData.temperature;  
            currentHumidity = currentData.humidity;  

            // Formatera tidsstämpeln och lägg till i graferna
            const formattedTimestamp = formatTimestamp(timestamp);
            temperatureLabels.push(formattedTimestamp);
            temperatureData.push(currentTemperature);
            humidityLabels.push(formattedTimestamp);
            humidityData.push(currentHumidity);
        });

        // Uppdatera DOM
        document.getElementById('temperature').textContent = currentTemperature !== null ? currentTemperature : "Ingen data";
        document.getElementById('humidity').textContent = currentHumidity !== null ? currentHumidity : "Ingen data";

        // Uppdatera graferna
        temperatureChart.update();
        humidityChart.update();

        // Uppdatera bakgrund och väder  
        if (currentTemperature !== null) {
            updateBackground(currentTemperature);
        }
        DisplayWeather();
    } else {
        document.getElementById('temperature').textContent = "Ingen data";
        document.getElementById('humidity').textContent = "Ingen data";
    }
});


// Funktion för att uppdatera bakgrundsfärg baserat på temperatur
function calculateRGB(temp, minTemp, maxTemp) {
  const factor = Math.max(0, Math.min(1, (temp - minTemp) / (maxTemp - minTemp)));
  return {
    r: Math.round(130 - 60 * factor),
    g: Math.round(210 - 130 * factor),
    b: 255,
  };
}

function updateBackground(temp) {
  const { r, g, b } = calculateRGB(temp, -10, 40);
  document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

// Funktion för att visa väderanimationer
function DisplayWeather() {
  const raindrops = document.querySelectorAll('.raindrop');
  const snowflakes = document.querySelectorAll('.snowflake');

  if (currentHumidity >= 75) {
    if (currentTemperature >= 0) {
      raindrops.forEach(drop => drop.style.display = 'block');
      snowflakes.forEach(flake => flake.style.display = 'none');
    } else {
      raindrops.forEach(drop => drop.style.display = 'none');
      snowflakes.forEach(flake => flake.style.display = 'block');
    }
  } else {
    raindrops.forEach(drop => drop.style.display = 'none');
    snowflakes.forEach(flake => flake.style.display = 'none');
  }
}
