import { Tldraw, Editor, TLStore } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { useCallback, useState } from 'react'
import { supabase } from '@/utils/supabase'
import { Toast } from './Toast'

interface TLDrawBoardProps {
  onSave?: (data: any) => void
}

export function TLDrawBoard({ onSave }: TLDrawBoardProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error' | 'info'
  } | null>(null)
  const [editor, setEditor] = useState<Editor | null>(null)

  const handleMount = useCallback((editor: Editor) => {
    setEditor(editor)
    console.log('TLDraw mounted', editor)
  }, [])

  const handleSave = useCallback(async () => {
    if (!editor) return

    try {
      setIsSaving(true)
      const snapshot = editor.store.getSnapshot()
      
      const { error } = await supabase
        .from('board_data')
        .insert([
          {
            content: snapshot,
            created_at: new Date().toISOString(),
          },
        ])

      if (error) throw error

      setToast({
        message: 'Board saved successfully!',
        type: 'success'
      })
      
      onSave?.(snapshot)
    } catch (error) {
      console.error('Error saving to Supabase:', error)
      setToast({
        message: 'Failed to save board',
        type: 'error'
      })
    } finally {
      setIsSaving(false)
    }
  }, [editor, onSave])

  return (
    <div className="w-full h-[calc(100vh-4rem)] relative">
      <div className="absolute inset-0">
        <Tldraw
          onMount={handleMount}
        />
      </div>
      
      <button
        onClick={handleSave}
        disabled={isSaving}
        className={`absolute top-4 right-4 px-4 py-2 rounded-md text-white transition-colors
          ${isSaving 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600'
          }`}
      >
        {isSaving ? (
          <span className="flex items-center">
            <i className="fas fa-spinner fa-spin mr-2" />
            Saving...
          </span>
        ) : (
          <span className="flex items-center">
            <i className="fas fa-save mr-2" />
            Save
          </span>
        )}
      </button>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}