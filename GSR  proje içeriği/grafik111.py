import serial as sr  # 'serial' modülünü 'sr' olarak adlandırıyoruz
import matplotlib.pyplot as plt
import matplotlib.animation as animation

# Seri port ayarları
SERIAL_PORT = 'COM6'  # Port adı, kendi portunuza göre değiştirin
BAUD_RATE = 9600  # Baud rate, Arduino kodunuzla uyumlu olmalı

# Veri dizileri
time_data = []
gsr_data = []
resistance_data = []
max_data_points = 100  # Ekranda göstermek istediğiniz veri noktası sayısı

# Grafik ayarları
fig, ax1 = plt.subplots()

# İki eksen oluştur
ax2 = ax1.twinx()
ax1.set_xlabel('Zaman (s)')
ax1.set_ylabel('GSR Verisi', color='tab:blue')
ax2.set_ylabel('Direnç (kΩ)', color='tab:red')

# Veri ve çizgi nesneleri
line1, = ax1.plot([], [], 'b-', label='GSR Avg')
line2, = ax2.plot([], [], 'r-', label='Resistance')

def init():
    ax1.set_xlim(0, max_data_points)
    ax1.set_ylim(-1024, 1024)  # GSR değer aralığı, negatif değerler dahil
    ax2.set_ylim(0, 10000)  # Direnç değer aralığı
    return line1, line2

def update(frame):
    try:
        line = ser.readline().decode('utf-8').strip()
        if line:
            data = line.split(',')
            if len(data) == 2:
                gsr_value = float(data[0])
                resistance_value = float(data[1])
                time_data.append(len(time_data))
                gsr_data.append(gsr_value)
                resistance_data.append(resistance_value)

                if len(time_data) > max_data_points:
                    time_data.pop(0)
                    gsr_data.pop(0)
                    resistance_data.pop(0)

                line1.set_data(time_data, gsr_data)
                line2.set_data(time_data, resistance_data)

                ax1.relim()
                ax1.autoscale_view()
                ax2.relim()
                ax2.autoscale_view()

    except Exception as e:
        print(f"Veri okuma hatası: {e}")

    return line1, line2

# Seri portu aç
ser = sr.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)

# Animasyonu başlat
ani = animation.FuncAnimation(fig, update, init_func=init, blit=True, interval=100)

plt.show()
