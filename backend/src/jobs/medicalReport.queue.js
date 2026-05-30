import fs from 'fs'
import os from 'os'
import path from 'path'
import { Queue, Worker } from 'bullmq'
import { createCanvas } from 'canvas'
import { formatInTimeZone } from 'date-fns-tz'
import PDFDocument from 'pdfkit'
import { cloudinary, env, redis } from '@/config'
import * as alertRepo from '@/repositories/alert.repo'
import * as ecgAbnormalStripRepo from '@/repositories/ecgAbnormalStrip.repo'
import * as medicalAttachmentRepo from '@/repositories/medicalAttachment.repo'
import * as medicalRecordRepo from '@/repositories/medicalRecord.repo'
import { createAndSendNotification } from '@/services/notification.service'
import {
  PDF_FONT,
  canvasSansFont,
  canvasSerifFont,
  ensureCanvasFonts,
  registerPdfFonts,
} from '@/utils/report-fonts'

// Queue name và job name
const MEDICAL_REPORT_QUEUE = 'medical.report.queue'
const EXPORT_REPORT_JOB = 'export-report'
const PDF_MARGIN = 40

// Kết nối Redis cho queue và worker
const queueConnection = redis.duplicate()
const workerConnection = redis.duplicate()

// Tạo queue và worker
export const medicalQueue = new Queue(MEDICAL_REPORT_QUEUE, {
  connection: queueConnection,
})

let medicalReportWorker

const formatDateOnly = (value) => {
  if (!value) return 'Chưa cập nhật'
  return formatInTimeZone(new Date(value), env.APP_TIME_ZONE, 'dd/MM/yyyy')
}

const formatTime = (value) => {
  if (!value) return 'Chưa cập nhật'
  return formatInTimeZone(new Date(value), env.APP_TIME_ZONE, 'HH:mm')
}

const formatTimeWithSeconds = (value) => {
  if (!value) return 'Chưa cập nhật'
  return formatInTimeZone(new Date(value), env.APP_TIME_ZONE, 'HH:mm:ss')
}

const formatDateTime = (value) => {
  if (!value) return 'Chưa cập nhật'
  return formatInTimeZone(
    new Date(value),
    env.APP_TIME_ZONE,
    'dd/MM/yyyy HH:mm',
  )
}

// Safe text fallback
const safeText = (value, fallback = 'Chưa cập nhật') => {
  const normalized = String(value ?? '').trim()
  return normalized || fallback
}

// Format prescription rows
const normalizePrescriptionRows = (prescription) => {
  if (!Array.isArray(prescription)) return []

  return prescription
    .map((item) => {
      if (typeof item === 'string') {
        const text = item.trim()
        return text
          ? {
              name: text,
              dosage: '',
              duration: '',
            }
          : null
      }

      if (item && typeof item === 'object') {
        const name = safeText(item.name, '')
        const dosage = safeText(item.dosage, '')
        const duration = safeText(item.duration, '')
        if (!name && !dosage && !duration) return null
        return { name, dosage, duration }
      }

      return null
    })
    .filter(Boolean)
}

// Đảm bảo có đủ không gian trong PDF
const ensurePdfSpace = (doc, minHeight) => {
  const pageBottom = doc.page.height - doc.page.margins.bottom
  if (doc.y + minHeight > pageBottom) doc.addPage()
}

// Viết bảng đơn thuốc
const writePrescriptionTable = (doc, rows) => {
  if (!rows?.length) return

  const tableLeft = PDF_MARGIN
  const tableWidth = doc.page.width - PDF_MARGIN * 2
  const colName = Math.round(tableWidth * 0.4)
  const colDosage = Math.round(tableWidth * 0.3)
  const colDuration = tableWidth - colName - colDosage
  const rowPaddingY = 6
  const rowPaddingX = 8
  let isFirstDrawnRow = true

  const drawRow = ({ name, dosage, duration }, { isHeader = false } = {}) => {
    const font = isHeader ? PDF_FONT.label : PDF_FONT.body
    const fontSize = 10.5
    const lineGap = 2
    const pageBeforeEnsure = doc.page

    const heightName = doc.heightOfString(name || '-', {
      width: colName - rowPaddingX * 2,
      font,
      fontSize,
      lineGap,
    })
    const heightDosage = doc.heightOfString(dosage || '-', {
      width: colDosage - rowPaddingX * 2,
      font,
      fontSize,
      lineGap,
    })
    const heightDuration = doc.heightOfString(duration || '-', {
      width: colDuration - rowPaddingX * 2,
      font,
      fontSize,
      lineGap,
    })

    const contentHeight = Math.max(heightName, heightDosage, heightDuration)
    const rowHeight = Math.max(24, contentHeight + rowPaddingY * 2)

    ensurePdfSpace(doc, rowHeight + 2)

    const y = doc.y
    const x1 = tableLeft
    const x2 = tableLeft + colName
    const x3 = tableLeft + colName + colDosage
    const x4 = tableLeft + tableWidth
    const hasPageBreak = doc.page !== pageBeforeEnsure

    if (isHeader) {
      doc
        .save()
        .fillColor('#f1f5f9')
        .rect(tableLeft, y, tableWidth, rowHeight)
        .fill()
        .restore()
    }

    doc
      .save()
      .strokeColor('#cbd5e1')
      .lineWidth(1)
      .moveTo(x1, y)
      .lineTo(x1, y + rowHeight)
      .stroke()
      .moveTo(x4, y)
      .lineTo(x4, y + rowHeight)
      .stroke()
      .moveTo(x1, y + rowHeight)
      .lineTo(x4, y + rowHeight)
      .stroke()
      .moveTo(x2, y)
      .lineTo(x2, y + rowHeight)
      .stroke()
      .moveTo(x3, y)
      .lineTo(x3, y + rowHeight)
      .stroke()
      .restore()

    if (isFirstDrawnRow || hasPageBreak) {
      doc
        .save()
        .strokeColor('#cbd5e1')
        .lineWidth(1)
        .moveTo(x1, y)
        .lineTo(x4, y)
        .stroke()
        .restore()
    }

    doc
      .font(font)
      .fontSize(fontSize)
      .fillColor(isHeader ? '#0f172a' : '#334155')

    doc.text(name || '-', x1 + rowPaddingX, y + rowPaddingY, {
      width: colName - rowPaddingX * 2,
      lineGap,
    })
    doc.text(dosage || '-', x2 + rowPaddingX, y + rowPaddingY, {
      width: colDosage - rowPaddingX * 2,
      lineGap,
    })
    doc.text(duration || '-', x3 + rowPaddingX, y + rowPaddingY, {
      width: colDuration - rowPaddingX * 2,
      lineGap,
    })

    doc.y = y + rowHeight
    isFirstDrawnRow = false
  }

  drawRow(
    { name: 'Tên thuốc', dosage: 'Liều dùng', duration: 'Thời gian' },
    { isHeader: true },
  )
  rows.forEach((row) => drawRow(row))
}

// Viết tiêu đề section
const writeSectionTitle = (doc, title) => {
  ensurePdfSpace(doc, 40)
  doc.moveDown(0.6)
  doc.font(PDF_FONT.section).fontSize(13).fillColor('#0f766e').text(title)
  doc.moveDown(0.2)
  doc
    .strokeColor('#99f6e4')
    .lineWidth(1)
    .moveTo(PDF_MARGIN, doc.y)
    .lineTo(doc.page.width - PDF_MARGIN, doc.y)
    .stroke()
  doc.moveDown(0.5)
}

// Viết key-value pair
const writeKeyValue = (doc, label, value) => {
  doc
    .font(PDF_FONT.label)
    .fontSize(10.5)
    .fillColor('#0f172a')
    .text(`${label}: `, {
      continued: true,
    })
  doc.font(PDF_FONT.body).fillColor('#334155').text(safeText(value))
  doc.moveDown(0.1)
}

// Vẽ lưới medical
const drawMedicalGrid = (
  ctx,
  width,
  height,
  plotLeft,
  plotTop,
  plotWidth,
  plotHeight,
) => {
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)

  const minorStep = 20
  const majorStep = minorStep * 5

  ctx.save()
  ctx.beginPath()
  ctx.rect(plotLeft, plotTop, plotWidth, plotHeight)
  ctx.clip()

  for (let x = plotLeft; x <= plotLeft + plotWidth; x += minorStep) {
    ctx.strokeStyle = '#fee2e2'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x, plotTop)
    ctx.lineTo(x, plotTop + plotHeight)
    ctx.stroke()
  }

  for (let y = plotTop; y <= plotTop + plotHeight; y += minorStep) {
    ctx.strokeStyle = '#fee2e2'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(plotLeft, y)
    ctx.lineTo(plotLeft + plotWidth, y)
    ctx.stroke()
  }

  for (let x = plotLeft; x <= plotLeft + plotWidth; x += majorStep) {
    ctx.strokeStyle = '#fca5a5'
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.moveTo(x, plotTop)
    ctx.lineTo(x, plotTop + plotHeight)
    ctx.stroke()
  }

  for (let y = plotTop; y <= plotTop + plotHeight; y += majorStep) {
    ctx.strokeStyle = '#fca5a5'
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.moveTo(plotLeft, y)
    ctx.lineTo(plotLeft + plotWidth, y)
    ctx.stroke()
  }

  ctx.restore()
}

// Gán nhãn đoạn ECG theo loại
const buildStripLabel = (stripType) => {
  if (stripType === 'trigger') return 'Đoạn ECG tại thời điểm kích hoạt'
  if (stripType === 'last_detected') return 'Đoạn ECG tại thời điểm kết thúc'
  return 'Đoạn ECG'
}

const drawEcgStripBuffer = (strip) => {
  const width = 1180
  const height = 360
  const headerHeight = 44
  const footerHeight = 38
  const plotLeft = 52
  const plotTop = headerHeight
  const plotWidth = width - plotLeft - 24
  const plotHeight = height - headerHeight - footerHeight
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  const values = Array.isArray(strip?.ecg_data) ? strip.ecg_data : []

  ensureCanvasFonts()
  drawMedicalGrid(ctx, width, height, plotLeft, plotTop, plotWidth, plotHeight)

  ctx.fillStyle = '#0f172a'
  ctx.font = canvasSerifFont(20, { bold: true })
  ctx.fillText(buildStripLabel(strip?.strip_type), plotLeft, 28)

  ctx.fillStyle = '#475569'
  ctx.font = canvasSansFont(14, { italic: true })
  ctx.fillText(
    `Thời gian tham chiếu: ${formatTimeWithSeconds(strip?.reference_timestamp)}, ${formatDateOnly(strip?.reference_timestamp)}`,
    plotLeft,
    height - 14,
  )

  const detectedText =
    strip?.detected_classes?.length > 0
      ? strip.detected_classes.join(', ')
      : 'Không có'
  const detectedLabel = 'Nhóm bất thường: '
  ctx.font = canvasSansFont(14, { bold: true })
  const labelWidth = ctx.measureText(detectedLabel).width
  ctx.fillText(detectedLabel, width - 300, height - 14)
  ctx.font = canvasSansFont(14)
  ctx.fillText(detectedText, width - 300 + labelWidth, height - 14)

  if (!values.length) return canvas.toBuffer('image/png')

  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const range = maxValue - minValue || 1
  const paddedMin = minValue - range * 0.15
  const paddedMax = maxValue + range * 0.15

  ctx.strokeStyle = '#dc2626'
  ctx.lineWidth = 2
  ctx.beginPath()

  values.forEach((value, index) => {
    const ratio = values.length > 1 ? index / (values.length - 1) : 0
    const x = plotLeft + ratio * plotWidth
    const normalized = (value - paddedMin) / (paddedMax - paddedMin || 1)
    const y = plotTop + plotHeight - normalized * plotHeight

    if (index === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })

  ctx.stroke()
  return canvas.toBuffer('image/png')
}

// Tạo context báo cáo
export const resolveReportContext = async ({
  sourceType,
  medicalRecordId,
  alertId,
}) => {
  let medicalRecord = null

  if (sourceType === 'medical_record' && medicalRecordId) {
    medicalRecord = await medicalRecordRepo.findById(medicalRecordId)
  }

  const resolvedAlertId = medicalRecord?.alertId ?? alertId ?? null
  const alert = resolvedAlertId
    ? await alertRepo.findById(resolvedAlertId)
    : null

  if (!medicalRecord && !alert) {
    throw new Error('Medical report source was not found')
  }

  const strips = resolvedAlertId
    ? await ecgAbnormalStripRepo.findByAlertId(resolvedAlertId)
    : []

  return {
    medicalRecord,
    alert,
    strips,
    reportType: sourceType,
    resolvedAlertId,
  }
}

// Tạo tên file báo cáo
const buildReportFileName = ({ medicalRecord, alert, reportType }) => {
  const identifier = medicalRecord?.id ?? alert?.id ?? Date.now()
  const prefix =
    reportType === 'medical_record' ? 'medical-record-report' : 'alert-report'
  return `${prefix}-${identifier}.pdf`
}

// Viết phần thông tin bệnh nhân
const writePatientSection = (doc, context) => {
  const patient = context.medicalRecord?.patient ?? context.alert?.patient
  const user = patient?.user
  const gender =
    patient?.gender === 'male'
      ? 'Nam'
      : patient?.gender === 'female'
        ? 'Nữ'
        : 'Khác'

  writeSectionTitle(doc, 'Thông tin bệnh nhân')
  writeKeyValue(doc, 'Họ và tên', user?.fullName)
  writeKeyValue(doc, 'Mã bệnh nhân', patient?.userId)
  writeKeyValue(doc, 'Ngày sinh', formatDateOnly(patient?.dateOfBirth))
  writeKeyValue(doc, 'Giới tính', gender)

  if (context.medicalRecord?.appointment?.scheduledAt) {
    writeKeyValue(
      doc,
      'Lịch khám',
      formatTime(context.medicalRecord.appointment.scheduledAt) +
        ', ' +
        formatDateOnly(context.medicalRecord.appointment.scheduledAt),
    )
  }

  if (context.alert?.triggerTimestamp) {
    writeKeyValue(
      doc,
      'Cảnh báo',
      formatTime(context.alert.triggerTimestamp) +
        ', ' +
        formatDateOnly(context.alert.triggerTimestamp),
    )
  }
}

// Viết phần nội dung hồ sơ bệnh án
const writeMedicalRecordSection = (doc, context) => {
  const record = context.medicalRecord
  if (!record) return

  writeSectionTitle(doc, 'Nội dung hồ sơ bệnh án')
  writeKeyValue(doc, 'Triệu chứng', record.symptoms)
  writeKeyValue(doc, 'Chẩn đoán', record.diagnosis)
  writeKeyValue(doc, 'Hướng điều trị', record.treatmentPlan)
  writeKeyValue(doc, 'Ghi chú', record.notes)

  const prescriptionRows = normalizePrescriptionRows(record.prescription)
  if (!prescriptionRows.length) return

  writeSectionTitle(doc, 'Đơn thuốc')
  writePrescriptionTable(doc, prescriptionRows)
}

// Viết phần biểu đồ ECG
const writeEcgSection = (doc, context) => {
  if (!context.strips.length) return

  writeSectionTitle(doc, 'Biểu đồ ECG 10 giây')

  context.strips.forEach((strip) => {
    const imageBuffer = drawEcgStripBuffer(strip)
    ensurePdfSpace(doc, 220)
    doc.image(imageBuffer, PDF_MARGIN, doc.y, {
      fit: [doc.page.width - PDF_MARGIN * 2, 190],
      align: 'center',
    })
    doc.moveDown(10)
  })
}

// Tạo file báo cáo
export const generatePdfFile = async (context, filePath) => {
  const title =
    context.reportType === 'medical_record'
      ? 'Báo cáo hồ sơ bệnh án'
      : 'Báo cáo cận lâm sàng từ cảnh báo'

  await new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: PDF_MARGIN,
    })
    const stream = fs.createWriteStream(filePath)

    doc.pipe(stream)
    registerPdfFonts(doc)
    doc
      .font(PDF_FONT.title)
      .fontSize(18)
      .fillColor('#0f172a')
      .text(title, { align: 'center' })

    writePatientSection(doc, context)
    if (context.reportType === 'medical_record')
      writeMedicalRecordSection(doc, context)
    writeEcgSection(doc, context)

    doc.end()

    stream.on('finish', resolve)
    stream.on('error', reject)
    doc.on('error', reject)
  })
}

// Upload file báo cáo lên Cloudinary
const uploadPdfToCloudinary = async (filePath, fileName) => {
  const rootFolder = env.CLOUDINARY_ROOT_FOLDER || 'telemedicine'
  const environment = env.NODE_ENV || 'development'

  const folder = `${rootFolder}/${environment}/medical-reports`

  return await cloudinary.uploader.upload(filePath, {
    resource_type: 'raw',
    folder,
    use_filename: true,
    unique_filename: true,
    filename_override: fileName.replace(/\.pdf$/i, ''),
    format: 'pdf',
  })
}

// Gửi thông báo khi báo cáo đã sẵn sàng
const notifyReportReady = async ({
  requesterDoctorId,
  fileUrl,
  medicalRecordId,
  alertId,
}) => {
  if (!requesterDoctorId || !fileUrl) return

  const targetId = medicalRecordId ?? alertId
  const type = medicalRecordId ? 'hồ sơ bệnh án' : 'cảnh báo'
  await createAndSendNotification({
    recipientId: requesterDoctorId,
    senderId: null,
    type: 'system',
    title: `File báo cáo cho ${type} ${targetId} đã sẵn sàng`,
    content: `File báo cáo cho ${type} ${targetId} đã sẵn sàng. Mở tại: ${fileUrl}`,
    referenceId: targetId,
  })
}

const processMedicalReportJob = async ({
  sourceType = 'medical_record',
  medicalRecordId = null,
  alertId = null,
  requesterDoctorId = null,
}) => {
  const cachedAttachment = await medicalAttachmentRepo.findAutoEcgReport({
    sourceType,
    medicalRecordId,
    alertId,
  })

  if (cachedAttachment) {
    await notifyReportReady({
      requesterDoctorId,
      fileUrl: cachedAttachment.fileUrl,
      medicalRecordId: cachedAttachment.medicalRecordId ?? medicalRecordId,
      alertId: cachedAttachment.alertId ?? alertId,
    })
    return cachedAttachment
  }

  const context = await resolveReportContext({
    sourceType,
    medicalRecordId,
    alertId,
  })
  const fileName = buildReportFileName(context)
  const tempFilePath = path.join(os.tmpdir(), `${Date.now()}-${fileName}`)

  try {
    await generatePdfFile(context, tempFilePath)
    const uploadResult = await uploadPdfToCloudinary(tempFilePath, fileName)

    const attachment = await medicalAttachmentRepo.saveAutoEcgReport({
      sourceType,
      medicalRecordId:
        sourceType === 'medical_record'
          ? (context.medicalRecord?.id ?? medicalRecordId)
          : null,
      alertId:
        sourceType === 'alert' ? (context.resolvedAlertId ?? alertId) : null,
      fileName,
      fileUrl: uploadResult.secure_url,
      fileType: 'pdf',
    })

    await notifyReportReady({
      requesterDoctorId,
      fileUrl: attachment.fileUrl,
      medicalRecordId: attachment.medicalRecordId,
      alertId: attachment.alertId,
    })

    return attachment
  } finally {
    if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath)
  }
}

/**
 * Enqueue a medical report job
 * @param {Object} data - The data for the job
 * @returns {Promise<Job>}
 */
export const enqueueMedicalReportJob = async (data) => {
  return await medicalQueue.add(EXPORT_REPORT_JOB, data, {
    attempts: 3,
    backoff: {
      type: 'fixed',
      delay: 30 * 1000,
    },
    removeOnComplete: true,
    removeOnFail: 20,
  })
}

/**
 * Start BullMQ worker that processes medical report jobs
 */
export const startMedicalReportWorker = async () => {
  if (medicalReportWorker) return medicalReportWorker

  medicalReportWorker = new Worker(
    MEDICAL_REPORT_QUEUE,
    async (job) => await processMedicalReportJob(job.data),
    {
      connection: workerConnection,
      concurrency: 2,
    },
  )

  medicalReportWorker.on('completed', (job) => {
    console.log(`[BullMQ] Completed medical report job ${job.id} (${job.name})`)
  })

  medicalReportWorker.on('failed', (job, error) => {
    console.error(
      `[BullMQ] Failed medical report job ${job?.id} (${job?.name}):`,
      error,
    )
  })

  console.log(
    `[BullMQ] Medical report worker started (${MEDICAL_REPORT_QUEUE})`,
  )

  return medicalReportWorker
}
