import json
import random
import threading
import time

import paho.mqtt.client as mqtt

import config


class VirtualESP32(threading.Thread):
    def __init__(self, device_id, ecg_normal, ecg_abnormal):
        super().__init__()
        self.device_id = device_id
        self.mode = "NORMAL"
        self.running = True

        self.ecg_normal = ecg_normal
        self.ecg_abnormal = ecg_abnormal
        self.device_numeric_id = int(device_id.split("_")[-1])
        self.chunk_index = 0
        self.abnormal_cycle = []
        self.cycle_index = 0

        self.topic_pub = f"{device_id}/server"
        self.topic_sub = f"server/{device_id}"

        self.client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, device_id)
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.connect(config.BROKER, config.PORT, 60)

    def on_connect(self, client, userdata, flags, reason_code, properties):
        if reason_code == 0:
            print(f"+ [{self.device_id}] Connected to Broker!")
            client.subscribe(self.topic_sub)
        else:
            print(f"- [{self.device_id}] Connect failed: {reason_code}")

    def on_message(self, client, userdata, msg):
        try:
            payload = json.loads(msg.payload.decode())
            print(f"[{self.device_id}] Received: {payload.get('content')}")
        except Exception as e:
            print(f"[{self.device_id}] Message error: {e}")

    def set_mode(self, new_mode):
        mode = (new_mode or "NORMAL").upper()
        if mode not in ("NORMAL", "ABNORMAL"):
            print(f"[{self.device_id}] Unknown mode: {new_mode}")
            return
        self.mode = mode
        self.chunk_index = 0
        self.abnormal_cycle = []
        self.cycle_index = 0
        print(f"[{self.device_id}] Changed mode -> {mode}")

    def _envelope(self, content, data):
        return {
            "from": self.topic_pub,
            "to": self.topic_sub,
            "content": content,
            "time": int(time.time() * 1000),
            "data": data,
        }

    def _build_abnormal_cycle(self):
        cycle_len = config.ABNORMAL_CYCLE_BEATS
        n_abnormal = random.randint(
            config.ABNORMAL_BEATS_MIN, config.ABNORMAL_BEATS_MAX
        )
        abnormal_positions = set(random.sample(range(cycle_len), n_abnormal))

        cycle = []
        for i in range(cycle_len):
            if i in abnormal_positions:
                beat = random.choice(self.ecg_abnormal)
            else:
                beat = random.choice(self.ecg_normal)
            cycle.append(beat)

        print(
            f"[{self.device_id}] ABNORMAL cycle: {cycle_len} beats "
            f"({n_abnormal} V @ positions {sorted(abnormal_positions)})"
        )
        return cycle

    def next_telemetry(self):
        if self.mode == "ABNORMAL":
            if not self.abnormal_cycle or self.cycle_index >= len(self.abnormal_cycle):
                self.abnormal_cycle = self._build_abnormal_cycle()
                self.cycle_index = 0
            packet_ecg = self.abnormal_cycle[self.cycle_index]
            self.cycle_index += 1
        else:
            packet_ecg = self.ecg_normal[self.chunk_index]
            self.chunk_index = (self.chunk_index + 1) % len(self.ecg_normal)

        return self._envelope(
            "telemetry",
            {
                "id": self.device_numeric_id,
                "packet_ecg": packet_ecg,
            },
        )

    def run(self):
        self.client.loop_start()
        print(f"{self.device_id} started sending telemetry -> {self.topic_pub}")

        while self.running:
            payload = self.next_telemetry()
            self.client.publish(self.topic_pub, json.dumps(payload))
            time.sleep(config.TELEMETRY_INTERVAL)

    def stop(self):
        self.running = False
        self.client.loop_stop()
        print(f"- [{self.device_id}] Stopped.")
        self.client.disconnect()
