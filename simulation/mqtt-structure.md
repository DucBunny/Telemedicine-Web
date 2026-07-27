# MQTT structure

Broker: `mqtt://broker.emqx.io:1883` (or values from env / `simulation/config.py`).

## Topic naming

| Direction         | Topic                     | Example                         |
| ----------------- | ------------------------- | ------------------------------- |
| Device → server   | `{device_id}/server`      | `device_1/server`               |
| Server → device   | `server/{device_id}`      | `server/device_1`               |
| Backend subscribe | `+/server` (`MQTT_TOPIC`) | all device telemetry            |
| Simulator control | `health/control`          | mode switch for virtual devices |

`device_id` format: `device_<n>` (e.g. `device_1`). Numeric `id` in the payload is `<n>`.

---

## Envelope (all device ↔ server messages)

```json
{
  "from": "device_1/server",
  "to": "server/device_1",
  "content": "<message_type>",
  "time": 1700000000123,
  "data": {}
}
```

| Field         | Notes                                                                                                 |
| ------------- | ----------------------------------------------------------------------------------------------------- |
| `from` / `to` | Topic strings; swap when server sends to device                                                       |
| `content`     | Message type: `telemetry`, `connected`, `response`, `reset_factory`, …                                |
| `time`        | Unix timestamp in **milliseconds** (preferred). Backend falls back to server time if not epoch-synced |
| `data`        | Type-specific payload                                                                                 |

---

## 1. Telemetry — device publishes to `{device_id}/server`

Sent periodically (simulator: ~0.8s). Backend validates `packet_ecg` length (`ECG_PACKET_SIZE`, default **187 or 65**) then enqueues inference.

```json
{
  "from": "device_1/server",
  "to": "server/device_1",
  "content": "telemetry",
  "time": 1700000000123,
  "data": {
    "id": 1,
    "packet_ecg": [0, 1, 2, 3]
  }
}
```

| Field             | Notes                                                                      |
| ----------------- | -------------------------------------------------------------------------- |
| `data.id`         | Device numeric id (DB `devices.id`)                                        |
| `data.packet_ecg` | Array of samples for one beat/packet (length must match `ECG_PACKET_SIZE`) |

Classification (`class_inference`, confidence, latency) is computed **server-side** (sliding window of `ECG_SEQ_LEN` packets). The device does not send inference fields.

---

## 2. Connected — device → server

```json
{
  "from": "device_1/server",
  "to": "server/device_1",
  "content": "connected",
  "time": 1700000000123,
  "data": {
    "id": 1,
    "mac_address": "10:11:11:...",
    "status": "online",
    "name": "Nguyen Van A"
  }
}
```

---

## 3. Response — either direction

```json
{
  "from": "server/device_1",
  "to": "device_1/server",
  "content": "response",
  "data": {
    "status": "OK",
    "error": null
  }
}
```

Error variant: `"status": "NO"`, `"error": "<code>"`.

---

## 4. Factory reset — either direction

```json
{
  "from": "server/device_1",
  "to": "device_1/server",
  "content": "reset_factory",
  "time": 1700000000123,
  "data": {
    "id": 1,
    "mac_address": "10:11:11:...",
    "status": "reset_factory",
    "name": "Nguyen Van A"
  }
}
```

---

## 5. Simulator control — publish to `health/control`

Used only by the Python simulator manager (not the production device protocol). Switches virtual device data mode.

```json
{
  "target": "device_1",
  "mode": "ABNORMAL"
}
```

| Field    | Notes                  |
| -------- | ---------------------- |
| `target` | `device_id` or `ALL`   |
| `mode`   | `NORMAL` \| `ABNORMAL` |

Examples:

```json
{"target": "device_1", "mode": "ABNORMAL"}
{"target": "ALL", "mode": "NORMAL"}
```
