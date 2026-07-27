from pathlib import Path

BROKER = "broker.emqx.io"
PORT = 1883
TOPIC_CONTROL = "health/control"

BEAT_LEN = 65
JSON_DIR = Path("./data")
JSON_FILE_NORMAL = str(JSON_DIR / "ecg_beat65_normal.json")
JSON_FILE_ABNORMAL = str(JSON_DIR / "ecg_beat65_normalized_v.json")

# Device IDs match topic naming: device_<n>/server, server/device_<n>
DEVICE_LIST = ["device_1"]

TELEMETRY_INTERVAL = 0.8

# ABNORMAL mode: send consecutive abnormal beats (like test set sequences)
ABNORMAL_CYCLE_BEATS = 5  # Same as SEQ_LEN
ABNORMAL_BEATS_MIN = 1
ABNORMAL_BEATS_MAX = 1

# MIT-BIH-style class labels for inference field
CLASS_NORMAL = "N"
CLASS_ABNORMAL = "V"
