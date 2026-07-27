import { useEffect, useRef, useState } from 'react'

import { AiInsightCards } from '@/features/dashboard/components/patient/ai-insight'
import { useMonitorEcgStream } from '@/features/dashboard/hooks/useMonitorEcgStream'
import {
  acValueToCanvasY,
  packetToDisplayWaveform,
  updateDisplayGain,
} from '@/features/dashboard/utils/ecgDisplay'

interface VitalCardsGridProps {
  patientId?: number
}

export const VitalCardsGrid = ({ patientId }: VitalCardsGridProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const dataQueue = useRef<Array<number>>([]) // Hàng đợi chứa mảng các con số
  const isPlaying = useRef<boolean>(false) // Cờ
  const scanX = useRef<number>(0) // Tọa độ X hiện tại của nét vẽ
  const prevY = useRef<number>(0) // Tọa độ Y của điểm dữ liệu trước đó (để vẽ đường liên tục)
  const bufferEmptyTimeRef = useRef<number>(0) // Thời điểm buffer bắt đầu cạn
  const displayGainRef = useRef<number>(0) // Gain Y ổn định, cập nhật theo từng gói MQTT

  const [status, setStatus] = useState<string>(
    patientId ? 'Đang kết nối...' : 'Không có dữ liệu',
  )
  const [classInference, setClassInference] = useState<string>('—')
  const [timeInference, setTimeInference] = useState<number | null>(null)
  const [confidence, setConfidence] = useState<number | null>(null)

  const useLiveStream = Boolean(patientId)

  /** Preload 2 gói MQTT để chống network jitter */
  const ecgPacketSize = Number(import.meta.env.VITE_ECG_PACKET_SIZE)
  const hasValidPacketSize = Number.isFinite(ecgPacketSize) && ecgPacketSize > 0
  const BUFFER_THRESHOLD = hasValidPacketSize ? ecgPacketSize * 2 : 300
  const POINTS_PER_FRAME = hasValidPacketSize
    ? Math.max(1, Math.floor(ecgPacketSize / 60))
    : 5
  const BUFFER_EMPTY_THRESHOLD_MS = 1000 // Đợi 1s trước khi báo "Mạng chậm"

  const { isConnected, joinError } = useMonitorEcgStream({
    patientId,
    enabled: useLiveStream,
    onPacket: ({
      packetEcg,
      classInference: cls,
      timeInference: infMs,
      inferenceReady,
      inferenceConfidence: conf,
    }) => {
      const waveform = packetToDisplayWaveform(packetEcg)
      displayGainRef.current = updateDisplayGain(
        displayGainRef.current,
        waveform,
      )
      dataQueue.current.push(...waveform)
      if (inferenceReady !== false && cls) {
        setClassInference(cls)
        setTimeInference(infMs)
        setConfidence(conf ?? null)
      }
      if (!isPlaying.current && dataQueue.current.length >= BUFFER_THRESHOLD) {
        setStatus('Đang chạy Real-time')
      }
    },
  })

  useEffect(() => {
    if (!useLiveStream) return
    if (isConnected) {
      setStatus('Đã kết nối — chờ dữ liệu...')
    } else {
      setStatus('Đang kết nối...')
    }
  }, [useLiveStream, isConnected])

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Cấu hình nét vẽ
    ctx.lineWidth = 1.5
    ctx.strokeStyle = '#00FF00' // Xanh lá phản quang (Neon Green)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const getScaledY = (acValue: number): number =>
      acValueToCanvasY(acValue, displayGainRef.current, height)

    let animationFrameId: number

    // Loop vẽ chính (sweep trace)
    const drawLoop = () => {
      // Logic Preload
      if (!isPlaying.current && dataQueue.current.length >= BUFFER_THRESHOLD) {
        isPlaying.current = true
        setStatus('Đang chạy Real-time')
        prevY.current = getScaledY(dataQueue.current[0])
      }

      // Logic Khựng (Buffer cạn) - Debounce để tránh giật
      if (isPlaying.current && dataQueue.current.length === 0) {
        if (bufferEmptyTimeRef.current === 0) {
          bufferEmptyTimeRef.current = Date.now()
        } else if (
          Date.now() - bufferEmptyTimeRef.current >
          BUFFER_EMPTY_THRESHOLD_MS
        ) {
          isPlaying.current = false
          setStatus('Mạng chậm, đang chờ gói ECG tiếp theo...')
        }
      } else if (dataQueue.current.length > 0) {
        bufferEmptyTimeRef.current = 0
      }

      // Logic Vẽ (Sweep Trace)
      if (isPlaying.current && dataQueue.current.length > 0) {
        ctx.beginPath()
        ctx.moveTo(scanX.current, prevY.current)

        for (let i = 0; i < POINTS_PER_FRAME; i++) {
          if (dataQueue.current.length === 0) break

          const currentValue = dataQueue.current.shift()
          if (currentValue === undefined) break

          const currentY = getScaledY(currentValue)

          scanX.current += 1

          ctx.lineTo(scanX.current, currentY)
          prevY.current = currentY

          // Thanh xóa (Blanking bar)
          ctx.clearRect(scanX.current, 0, 20, height)

          // Vòng lặp quét lại từ đầu
          if (scanX.current >= width) {
            scanX.current = 0
            ctx.moveTo(scanX.current, prevY.current)
          }
        }
        ctx.stroke()
      }

      animationFrameId = requestAnimationFrame(drawLoop)
    }

    drawLoop()

    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  return (
    <div className="flex flex-col gap-3">
      {/* AI Insight Cards */}
      <AiInsightCards
        patientId={patientId}
        classInference={classInference}
        timeInference={timeInference}
        confidence={confidence ?? null}
      />

      {/* ECG Canvas */}
      <div className="rounded-2xl border border-gray-100 bg-white p-3 text-white shadow-sm">
        <p className="mb-1 text-xs text-slate-500">{joinError ?? status}</p>

        {/* Container của Canvas với lưới y tế (Grid background) bằng Tailwind */}
        <div
          className="relative h-[calc(100%-20px)] overflow-hidden rounded-xl border-2 border-gray-700 bg-black"
          style={{
            // Tạo hiệu ứng lưới Monitor y tế bằng CSS Gradient
            backgroundImage: `
            linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px),
            linear-gradient(rgba(0, 255, 0, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 0, 0.05) 1px, transparent 1px)
          `,
            backgroundSize: '25px 25px, 25px 25px, 5px 5px, 5px 5px',
            backgroundPosition: '-1px -1px, -1px -1px, -1px -1px, -1px -1px',
          }}>
          <canvas
            ref={canvasRef}
            width={800}
            height={250}
            className="block h-full w-full"
          />
        </div>
      </div>
    </div>
  )
}
