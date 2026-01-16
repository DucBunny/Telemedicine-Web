import threading
import time
import random
import json
import numpy as np
import paho.mqtt.client as mqtt
import config


class VirtualESP32(threading.Thread):
    def __init__(self, device_id, data_normal, data_sick):
        super().__init__()
        self.device_id = device_id
        self.mode = "NORMAL"
        self.running = True

        # Store normal and sick data
        self.data_normal = data_normal
        self.data_sick = data_sick

        # Each device has its own MQTT client
        self.client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, device_id)
        self.client.on_connect = self.on_connect
        self.client.connect(config.BROKER, config.PORT, 60)
        self.topic_pub = f"health/{device_id}/telemetry"

    def on_connect(self, client, userdata, flags, reason_code, properties):
        if reason_code == 0:
            print(f"+ [{self.device_id}] Connected to Broker!")
        else:
            print(f"- [{self.device_id}] Connect failed: {reason_code}")

    def set_mode(self, new_mode):
        self.mode = new_mode
        print(f"[{self.device_id}] Changed mode -> {new_mode}")

    def generate_vital_signs(self):
        # Generate vital signs based on the current mode
        if self.mode == "DANGER":
            bpm = random.randint(120, 160)
            spo2 = round(random.uniform(90, 94), 1)
            hrv = random.randint(10, 30)
            source = self.data_sick
        else:
            bpm = random.randint(60, 90)
            spo2 = round(random.uniform(97, 99), 1)
            hrv = random.randint(50, 80)
            source = self.data_normal

        # Select a random row from the source data
        row = source[random.randint(0, len(source) - 1)]
        return bpm, spo2, hrv, row[:-1]  # Exclude the label column

    def run(self):
        self.client.loop_start()
        print(f"{self.device_id} started sending...")

        while self.running:
            bpm, spo2, hrv, ecg = self.generate_vital_signs()

            payload = {
                "device_id": self.device_id,
                "ts": int(time.time() * 1000),
                "metrics": {"bpm": bpm, "spo2": spo2, "hrv": hrv},
                "ecg": np.round(ecg, 4).tolist(),
                "status": self.mode,
            }

            self.client.publish(self.topic_pub, json.dumps(payload))

            delay = 0.5 if self.mode == "DANGER" else 1.0
            time.sleep(delay + random.uniform(0.0, 0.2))

    def stop(self):
        self.running = False
        self.client.loop_stop()
        print(f"- [{self.device_id}] Stopped.")
        self.client.disconnect()
