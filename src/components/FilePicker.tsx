
import { useRef } from 'react'

export default function FilePicker({
  accept = '*/*',
  multiple = true,
  onPick
}: {
  accept?: string
  multiple?: boolean
  onPick: (files: File[]) => void
}){
  const ref = useRef<HTMLInputElement>(null)
  function open(){ ref.current?.click() }
  function change(e: React.ChangeEvent<HTMLInputElement>){
    const files = Array.from(e.target.files || [])
    if (files.length) onPick(files)
    e.target.value = ''
  }
  return (
    <>
      <input ref={ref} type="file" accept={accept} multiple={multiple} className="hidden" onChange={change} />
      <button type="button" onClick={open} className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700">
        Datei hinzufügen
      </button>
    </>
  )
}
