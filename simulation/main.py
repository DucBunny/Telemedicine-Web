import time
import json
import paho.mqtt.client as mqtt
import config
from load_data import load_ecg_datasets
from device_simulator import VirtualESP32

ecg_normal, ecg_abnormal = load_ecg_datasets(
    config.JSON_FILE_NORMAL,
    config.JSON_FILE_ABNORMAL,
)
active_devices = {}
manager = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, "Manager_System")


# Hàm callback khi nhận được message từ broker
def on_control_message(client, userdata, msg):
    try:
        cmd = json.loads(msg.payload.decode())
        target = cmd.get("target")
        mode = cmd.get("mode")

        if target == "ALL":
            for dev in active_devices.values():
                dev.set_mode(mode)

        elif target in active_devices:
            active_devices[target].set_mode(mode)

        else:
            print(f"Device not found: {target}")

    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    # Setup Manager
    manager.on_message = on_control_message
    manager.connect(config.BROKER, config.PORT)
    manager.subscribe(config.TOPIC_CONTROL)
    manager.loop_start()

    # Start simulation
    print("--- STARTING SIMULATION ---")
    print(f"Control topic: {config.TOPIC_CONTROL}")
    print('Example: {"target": "device_1", "mode": "ABNORMAL"}')
    print('         {"target": "ALL", "mode": "NORMAL"}')

    for device_id in config.DEVICE_LIST:
        # Initialize and start each virtual device
        esp = VirtualESP32(device_id, ecg_normal, ecg_abnormal)
        active_devices[device_id] = esp
        esp.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nStopping all devices...")
        for esp in active_devices.values():
            esp.stop()
        manager.loop_stop()
