#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "MattoHotspot";
const char* password = "matto123";

WebServer server(80);

/* Latest values received from STM32 */
int tempC = 0;
int humRH = 0;
int dhtOk = 0;
int soundDetected = 0;
int fireDetected = 0;
int motionDetected = 0;
int distanceCm = -1;
int buzzerState = 0;
int relayState = 0;
String rawLine = "";
unsigned long lastRxMillis = 0;

/* ---------- Parser ---------- */
int getIntField(const String& line, const String& key, int defaultValue)
{
  int start = line.indexOf(key + "=");
  if (start < 0) return defaultValue;

  start += key.length() + 1;
  int end = line.indexOf(';', start);
  if (end < 0) end = line.length();

  return line.substring(start, end).toInt();
}

void parseLine(const String& line)
{
  rawLine = line;
  tempC          = getIntField(line, "TEMP", tempC);
  humRH          = getIntField(line, "HUM", humRH);
  dhtOk          = getIntField(line, "DHT", dhtOk);
  soundDetected  = getIntField(line, "SOUND", soundDetected);
  fireDetected   = getIntField(line, "FIRE", fireDetected);
  motionDetected = getIntField(line, "MOTION", motionDetected);
  distanceCm     = getIntField(line, "DIST", distanceCm);
  buzzerState    = getIntField(line, "BUZZER", buzzerState);
  relayState     = getIntField(line, "RELAY", relayState);

  lastRxMillis = millis();
}

/* ---------- Web endpoints ---------- */
void handleRoot()
{
  String html = "<!DOCTYPE html><html><head><meta charset='UTF-8'>";
  html += "<meta name='viewport' content='width=device-width, initial-scale=1.0'>";
  html += "<meta http-equiv='refresh' content='2'>";
  html += "<title>Infant Monitor</title></head><body>";
  html += "<h1>Infant Monitor</h1>";
  html += "<p><b>Temperature:</b> " + String(tempC) + " C</p>";
  html += "<p><b>Humidity:</b> " + String(humRH) + " %</p>";
  html += "<p><b>DHT OK:</b> " + String(dhtOk) + "</p>";
  html += "<p><b>Sound:</b> " + String(soundDetected) + "</p>";
  html += "<p><b>Fire:</b> " + String(fireDetected) + "</p>";
  html += "<p><b>Motion:</b> " + String(motionDetected) + "</p>";
  html += "<p><b>Distance:</b> " + String(distanceCm) + " cm</p>";
  html += "<p><b>Buzzer:</b> " + String(buzzerState) + "</p>";
  html += "<p><b>Relay:</b> " + String(relayState) + "</p>";
  html += "<p><b>Last update:</b> " + String((millis() - lastRxMillis) / 1000) + " s ago</p>";
  html += "<p><b>Raw:</b> " + rawLine + "</p>";
  html += "<p><a href='/data'>JSON endpoint</a></p>";
  html += "</body></html>";

  server.send(200, "text/html", html);
}

void handleData()
{
  server.sendHeader("Access-Control-Allow-Origin", "*");

  String json = "{";
  json += "\"temp\":" + String(tempC) + ",";
  json += "\"hum\":" + String(humRH) + ",";
  json += "\"dhtOk\":" + String(dhtOk) + ",";
  json += "\"sound\":" + String(soundDetected) + ",";
  json += "\"fire\":" + String(fireDetected) + ",";
  json += "\"motion\":" + String(motionDetected) + ",";
  json += "\"distance\":" + String(distanceCm) + ",";
  json += "\"buzzer\":" + String(buzzerState) + ",";
  json += "\"relay\":" + String(relayState) + ",";
  json += "\"lastUpdateMs\":" + String(lastRxMillis);
  json += "}";

  server.send(200, "application/json", json);
}

void setup()
{
  Serial.begin(115200);
  delay(1000);

  Serial.println("ESP32 booting...");
  WiFi.mode(WIFI_STA);
  WiFi.disconnect(true, true);
  delay(1000);

  Serial.println("Scanning WiFi...");
  int n = WiFi.scanNetworks();

  if (n == 0)
  {
    Serial.println("No WiFi networks found");
  }
  else
  {
    Serial.println("Networks found:");
    for (int i = 0; i < n; i++)
    {
      Serial.print(i + 1);
      Serial.print(": ");
      Serial.print(WiFi.SSID(i));
      Serial.print("  RSSI=");
      Serial.println(WiFi.RSSI(i));
    }
  }

  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  int tries = 0;
  while (WiFi.status() != WL_CONNECTED && tries < 30)
  {
    delay(500);
    Serial.print(".");
    tries++;
  }

  Serial.println();

  if (WiFi.status() == WL_CONNECTED)
  {
    Serial.println("WiFi connected");
    Serial.print("ESP32 IP: ");
    Serial.println(WiFi.localIP());

    server.on("/", handleRoot);
    server.on("/data", handleData);
    server.begin();

    Serial.println("Web server started");
  }
  else
  {
    Serial.print("WiFi failed, status = ");
    Serial.println(WiFi.status());
  }
}

void loop()
{
  server.handleClient();

  static String line = "";

  while (Serial.available())
  {
    char c = (char)Serial.read();

    if (c == '\n')
    {
      line.trim();
      if (line.length() > 0)
      {
        parseLine(line);
      }
      line = "";
    }
    else
    {
      line += c;
    }
  }
}