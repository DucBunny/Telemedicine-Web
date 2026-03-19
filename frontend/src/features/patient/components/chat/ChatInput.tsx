import { CirclePlus, SendHorizontal } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'

interface ChatInputProps {
  value: string
  onChange: (val: string) => void
  onSend: () => void
}

export const ChatInput = ({ value, onChange, onSend }: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`
  }, [value])

  // useEffect(() => {
  //   if (typeof window === 'undefined' || !window.visualViewport) return

  //   const updateKeyboardOffset = () => {
  //     const viewport = window.visualViewport
  //     if (!viewport) return

  //     const offset = Math.max(
  //       0,
  //       window.innerHeight - viewport.height - viewport.offsetTop,
  //     )
  //     setKeyboardOffset(offset)
  //   }

  //   updateKeyboardOffset()
  //   window.visualViewport.addEventListener('resize', updateKeyboardOffset)
  //   // window.visualViewport.addEventListener('scroll', updateKeyboardOffset)

  //   return () => {
  //     window.visualViewport?.removeEventListener('resize', updateKeyboardOffset)
  //     // window.visualViewport?.removeEventListener('scroll', updateKeyboardOffset)
  //   }
  // }, [])

  // Send message on Enter key press (without Shift)
  // const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  //   if (e.key === 'Enter' && value.trim() && !e.shiftKey) {
  //     e.preventDefault()
  //     onSend()
  //   }
  // }

  return (
    <div className="z-60 border-t border-gray-300 bg-white px-3 py-3.5 pb-[max(env(safe-area-inset-bottom),16px)] md:ml-20 lg:ml-0">
      <div className="flex w-full items-end gap-2">
        <Button variant="ghost" size="icon-lg" className="rounded-full">
          <CirclePlus className="fill-teal-primary size-9 text-white" />
        </Button>

        <div className="flex flex-1 shrink items-center gap-2 rounded-3xl border border-gray-200 px-4 py-2">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            // onKeyDown={handleKeyDown}
            placeholder="Nhập tin nhắn..."
            className="scrollbar-hide max-h-22 min-h-5.5 flex-1 resize-none bg-transparent text-base leading-5 focus:outline-none"
            rows={1}
          />
        </div>

        <Button
          size="icon-lg"
          onClick={onSend}
          disabled={!value.trim()}
          className="bg-teal-primary rounded-full disabled:cursor-not-allowed disabled:opacity-50">
          <SendHorizontal className="size-5" strokeWidth="2.5" />
        </Button>
      </div>
    </div>
  )
}
