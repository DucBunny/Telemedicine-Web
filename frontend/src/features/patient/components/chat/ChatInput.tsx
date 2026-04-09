import {
  CirclePlus,
  ImagePlus,
  Paperclip,
  SendHorizontal,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ChatInputProps {
  value: string
  onChange: (val: string) => void
  onSend: () => void
  onFileSelect?: (file: File, type: 'image' | 'file') => void
  selectedFile?: { file: File; type: 'image' | 'file' } | null
  onClearFile?: () => void
  isUploading?: boolean
}

export const ChatInput = ({
  value,
  onChange,
  onSend,
  onFileSelect,
  selectedFile,
  onClearFile,
  isUploading,
}: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`
  }, [value])

  // Generate image preview
  useEffect(() => {
    if (selectedFile?.type === 'image') {
      const url = URL.createObjectURL(selectedFile.file)
      setImagePreview(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setImagePreview(null)
    }
  }, [selectedFile])

  const handleImageClick = () => {
    imageInputRef.current?.click()
  }

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onFileSelect) {
      const isImageFile = file.type.startsWith('image/')
      onFileSelect(file, isImageFile ? 'image' : 'file')
    }
    e.target.value = '' // Reset input
  }

  const handleClearFile = () => {
    onClearFile?.()
    setImagePreview(null)
  }

  const canSend = value.trim() || selectedFile

  return (
    <div className="z-60 border-t border-gray-300 bg-white px-3 py-3.5 pb-[max(env(safe-area-inset-bottom),16px)] md:ml-20 lg:ml-0">
      {/* File Preview */}
      {selectedFile && (
        <div className="mb-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="size-16 rounded object-cover"
            />
          ) : (
            <div className="flex size-16 items-center justify-center rounded bg-gray-200">
              <Paperclip className="size-6 text-gray-500" />
            </div>
          )}
          <div className="flex-1 truncate">
            <p className="truncate text-sm font-medium">
              {selectedFile.file.name}
            </p>
            <p className="text-xs text-gray-500">
              {(selectedFile.file.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleClearFile}
            className="shrink-0">
            <X className="size-4" />
          </Button>
        </div>
      )}

      <div className="flex w-full items-end gap-2">
        {/* Hidden file inputs */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
          onChange={handleFileChange}
          className="hidden"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              className="touch-manipulation rounded-full">
              <CirclePlus className="fill-teal-primary size-9 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="touch-manipulation">
            <DropdownMenuItem onSelect={handleImageClick}>
              <ImagePlus className="text-teal-primary size-4.5" />
              Hình ảnh
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleFileClick}>
              <Paperclip className="text-teal-primary size-4.5" />
              File
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex flex-1 shrink items-center gap-2 rounded-3xl border border-gray-200 px-4 py-2">
          <textarea
            name="message"
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="scrollbar-hide max-h-22 min-h-5.5 flex-1 resize-none bg-transparent text-base leading-5 focus:outline-none"
            rows={1}
          />
        </div>

        <Button
          type="button"
          size="icon-lg"
          onClick={onSend}
          disabled={!canSend || isUploading}
          className="bg-teal-primary rounded-full disabled:cursor-not-allowed disabled:opacity-50">
          <SendHorizontal className="size-5" strokeWidth="2.5" />
        </Button>
      </div>
    </div>
  )
}
