import { useState, useEffect } from 'react'
import { MessageSquare, Send } from 'lucide-react'
import { messagesApi } from '../services/api'

export default function InboxPage() {
  const [conversations, setConversations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    setIsLoading(true)
    try {
      const data = await messagesApi.getConversations()
      setConversations(data)
    } catch (error) {
      console.error('Failed to load conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-main"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Inbox</h1>

      {conversations.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-card">
          <MessageSquare className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No messages yet</h3>
          <p className="text-neutral-600">Messages from ride bookings will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conv, index) => (
            <div key={index} className="bg-white rounded-xl shadow-card p-4 flex items-center gap-4 cursor-pointer hover:bg-neutral-50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-lg font-semibold text-primary-main">{conv.name?.charAt(0) || 'U'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-neutral-900 truncate">{conv.name || 'Unknown User'}</p>
                <p className="text-sm text-neutral-500 truncate">{conv.lastMessage || 'No messages'}</p>
              </div>
              <Send className="w-5 h-5 text-neutral-400" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
