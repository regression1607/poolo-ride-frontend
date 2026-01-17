import { useState, useEffect, useRef } from 'react'
import { MessageSquare, Send, ArrowLeft, RefreshCw } from 'lucide-react'
import { messagesApi } from '../services/api'
import { useAuthStore } from '../store/authStore'

interface Conversation {
  id: string
  partnerId: string
  partnerName: string
  rideId: string
  route: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  message: string
  sent_at: string
  is_read: boolean
}

export default function InboxPage() {
  const { user } = useAuthStore()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.partnerId)
    }
  }, [selectedConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadConversations = async () => {
    setIsLoading(true)
    try {
      const data = await messagesApi.getConversations()
      // Map API response to expected format (handle different field names)
      const mapped = data.map((conv: any) => ({
        id: conv.id || conv._id || `${conv.ride_id}-${conv.partner_id}`,
        partnerId: conv.partnerId || conv.partner_id || conv.receiver_id || conv.sender_id,
        partnerName: conv.partnerName || conv.partner_name || conv.name || conv.partner?.name || 'Unknown User',
        rideId: conv.rideId || conv.ride_id,
        route: conv.route || (conv.ride ? `${conv.ride.pickup_address} → ${conv.ride.drop_address}` : 'Unknown Route'),
        lastMessage: conv.lastMessage || conv.last_message || conv.message || '',
        lastMessageTime: conv.lastMessageTime || conv.last_message_time || conv.sent_at || '',
        unreadCount: conv.unreadCount || conv.unread_count || 0,
      }))
      setConversations(mapped)
    } catch (error) {
      console.error('Failed to load conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMessages = async (rideId: string) => {
    setMessagesLoading(true)
    try {
      const data = await messagesApi.getMessages(rideId)
      // Map API response to expected format
      const mapped = data.map((msg: any) => ({
        id: msg.id || msg._id,
        sender_id: msg.sender_id || msg.senderId,
        receiver_id: msg.receiver_id || msg.receiverId,
        message: msg.message || msg.message_text || msg.content || '',
        sent_at: msg.sent_at || msg.sentAt || msg.created_at || msg.createdAt,
        is_read: msg.is_read || msg.isRead || false,
      }))
      setMessages(mapped)
    } catch (error) {
      console.error('Failed to load messages:', error)
    } finally {
      setMessagesLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return

    const messageText = newMessage.trim()
    
    // Optimistic update - add message immediately (WhatsApp-like)
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      sender_id: user.id,
      receiver_id: selectedConversation.partnerId,
      message: messageText,
      sent_at: new Date().toISOString(),
      is_read: false,
    }
    
    setMessages((prev) => [...prev, optimisticMessage])
    setNewMessage('')

    try {
      await messagesApi.send({
        receiver_id: selectedConversation.partnerId,
        ride_id: selectedConversation.rideId,
        message: messageText,
      })
      // Silent refresh to sync with server (no loading spinner)
      const data = await messagesApi.getMessages(selectedConversation.partnerId)
      const mapped = data.map((msg: any) => ({
        id: msg.id || msg._id,
        sender_id: msg.sender_id || msg.senderId,
        receiver_id: msg.receiver_id || msg.receiverId,
        message: msg.message || msg.message_text || msg.content || '',
        sent_at: msg.sent_at || msg.sentAt || msg.created_at || msg.createdAt,
        is_read: msg.is_read || msg.isRead || false,
      }))
      setMessages(mapped)
    } catch (error) {
      console.error('Failed to send message:', error)
      // Remove optimistic message on failure
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id))
      alert('Failed to send message')
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-main"></div>
      </div>
    )
  }

  // Chat View
  if (selectedConversation) {
    return (
      <div className="flex flex-col h-[calc(100vh-180px)]">
        {/* Chat Header */}
        <div className="bg-white rounded-t-xl shadow-card p-4 flex items-center gap-3">
          <button
            onClick={() => setSelectedConversation(null)}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-600" />
          </button>
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="font-semibold text-primary-main">
              {(selectedConversation.partnerName || 'U').charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-neutral-900">{selectedConversation.partnerName || 'Unknown User'}</p>
            <p className="text-xs text-primary-main">{selectedConversation.route}</p>
          </div>
          <button
            onClick={() => loadMessages(selectedConversation.partnerId)}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-neutral-50 p-4 space-y-3">
          {messagesLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-main"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-10 text-neutral-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 text-neutral-300" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isOwn = msg.sender_id === user?.id
              const showDate = index === 0 || 
                formatDate(messages[index - 1].sent_at) !== formatDate(msg.sent_at)

              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="text-center my-4">
                      <span className="bg-neutral-200 text-neutral-600 text-xs px-3 py-1 rounded-full">
                        {formatDate(msg.sent_at)}
                      </span>
                    </div>
                  )}
                  <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                        isOwn
                          ? 'bg-primary-main text-white rounded-br-md'
                          : 'bg-white text-neutral-900 shadow-sm rounded-bl-md'
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${isOwn ? 'text-primary-100' : 'text-neutral-400'}`}>
                        {formatTime(msg.sent_at)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white rounded-b-xl shadow-card p-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main/20 focus:border-primary-main"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="p-3 bg-primary-main text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Conversations List
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Inbox</h1>
        <button
          onClick={loadConversations}
          className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {conversations.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-card">
          <MessageSquare className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No messages yet</h3>
          <p className="text-neutral-600">When you book or publish rides, you can chat with other riders here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conv, index) => (
            <div
              key={conv.id || `conv-${index}`}
              onClick={() => setSelectedConversation(conv)}
              className="bg-white rounded-xl shadow-card p-4 flex items-center gap-4 cursor-pointer hover:bg-neutral-50 transition-colors"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary-main">
                    {conv.partnerName?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                {conv.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary-main rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">{conv.unreadCount}</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold text-neutral-900">{conv.partnerName || 'Unknown User'}</p>
                  <span className="text-xs text-neutral-400">{conv.lastMessageTime}</span>
                </div>
                <p className="text-xs text-primary-main mb-1">{conv.route}</p>
                <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'text-neutral-900 font-medium' : 'text-neutral-500'}`}>
                  {conv.lastMessage || 'No messages'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
