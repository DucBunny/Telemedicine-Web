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

        self.prev_bpm = random.randint(70, 80)
        self.prev_spo2 = round(random.uniform(97.5, 98.5), 1)
        self.prev_hrv = random.randint(55, 65)

    def on_connect(self, client, userdata, flags, reason_code, properties):
        if reason_code == 0:
            print(f"+ [{self.device_id}] Connected to Broker!")
        else:
            print(f"- [{self.device_id}] Connect failed: {reason_code}")

    def set_mode(self, new_mode):
        self.mode = new_mode
        print(f"[{self.device_id}] Changed mode -> {new_mode}")

    def clamp(self, value, min_v, max_v):
        return max(min_v, min(value, max_v))

    def generate_vital_signs(self):
        # Generate vital signs based on the current mode
        if self.mode == "DANGER":
            bpm_min, bpm_max = 120, 160
            spo2_min, spo2_max = 90, 94
            hrv_min, hrv_max = 10, 30
            bpm_delta = random.randint(-5, 6)
            spo2_delta = round(random.uniform(-0.5, 0.5), 1)
            hrv_delta = random.randint(-3, 3)
            source = self.data_sick
        else:
            bpm_min, bpm_max = 60, 90
            spo2_min, spo2_max = 97, 99
            hrv_min, hrv_max = 50, 80
            bpm_delta = random.randint(-2, 3)
            spo2_delta = round(random.uniform(-0.2, 0.2), 1)
            hrv_delta = random.randint(-2, 2)
            source = self.data_normal

            # Random walk
            self.prev_bpm = self.clamp(self.prev_bpm + bpm_delta, bpm_min, bpm_max)
            self.prev_spo2 = self.clamp(self.prev_spo2 + spo2_delta, spo2_min, spo2_max)
            self.prev_hrv = self.clamp(self.prev_hrv + hrv_delta, hrv_min, hrv_max)

        # Select a random row from the source data
        row = source[random.randint(0, len(source) - 1)]

        return (
            self.prev_bpm,
            round(self.prev_spo2, 1),
            self.prev_hrv,
            row[:-1],
        )  # Exclude the label column

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
