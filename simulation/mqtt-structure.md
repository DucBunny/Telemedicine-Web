# MQTT Telemetry payload (JSON)

## Payload Sent by Device — publish to `health/<device_id>/telemetry`:

```json
{
  "device_id": "ESP_01",
  "ts": 1700000000123,
  "metrics": {
    "bpm": 72,
    "spo2": 98.2,
    "hrv": 60
  },
  "ecg": [0.1234, 0.2345, 0.3456],
  "status": "NORMAL"
}
```

Field notes:

- `device_id`: device identifier string.
- `ts`: timestamp in milliseconds.
- `metrics`: summary values for bpm/spo2/hrv.
- `ecg`: array of floats (ECG sample row from CSV, excluding label column).
- `status`: device mode state. Possible values: `NORMAL`, `DANGER`.

## Control payload (JSON) — publish to `health/control`:

```json
{
  "target": "ESP_01",
  "mode": "DANGER"
}
```

Field notes:

- `target`: device_id or `ALL` to apply to all devices.
- `mode`: mode to set on target device(s). Possible values: `NORMAL`, `DANGER`.
