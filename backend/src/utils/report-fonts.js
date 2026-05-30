import fs from 'fs'
import path from 'path'
import { registerFont } from 'canvas'

/** PDFKit font names (one per TTF in src/assets/fonts) */
export const PDF_FONT = {
  /** NotoSerif-Bold — tiêu đề báo cáo */
  title: 'ReportNotoSerifBold',
  /** NotoSerif-Regular — tiêu đề section */
  section: 'ReportNotoSerifRegular',
  /** NotoSerif-Italic — dòng phụ (thời gian tạo, ghi chú nhẹ) */
  meta: 'ReportNotoSerifItalic',
  /** Roboto-Bold — nhãn trường */
  label: 'ReportRobotoBold',
  /** Roboto-Regular — nội dung */
  body: 'ReportRobotoRegular',
  /** Roboto-Italic — danh sách đơn thuốc / chú thích phụ */
  emphasis: 'ReportRobotoItalic',
}

const FONT_FILES = {
  robotoRegular: 'Roboto-Regular.ttf',
  robotoBold: 'Roboto-Bold.ttf',
  robotoItalic: 'Roboto-Italic.ttf',
  notoSerifRegular: 'NotoSerif-Regular.ttf',
  notoSerifBold: 'NotoSerif-Bold.ttf',
  notoSerifItalic: 'NotoSerif-Italic.ttf',
}

const CANVAS_SERIF = 'ReportNotoSerif'
const CANVAS_SANS = 'ReportRoboto'

let fontsDirCache = null
let canvasFontsReady = false

// Build canvas font string
const buildCanvasFontString = (
  size,
  family,
  { bold = false, italic = false } = {},
) => {
  const parts = []
  if (italic) parts.push('italic')
  if (bold) parts.push('bold')
  parts.push(`${size}px`, family)
  return parts.join(' ')
}

/**
 * Resolve `src/assets/fonts` for dev (babel-node) and production (`build/src/assets/fonts`).
 */
export const getReportFontsDir = () => {
  if (fontsDirCache) return fontsDirCache

  const candidates = [
    path.join(__dirname, '../assets/fonts'),
    path.join(process.cwd(), 'src/assets/fonts'),
    path.join(process.cwd(), 'build/src/assets/fonts'),
  ]

  const dir = candidates.find((candidate) =>
    Object.values(FONT_FILES).every((file) =>
      fs.existsSync(path.join(candidate, file)),
    ),
  )

  if (!dir) {
    throw new Error(
      'Report fonts incomplete. Expected all Roboto and NotoSerif TTF files in src/assets/fonts.',
    )
  }

  fontsDirCache = dir
  return dir
}

/**
 * Đăng ký font cho PDFKit
 * @param {PDFDocument} doc - PDF document
 */
export const registerPdfFonts = (doc) => {
  const dir = getReportFontsDir()

  doc.registerFont(PDF_FONT.body, path.join(dir, FONT_FILES.robotoRegular))
  doc.registerFont(PDF_FONT.label, path.join(dir, FONT_FILES.robotoBold))
  doc.registerFont(PDF_FONT.emphasis, path.join(dir, FONT_FILES.robotoItalic))
  doc.registerFont(
    PDF_FONT.section,
    path.join(dir, FONT_FILES.notoSerifRegular),
  )
  doc.registerFont(PDF_FONT.title, path.join(dir, FONT_FILES.notoSerifBold))
  doc.registerFont(PDF_FONT.meta, path.join(dir, FONT_FILES.notoSerifItalic))
}

/**
 * Đảm bảo font cho canvas
 */
export const ensureCanvasFonts = () => {
  if (canvasFontsReady) return

  const dir = getReportFontsDir()

  registerFont(path.join(dir, FONT_FILES.robotoRegular), {
    family: CANVAS_SANS,
  })
  registerFont(path.join(dir, FONT_FILES.robotoBold), {
    family: CANVAS_SANS,
    weight: 'bold',
  })
  registerFont(path.join(dir, FONT_FILES.robotoItalic), {
    family: CANVAS_SANS,
    style: 'italic',
  })
  registerFont(path.join(dir, FONT_FILES.notoSerifRegular), {
    family: CANVAS_SERIF,
  })
  registerFont(path.join(dir, FONT_FILES.notoSerifBold), {
    family: CANVAS_SERIF,
    weight: 'bold',
  })
  registerFont(path.join(dir, FONT_FILES.notoSerifItalic), {
    family: CANVAS_SERIF,
    style: 'italic',
  })

  canvasFontsReady = true
}

/** Noto Serif — tiêu đề biểu đồ ECG */
export const canvasSerifFont = (size, options) =>
  buildCanvasFontString(size, CANVAS_SERIF, options)

/** Roboto — chú thích biểu đồ ECG */
export const canvasSansFont = (size, options) =>
  buildCanvasFontString(size, CANVAS_SANS, options)
