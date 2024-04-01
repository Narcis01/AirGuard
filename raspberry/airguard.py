import time
import adafruit_ads1x15.ads1115 as ADS
import board
import busio
from adafruit_ads1x15.analog_in import AnalogIn
from sht20 import SHT20
import smbus2
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


postUrl = "http://localhost:3000/api/v1/post"

dust_analog_pin = 0
sht20_address = 0x40
bh1750_address = 0x23

bus = smbus2.SMBus(1)
i2c = busio.I2C(board.SCL, board.SDA)
ads = ADS.ADS1115(i2c)
dust = AnalogIn(ads, ADS.P0)
mq_8 = AnalogIn(ads, ADS.P1)


def convert_to_dust_density(analog_value):
    if analog_value < 0:
        value = (1940 - analog_value) * 0.0256
    else:
        value = (1940 + analog_value) * 0.0256

    return round(value * 0.01, 2)

def convert_to_ppm(voltage):
    reference_voltage = 5000.0  
    a = 1.0  
    b = 0.5 
    c = 2.0 
    ratio = voltage / reference_voltage
    
    concentration_ppm = a * (ratio / b) ** c
    
    return round(concentration_ppm, 2)




while True:
    try:
        sht20 = SHT20(1, resolution=SHT20.TEMP_RES_14bit)
        bh1750 = bus.read_i2c_block_data(bh1750_address, 0x20, 2)
        temperature = round(sht20.read_temp(),2)
        humidity = round(sht20.read_humid(),2)
        light_level = (bh1750[0] << 8) + bh1750[1]
        lux = round(light_level / 1.2, 2)
        dust_value = convert_to_dust_density(dust.value)
        co2 = convert_to_ppm(mq_8.value)
        print("\nTemperature: %0.1f C" % sht20.read_temp())
        print("Humidity: %0.1f %%" % sht20.read_humid())
        print("Light level: %0.1f  lux" % lux)
        print(f"Dust value: {dust_value}")
        print(f"Gas value: {co2}\n")
        data = {
                "temperature": temperature,
                "humidity": humidity,
                "light": lux,
                "co2": co2,
                "dust": dust_value,
                "address": "65f70067cc963d2a27708618"
            }
        requests.post(postUrl, json=data)
        session = requests.Session()
        retry = Retry(connect=3, backoff_factor=0.5)
        adapter = HTTPAdapter(max_retries=retry)
        session.mount('http://', adapter)
        session.mount('https://', adapter)

        session.post(postUrl, json=data)

        time.sleep(60)
    except Exception as error:
        print("Error while trying to read and send data:", error); 
        time.sleep(5)

