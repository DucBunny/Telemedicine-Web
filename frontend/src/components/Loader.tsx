export default function LoaderScreen() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="border-teal-primary flex size-10 animate-spin items-center justify-center rounded-full border-4 border-t-transparent" />
    </div>
  )
}

export function LoaderItem() {
  return (
    <div className="border-teal-primary size-5 animate-spin rounded-full border-2 border-t-transparent" />
  )
}
