import { useEffect, useState } from 'react'
import { RefreshCwOff, Signal } from 'lucide-react'

import { InsightCardShell } from '@/features/dashboard/components/patient/ai-insight'
import { useMonitorEcgStream } from '@/features/dashboard/hooks/useMonitorEcgStream'
import { cn } from '@/lib/utils'

interface InferenceLatencyCardProps {
  latencyMs: number | null
  patientId?: number
}

const formatFps = (latencyMs: number | null): string | null => {
  if (latencyMs == null || latencyMs <= 0) return null
  return `~ ${(1000 / latencyMs).toFixed(1)} FPS`
}

export const InferenceLatencyCard = ({
  latencyMs,
  patientId,
}: InferenceLatencyCardProps) => {
  const fps = formatFps(latencyMs)
  const useLiveStream = Boolean(patientId)
  const [status, setStatus] = useState<string>(
    patientId ? 'Đang kết nối...' : 'Không có dữ liệu',
  )
  const { isConnected } = useMonitorEcgStream({
    patientId,
    enabled: useLiveStream,
  })

  useEffect(() => {
    if (!useLiveStream) return
    if (isConnected) {
      setStatus('Đã kết nối')
    } else {
      setStatus('Đang kết nối...')
    }
  }, [useLiveStream, isConnected])

  return (
    <div className="flex flex-1 flex-col gap-2 max-[400px]:flex-row">
      <InsightCardShell
        title="Inference Latency"
        description="Thời gian xử lý của AI"
        className="flex-2 max-[400px]:flex-1">
        <div className="flex flex-1 flex-col justify-around">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-slate-900">
              {latencyMs ?? '—'}
            </span>
            {latencyMs != null && (
              <span className="text-sm font-medium text-slate-400">ms</span>
            )}
          </div>
          <p className="text-sm text-slate-500">{fps ?? '—'}</p>
        </div>
      </InsightCardShell>

      <InsightCardShell
        title="Connection Status"
        description="Trạng thái kết nối với thiết bị"
        className="flex-1">
        <div className="flex flex-1 items-center justify-between">
          <p className="text-sm text-slate-500">{status}</p>
          {patientId ? (
            <Signal
              className={cn(
                'size-5 text-slate-500',
                isConnected ? 'text-green-500' : 'text-red-500',
              )}
            />
          ) : (
            <RefreshCwOff className="size-5 text-slate-500" />
          )}
        </div>
      </InsightCardShell>
    </div>
  )
}
