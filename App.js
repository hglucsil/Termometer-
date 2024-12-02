// Importera Firebase-funktioner
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Din Firebase-konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyA6A71DIwrLphGxwz3KI8W6aIOKiWYgdLw",
  authDomain: "i-hetaste-laget-40387.firebaseapp.com",
  databaseURL: "https://i-hetaste-laget-40387-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "i-hetaste-laget-40387",
  storageBucket: "i-hetaste-laget-40387.appspot.com",
  messagingSenderId: "823859085015",
  appId: "1:823859085015:web:44a33377dbe0dd3f017a92",
};






































// // Initialisera Firebase
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

// // Referens till databasen
// const sensorRef = ref(database, 'sensor'); // Pekar till hela "sensor"-noden

// let currentTemperature = null;
// let currentHumidity = null;

// // Lyssna på förändringar i hela "sensor"-noden
// onValue(sensorRef, (snapshot) => {
//   const data = snapshot.val();

//   if (data) {
//     // Hitta den senaste tidsstämpeln
//     const timestamps = Object.keys(data);
//     const latestTimestamp = timestamps[timestamps.length - 1]; // Antar att nycklarna är sorterade

//     const latestData = data[latestTimestamp];
//     currentTemperature = latestData.temperature;
//     currentHumidity = latestData.humidity;

//     // Uppdatera DOM
//     document.getElementById('temperature').textContent = currentTemperature !== null ? currentTemperature : "Ingen data";
//     document.getElementById('humidity').textContent = currentHumidity !== null ? currentHumidity : "Ingen data";

//     // Uppdatera bakgrund och väder
//     if (currentTemperature !== null) {
//       updateBackground(currentTemperature);
//     }
//     DisplayWeather();
//   } else {
//     console.error("Ingen data finns i databasen.");
//     document.getElementById('temperature').textContent = "Ingen data";
//     document.getElementById('humidity').textContent = "Ingen data";
//   }

//   console.log("Hela datan från Firebase:", data);

// });



// // Uppdatera bakgrund och väder
// if (currentTemperature !== null) {
//   updateBackground(currentTemperature);
// }
// DisplayWeather();




// // Funktion för att uppdatera bakgrundsfärg baserat på temperatur
// function calculateRGB(temp, minTemp, maxTemp) {
//   const factor = Math.max(0, Math.min(1, (temp - minTemp) / (maxTemp - minTemp)));
//   return {
//     r: Math.round(130 - 60 * factor),
//     g: Math.round(210 - 130 * factor),
//     b: 255,
//   };
// }

// function updateBackground(temp) {
//   const { r, g, b } = calculateRGB(temp, -10, 40);
//   document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
// }

// // Funktion för att visa väderanimationer
// function DisplayWeather() {
//   const raindrops = document.querySelectorAll('.raindrop');
//   const snowflakes = document.querySelectorAll('.snowflake');

//   if (currentHumidity >= 75) {
//     if (currentTemperature >= 0) {
//       raindrops.forEach(drop => drop.style.display = 'block');
//       snowflakes.forEach(flake => flake.style.display = 'none');
//     } else {
//       raindrops.forEach(drop => drop.style.display = 'none');
//       snowflakes.forEach(flake => flake.style.display = 'block');
//     }
//   } else {
//     raindrops.forEach(drop => drop.style.display = 'none');
//     snowflakes.forEach(flake => flake.style.display = 'none');
//   }
// }



// // Under construction!!  Not working!!