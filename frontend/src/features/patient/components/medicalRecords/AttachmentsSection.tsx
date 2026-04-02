import { Download, FileText, Paperclip } from 'lucide-react'
import type { MedicalAttachment } from '@/features/patient/types'
import { formatShortDate } from '@/lib/format-date'

interface AttachmentsSectionProps {
  attachments: Array<MedicalAttachment>
}

export const AttachmentsSection = ({
  attachments,
}: AttachmentsSectionProps) => {
  if (attachments.length === 0) return null

  return (
    <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-100 bg-teal-50/50 px-4 py-3">
        <Paperclip className="text-teal-primary size-5" strokeWidth="2.5" />
        <h3 className="text-base font-semibold tracking-tight text-gray-500 uppercase">
          File đính kèm ({attachments.length})
        </h3>
      </div>

      <div className="space-y-2 p-3">
        {attachments.map((file) => (
          <div
            key={file.id}
            className="hover:border-teal-primary/50 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-all">
            {/* Thumbnail / icon */}
            <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
              {file.fileType.includes('image') ? (
                <img
                  src={file.fileUrl}
                  alt={file.fileName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <FileText className="text-teal-primary size-6" />
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1 space-y-1">
              <p
                className="truncate text-sm font-medium text-slate-800"
                title={file.fileName}>
                {file.fileName}
              </p>
              <p className="text-xs text-slate-500 uppercase">
                {file.fileType} • {formatShortDate(file.uploadedAt)}
              </p>
            </div>

            {/* Download */}
            <a
              href={file.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-teal-primary shrink-0 rounded-full p-3 text-slate-500 transition-colors hover:bg-teal-50">
              <Download className="size-4" />
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
