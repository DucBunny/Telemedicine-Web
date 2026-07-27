/** Chuẩn hóa gói ECG chỉ để vẽ canvas (không đổi dữ liệu gửi AI). */

const median = (values: Array<number>): number => {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 1
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2
}

const smooth5 = (values: Array<number>): Array<number> =>
  values.map((value, index) => {
    const p2 = values[index - 2] ?? value
    const p1 = values[index - 1] ?? value
    const n1 = values[index + 1] ?? value
    const n2 = values[index + 2] ?? value
    return (p2 + p1 + value + n1 + n2) / 5
  })

/**
 * Trừ baseline theo gói + làm mượt nhẹ → sóng AC giống monitor ECG,
 * tránh nhảy biên độ khi nối các beat đã scale per-beat 0–255.
 */
export const packetToDisplayWaveform = (
  packet: Array<number>,
): Array<number> => {
  if (packet.length === 0) return []

  const isUnitScale = Math.max(...packet) <= 1.5 && Math.min(...packet) >= -0.05
  const scale = isUnitScale ? 255 : 1
  const baseline = median(packet)
  const ac = packet.map((value) => (value - baseline) * scale)
  return smooth5(ac)
}

/** Cập nhật gain hiển thị (EMA) theo biên độ đỉnh gói mới. */
export const updateDisplayGain = (
  currentGain: number,
  waveform: Array<number>,
  alpha = 0.18,
): number => {
  if (waveform.length === 0) return currentGain

  let peak = 0
  for (const value of waveform) {
    const abs = Math.abs(value)
    if (abs > peak) peak = abs
  }

  const target = Math.max(peak, 12)
  return currentGain <= 0 ? target : currentGain * (1 - alpha) + target * alpha
}

/** Map sóng AC (đã trừ baseline) → tọa độ Y canvas. */
export const acValueToCanvasY = (
  acValue: number,
  gain: number,
  height: number,
): number => {
  const safeGain = Math.max(gain, 12)
  // Canvas Y=0 ở trên: AC dương (đỉnh R) → lên trên màn hình
  const normalized = 0.5 + (acValue / safeGain) * 0.32
  const clamped = Math.max(0.08, Math.min(0.92, normalized))
  return height - clamped * height
}
