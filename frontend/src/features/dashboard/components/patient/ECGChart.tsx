import { useEffect, useRef, useState } from 'react'

import ecgChunks from './ecg_lead_II_187_chunks.json'

export const ECGChart = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const dataQueue = useRef<Array<number>>([]) // Hàng đợi chứa mảng các con số
  const isPlaying = useRef<boolean>(false) // Cờ
  const scanX = useRef<number>(0) // Tọa độ X hiện tại của nét vẽ
  const prevY = useRef<number>(0) // Tọa độ Y của điểm dữ liệu trước đó (để vẽ đường liên tục)

  // Biến đếm để tuần tự lấy từng chunk trong file JSON
  const chunkIndexRef = useRef<number>(0)

  const [queueCount, setQueueCount] = useState<number>(0)
  const [status, setStatus] = useState<string>('Đang chờ Preload...')

  const BUFFER_THRESHOLD = 300
  const POINTS_PER_FRAME = 3
  // Giới hạn giá trị ECG (0-255 cho dữ liệu 8-bit)
  const MIN_ECG = 0
  const MAX_ECG = 255

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

    // Hàm convert giá trị ECG thành tọa độ Y
    const getScaledY = (value: number): number => {
      let normalized = (value - MIN_ECG) / (MAX_ECG - MIN_ECG)
      if (normalized > 1) normalized = 1
      if (normalized < 0) normalized = 0
      return height - normalized * height
    }

    let animationFrameId: number

    // Loop vẽ chính (sweep trace)
    const drawLoop = () => {
      // Logic Preload
      if (!isPlaying.current && dataQueue.current.length >= BUFFER_THRESHOLD) {
        isPlaying.current = true
        setStatus('Đang chạy Real-time')
        prevY.current = getScaledY(dataQueue.current[0])
      }

      // Logic Khựng (Buffer cạn)
      if (isPlaying.current && dataQueue.current.length === 0) {
        isPlaying.current = false
        setStatus('Mạng chậm, đang chờ Preload lại...')
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

  // Mock dữ liệu ECG từ MQTT (Đọc từ file JSON)
  useEffect(() => {
    // Ép kiểu dữ liệu import từ JSON
    const allChunks: Array<Array<number>> = ecgChunks

    const mqttInterval = window.setInterval(() => {
      // Lấy chunk hiện tại
      const currentChunk = allChunks[chunkIndexRef.current]

      // Bỏ qua nếu chunk rỗng hoặc thiếu điểm (ví dụ chunk lẻ ở cuối file)
      if (currentChunk.length === 187) {
        dataQueue.current.push(...currentChunk)
      }

      // Tăng index, nếu chạy hết file JSON thì quay lại từ đầu để lặp vô tận
      chunkIndexRef.current = (chunkIndexRef.current + 1) % allChunks.length
    }, 1000)

    const uiInterval = window.setInterval(() => {
      setQueueCount(dataQueue.current.length)
    }, 200)

    return () => {
      window.clearInterval(mqttInterval)
      window.clearInterval(uiInterval)
    }
  }, [])

  return (
    <div className="flex grid-cols-11 flex-col gap-3 md:gap-4 xl:grid xl:gap-3">
      {/* Left */}
      <div className="order-last col-span-9 rounded-2xl border border-gray-100 bg-white p-3 text-white shadow-sm xl:order-first">
        {/* <div className="mb-4 flex gap-6 rounded-md border border-gray-700 bg-gray-800 p-3 text-sm">
        <p className="flex items-center gap-2">
          <span className="text-gray-400">Trạng thái kết nối:</span>
          <span
            className={`font-semibold ${isPlaying.current ? 'text-green-500' : 'animate-pulse text-orange-400'}`}>
            {status}
          </span>
        </p>
        <div className="w-px bg-gray-700"></div>
        <p className="flex items-center gap-2">
          <span className="text-gray-400">Hàng đợi Queue:</span>
          <span className="rounded bg-black px-2 py-1 font-mono text-blue-300">
            {queueCount} pts
          </span>
        </p>
      </div> */}

        {/* Container của Canvas với lưới y tế (Grid background) bằng Tailwind */}
        <div
          className="relative h-full overflow-hidden rounded-xl border-2 border-gray-700 bg-black"
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

      {/* Right */}
      <div className="order-first col-span-2 flex gap-3 md:gap-4 xl:order-last xl:flex-col xl:gap-3">
        {/* Card 1: Phân loại nhịp */}
        <div className="flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 md:text-base">
            Phân loại
          </h3>
          <p className="text-center text-xl font-bold text-slate-900">N</p>
        </div>

        {/* Card 2: Thời gian Inference */}
        <div className="flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 md:text-base">
            Độ chính xác
          </h3>
          <p className="text-xl font-bold text-slate-900">
            98.5 <span className="text-sm font-normal text-slate-400">%</span>
          </p>
        </div>
      </div>
    </div>
  )
}
