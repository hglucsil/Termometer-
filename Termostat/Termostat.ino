#include <FirebaseESP8266.h>
#include <ESP8266WiFi.h>
#include <Wire.h>
#include <AM2320.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <TimeLib.h> // Lägg till TimeLib för hantering av tid

#define FIREBASE_HOST "https://i-hetaste-laget-40387-default-rtdb.europe-west1.firebasedatabase.app/"
#define FIREBASE_AUTH "AIzaSyA6A71DIwrLphGxwz3KI8W6aIOKiWYgdLw"

#define WIFI_SSID "Hitachigymnasiet_2.4"
#define WIFI_PASSWORD "mittwifiarsabra"

AM2320 sensor;

float SensorTemp;
float SensorHum;

FirebaseData firebaseData;

// Skapa NTP-klient för att hämta tid
WiFiUDP ntpUDP;

// Justera till din tidszon (UTC+1 för Sverige under vintertid)
// För sommartid (UTC+2) kan du sätta offset till 7200 istället för 3600.
NTPClient timeClient(ntpUDP, "pool.ntp.org", 3600, 60000); // UTC+1 (1 timmes förskjutning)

void setup() {
  Serial.begin(9600);
  Wire.begin(14, 12);
  delay(5000);

  // WiFi-anslutning
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(2000);
    Serial.println("Connecting to Wi-Fi...");
  }
  Serial.println("Connected to Wi-Fi!");

  // Initiera Firebase
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);

  // Initiera NTP-klient
  timeClient.begin();
}

void getTempHum() {
  if (sensor.measure()) {
    SensorTemp = sensor.getTemperature();
    SensorHum = sensor.getHumidity();

    Serial.print("Temperature: ");
    Serial.println(SensorTemp);
    Serial.print("Humidity: ");
    Serial.println(SensorHum);

    if (SensorTemp > 27) {
      Serial.println("Dålig andedräkt!!!!");
    }
  } else {
    int errorCode = sensor.getErrorCode();
    switch (errorCode) {
      case 1: Serial.println("ERR: Sensor is offline"); break;
      case 2: Serial.println("ERR: CRC validation failed."); break;
    }
  }
}

String getTimestamp() {
  timeClient.update(); // Uppdatera tid från NTP
  unsigned long epochTime = timeClient.getEpochTime(); // Hämta tid som Unix-tid

  // Använd TimeLib för att konvertera Unix-tiden till ett korrekt datum
  setTime(epochTime);  // Sätt tiden med epoch-tid från NTP

  // Hämta år, månad, dag, timme, minut och sekund från TimeLib
  int currentYear = year();
  int currentMonth = month();
  int currentDay = day();
  int currentHours = hour();
  int currentMinutes = minute();
  int currentSeconds = second();

  // Skapa en fullständig ISO 8601-sträng med sekunder och tidszon (UTC)
  char timestamp[40];
  sprintf(timestamp, "%04d-%02d-%02dT%02d:%02d:%02dZ", currentYear, currentMonth, currentDay, currentHours, currentMinutes, currentSeconds);
  return String(timestamp);
}


void sendToFirebase(float temp, float hum) {
  String timestamp = getTimestamp(); // Hämta aktuell tidsstämpel
  Serial.println("Timestamp: " + timestamp);

  // Skapa en JSON-struktur
  FirebaseJson json;
  json.set("temperature", temp);
  json.set("humidity", hum);

  // Skicka data till Firebase under en ny nod baserat på tidsstämpeln
  if (Firebase.setJSON(firebaseData, "/sensor/" + timestamp, json)) {
    Serial.println("Data sent to Firebase with timestamp: " + timestamp);
  } else {
    Serial.print("Failed to send data: ");
    Serial.println(firebaseData.errorReason());
  }
}

void loop() {
  getTempHum();
  sendToFirebase(SensorTemp, SensorHum);
  delay(300000); // Vänta 5 minut innan nästa mätning
}
