export const TypingIndicator = () => {
  return (
    <div className="flex max-w-[80%] gap-2">
      {/* Avatar */}
      <div className="mt-auto mb-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
        BS
      </div>

      {/* Typing indicators */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-gray-300 bg-white px-4 py-3">
          <div className="bg-teal-primary size-1.5 animate-bounce rounded-full [animation-delay:-0.3s]" />
          <div className="bg-teal-primary size-1.5 animate-bounce rounded-full [animation-delay:-0.15s]" />
          <div className="bg-teal-primary size-1.5 animate-bounce rounded-full" />
        </div>
      </div>
    </div>
  )
}
