#include <Adafruit_NeoPixel.h>

#define LED_PIN_48  48
#define LED_PIN_38  38
#define NUM_LEDS    1
#define FREQ_HZ     2.0 // 2 Hz

// Tạo 2 instance phòng trường hợp chân LED của bo mạch là 48 hoặc 38
Adafruit_NeoPixel pixel48(NUM_LEDS, LED_PIN_48, NEO_GRB + NEO_KHZ800);
Adafruit_NeoPixel pixel38(NUM_LEDS, LED_PIN_38, NEO_GRB + NEO_KHZ800);

const unsigned long halfPeriod = (unsigned long)(1000.0 / FREQ_HZ / 2.0); // 250ms

void setup() {
  Serial.begin(115200);
  delay(500);
  Serial.println("\n[ESP32-S3 N16R8] LED Test Started!");

  // Khởi tạo Adafruit NeoPixel
  pixel48.begin();
  pixel48.setBrightness(150);
  pixel48.clear();
  pixel48.show();

  pixel38.begin();
  pixel38.setBrightness(150);
  pixel38.clear();
  pixel38.show();

  // Khởi tạo RGB Builtin từ ESP32 Core
  #ifdef RGB_BUILTIN
  rgbLedWrite(RGB_BUILTIN, 0, 0, 0);
  #endif
}

void loop() {
  Serial.println("LED ON (Blue)");

  // 1. Dùng Adafruit NeoPixel trên GPIO 48 và GPIO 38
  pixel48.setPixelColor(0, pixel48.Color(0, 0, 255));
  pixel48.show();
  pixel38.setPixelColor(0, pixel38.Color(0, 0, 255));
  pixel38.show();

  // 2. Dùng hàm phần cứng rgbLedWrite của ESP32 Core 3.x
  rgbLedWrite(48, 0, 0, 255);
  rgbLedWrite(38, 0, 0, 255);
  #ifdef RGB_BUILTIN
  rgbLedWrite(RGB_BUILTIN, 0, 0, 255);
  #endif

  delay(halfPeriod);

  Serial.println("LED OFF");

  // Tắt LED
  pixel48.setPixelColor(0, pixel48.Color(0, 0, 0));
  pixel48.show();
  pixel38.setPixelColor(0, pixel38.Color(0, 0, 0));
  pixel38.show();

  rgbLedWrite(48, 0, 0, 0);
  rgbLedWrite(38, 0, 0, 0);
  #ifdef RGB_BUILTIN
  rgbLedWrite(RGB_BUILTIN, 0, 0, 0);
  #endif

  delay(halfPeriod);
}
