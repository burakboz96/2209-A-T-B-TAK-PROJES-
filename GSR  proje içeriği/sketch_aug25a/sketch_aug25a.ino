#include <LCD5110_Graph.h>

const int GSR = 0;
int sensorValue = 0;
int gsr_average = 0;

LCD5110 myGLCD(8, 9, 10, 11, 12);

void setup() {
  Serial.begin(9600);
  myGLCD.InitLCD();
}

void loop() {
  long sum = 0;
  for (int i = 0; i < 10; i++) {
    sensorValue = analogRead(GSR);  // GSR sensöründen değeri oku
    sum += sensorValue;
    delay(5);
  }
  gsr_average = sum / 10;  // Ortalama değeri hesapla

  // Seri Monitör'de göster
  Serial.print("gsr_average=");
  Serial.println(gsr_average);

  int human_resistance;
  if (gsr_average > 0) {
    human_resistance = (1024 - gsr_average) * 10000 / gsr_average;
  } else {
    human_resistance = 0;
  }

  Serial.print("human_resistance=");
  Serial.println(human_resistance);

  // LCD Ekranına Yazdır
  myGLCD.clrScr();

  myGLCD.print("GSR Avg:", LEFT, 0);
  myGLCD.printNumI(gsr_average, RIGHT, 0);

  myGLCD.print("Resistance:", LEFT, 20);
  myGLCD.printNumI(human_resistance, RIGHT, 20);

  myGLCD.update();

  delay(500);
}
