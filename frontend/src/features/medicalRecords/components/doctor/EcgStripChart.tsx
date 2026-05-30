import { useEffect, useMemo, useRef } from 'react'
import * as echarts from 'echarts'

import type { EcgAbnormalStrip } from '@/features/medicalRecords/types'

import { formatLongDate, formatTime } from '@/lib/format-date'

interface EcgStripChartProps {
  strip: EcgAbnormalStrip
}

const STRIP_TITLES: Record<EcgAbnormalStrip['stripType'], string> = {
  trigger: 'Đoạn kích hoạt cảnh báo',
  last_detected: 'Đoạn bất thường kết thúc',
}

const ECG_LINE_COLOR = '#dc2626'

type ChartPoint = [number, number]

// Lấy các điểm trong khoảng xMin và xMax
const getSegmentPoints = (
  points: Array<ChartPoint>,
  xMin: number,
  xMax: number,
): Array<ChartPoint> => {
  if (points.length === 0) return []

  const [lo, hi] = xMin <= xMax ? [xMin, xMax] : [xMax, xMin]
  let start = -1
  let end = -1

  points.forEach(([time], index) => {
    if (time >= lo && time <= hi) {
      if (start === -1) start = index
      end = index
    }
  })

  if (start === -1) return []

  return points.slice(Math.max(0, start - 1), Math.min(points.length, end + 2))
}

// Phân tích khoảng thời gian từ coordRange
const parseBrushXRange = (coordRange: unknown): [number, number] | null => {
  if (!Array.isArray(coordRange) || coordRange.length === 0) return null

  if (Array.isArray(coordRange[0])) {
    const [xMin, xMax] = coordRange[0] as [number, number]
    return [xMin, xMax]
  }

  const [xMin, xMax] = coordRange as [number, number]
  return [xMin, xMax]
}

// Xây dựng series ECG
const buildEcgSeries = (
  points: Array<ChartPoint>,
  selection?: { xMin: number; xMax: number },
) => {
  // Nếu không có selection, vẽ đường ECG liền mạch
  if (!selection) {
    return [
      {
        type: 'line' as const,
        showSymbol: false,
        lineStyle: {
          color: ECG_LINE_COLOR,
          width: 1.6,
        },
        data: points,
      },
    ]
  }

  // Nếu có selection, vẽ đường ECG trong khoảng xMin và xMax
  return [
    {
      type: 'line' as const,
      showSymbol: false,
      silent: true,
      z: 1,
      lineStyle: {
        color: ECG_LINE_COLOR,
        width: 1.2,
        opacity: 0.12,
      },
      data: points,
    },
    {
      type: 'line' as const,
      showSymbol: false,
      z: 2,
      lineStyle: {
        color: ECG_LINE_COLOR,
        width: 2.2,
      },
      data: getSegmentPoints(points, selection.xMin, selection.xMax),
    },
  ]
}

export const EcgStripChart = ({ strip }: EcgStripChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Convert ECG data to chart points
  const chartPoints = useMemo<Array<ChartPoint>>(() => {
    const totalPoints = strip.ecgData.length
    const duration = strip.durationSeconds

    return strip.ecgData.map((value, index) => {
      const time = totalPoints > 1 ? (index / (totalPoints - 1)) * duration : 0
      return [Number(time.toFixed(3)), value] as ChartPoint
    })
  }, [strip.durationSeconds, strip.ecgData])

  useEffect(() => {
    if (!containerRef.current) return

    const chart = echarts.init(containerRef.current)
    const detectedClasses =
      strip.detectedClasses.length > 0
        ? strip.detectedClasses.join(', ')
        : 'Không có'

    chart.setOption({
      animation: false,
      textStyle: {
        fontFamily: 'Roboto, sans-serif',
      },
      title: {
        text: STRIP_TITLES[strip.stripType],
        subtext: `${formatLongDate(strip.referenceTimestamp)} • ${formatTime(
          strip.referenceTimestamp,
        )} • Nhóm bất thường: ${detectedClasses}`,
        left: 'left',
        textStyle: {
          fontSize: 16,
          fontWeight: 600,
          color: '#000000',
        },
        subtextStyle: {
          color: '#64748b',
          fontSize: 12,
        },
        top: 10,
      },
      // Ô chứa đồ thị ECG
      grid: {
        top: 85,
        left: 40,
        right: 40,
        bottom: 70,
      },
      // Tooltip hover
      tooltip: {
        trigger: 'axis',
        confine: true,
        formatter: (params: Array<{ data: [number, number] }>) => {
          const point = params[0]?.data
          return `Thời gian: ${point[0].toFixed(3)}s<br/>Biên độ: ${point[1].toFixed(2)}`
        },
      },
      // Các nút công cụ
      toolbox: {
        right: -10,
        feature: {
          dataZoom: {
            yAxisIndex: 'none',
          },
          restore: {},
          saveAsImage: {
            name: `${strip.stripType}-ecg-strip`,
          },
        },
      },
      brush: {
        toolbox: ['rect', 'clear'],
        xAxisIndex: 0,
        brushMode: 'single',
        transformable: true,
      },
      // Trục X
      xAxis: {
        type: 'value',
        name: 'Giây',
        minorTick: {
          show: true,
        },
        minorSplitLine: {
          show: true,
          lineStyle: {
            color: '#fee2e2',
          },
        },
        splitLine: {
          lineStyle: {
            color: '#fca5a5',
          },
        },
        axisLabel: {
          formatter: '{value}s',
        },
      },
      // Trục Y
      yAxis: {
        type: 'value',
        name: 'Biên độ',
        scale: true,
        minorTick: {
          show: true,
        },
        minorSplitLine: {
          show: true,
          lineStyle: {
            color: '#fee2e2',
          },
        },
        splitLine: {
          lineStyle: {
            color: '#fca5a5',
          },
        },
      },
      // Thanh Zoom scroll
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: 0,
          filterMode: 'none',
        },
        {
          type: 'slider',
          xAxisIndex: 0,
          bottom: 20,
        },
      ],
      // Dữ liệu ECG
      series: buildEcgSeries(chartPoints),
    })

    // Reset series khi nhấn nút Restore
    const resetSeries = () => {
      chart.setOption(
        { series: buildEcgSeries(chartPoints) },
        { replaceMerge: ['series'] },
      )
    }

    // Xử lý sự kiện khi kết thúc việc chọn
    const handleBrushEnd = (params: unknown) => {
      const { areas } = params as {
        areas: Array<{ coordRange?: unknown }>
      }
      const xRange = parseBrushXRange(areas[0]?.coordRange)

      chart.setOption(
        {
          series: xRange
            ? buildEcgSeries(chartPoints, {
                xMin: xRange[0],
                xMax: xRange[1],
              })
            : buildEcgSeries(chartPoints),
        },
        { replaceMerge: ['series'] },
      )
    }

    chart.on('brushEnd', handleBrushEnd)
    chart.on('restore', resetSeries)

    const resizeObserver = new ResizeObserver(() => {
      chart.resize()
    })

    resizeObserver.observe(containerRef.current)

    return () => {
      chart.off('brushEnd', handleBrushEnd)
      chart.off('restore', resetSeries)
      resizeObserver.disconnect()
      chart.dispose()
    }
  }, [
    chartPoints,
    strip.detectedClasses,
    strip.referenceTimestamp,
    strip.stripType,
  ])

  return <div ref={containerRef} className="w-full md:h-80 lg:h-100" />
}
