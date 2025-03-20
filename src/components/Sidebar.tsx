import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'

interface BoardData {
  id: number
  content: any
  created_at: string
}

interface SidebarProps {
  onSelectBoard: (content: any) => void
}

export function Sidebar({ onSelectBoard }: SidebarProps) {
  const [boards, setBoards] = useState<BoardData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBoards() {
      try {
        setIsLoading(true)
        const { data, error } = await supabase
          .from('board_data')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error

        setBoards(data || [])
      } catch (err) {
        console.error('Error fetching boards:', err)
        setError('Failed to load boards')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBoards()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <i className="fas fa-exclamation-circle mr-2" />
        {error}
      </div>
    )
  }

  return (
    <div className="w-64 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">History</h2>
        {boards.length === 0 ? (
          <p className="text-gray-500">No saved boards yet</p>
        ) : (
          <div className="space-y-4">
            {boards.map((board) => (
              <button
                key={board.id}
                onClick={() => onSelectBoard(board.content)}
                className="w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 
                  transition-colors text-left group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Board #{board.id}
                  </span>
                  <i className="fas fa-chevron-right text-gray-400 
                    group-hover:text-gray-600" />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatDate(board.created_at)}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}