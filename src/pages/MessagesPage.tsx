import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { MessageCircle, Send, ArrowRight, Search, CheckCheck } from 'lucide-react'

type ContextType = { openAuth: (prompt?: string) => void; isLoggedIn: boolean }

const conversations = [
  { id: 1, name: 'Mr. Adewale', avatar: 'A', property: 'Sunset View Apartment', lastMessage: 'The apartment is still available. Would you like to schedule a visit?', time: '2m ago', unread: true, online: true },
  { id: 2, name: 'Mrs. Okafor', avatar: 'O', property: 'Cozy Student Haven', lastMessage: 'I can offer a discount if you pay upfront for the year.', time: '1h ago', unread: true, online: false },
  { id: 3, name: 'Chief Adeyemi', avatar: 'E', property: 'Golden Gate Lodge', lastMessage: 'Thanks for your interest! The rent includes utility bills.', time: '3h ago', unread: false, online: true },
]

const messages = [
  { id: 1, from: 'landlord', text: 'Hello! Thanks for your interest in Sunset View Apartment.', time: '10:30 AM' },
  { id: 2, from: 'user', text: 'Hi! Is the apartment still available?', time: '10:32 AM' },
  { id: 3, from: 'landlord', text: 'Yes, it is! The apartment is still available. Would you like to schedule a visit?', time: '10:33 AM' },
]

export default function MessagesPage() {
  const { openAuth, isLoggedIn } = useOutletContext<ContextType>()
  const [activeChat, setActiveChat] = useState<number | null>(null)
  const [newMessage, setNewMessage] = useState('')

  if (!isLoggedIn) {
    return (
      <div className="page-content">
        <div className="empty-state">
          <div className="empty-state-icon" style={{ background: 'linear-gradient(135deg, var(--navy-100), var(--navy-50))' }}>
            <MessageCircle className="w-8 h-8" style={{ color: 'var(--navy-500)' }} />
          </div>
          <h2 className="empty-state-title">Message landlords directly</h2>
          <p className="empty-state-text">Ask questions, schedule visits, and negotiate rent — all in one place.</p>
          <button onClick={() => openAuth('Sign in to start messaging')} className="empty-state-btn tap-target">
            Sign In to Get Started <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  const activeConversation = conversations.find((c) => c.id === activeChat)

  return (
    <div className="page-content">
      <div className="messages-page">
        <div className={`messages-sidebar ${activeChat ? 'messages-sidebar--hidden-mobile' : ''}`}>
          <div className="messages-sidebar-header">
            <h2>Messages</h2>
            <div className="messages-search">
              <Search className="w-4 h-4" />
              <input type="text" placeholder="Search conversations..." />
            </div>
          </div>
          <div className="messages-list">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveChat(conv.id)}
                className={`messages-conversation tap-target ${activeChat === conv.id ? 'is-active' : ''}`}
              >
                <div className="messages-avatar">
                  {conv.avatar}
                  {conv.online && <span className="messages-online-dot" />}
                </div>
                <div className="messages-conv-info">
                  <div className="messages-conv-header">
                    <span className="messages-conv-name">{conv.name}</span>
                    <span className="messages-conv-time">{conv.time}</span>
                  </div>
                  <p className="messages-conv-property">{conv.property}</p>
                  <p className="messages-conv-preview">{conv.lastMessage}</p>
                </div>
                {conv.unread && <span className="messages-unread-dot" />}
              </button>
            ))}
          </div>
        </div>

        <div className={`messages-chat ${activeChat ? 'messages-chat--visible' : ''}`}>
          {activeConversation ? (
            <>
              <div className="messages-chat-header">
                <button onClick={() => setActiveChat(null)} className="messages-back-btn tap-target">←</button>
                <div className="messages-avatar messages-avatar--small">{activeConversation.avatar}</div>
                <div>
                  <p className="messages-chat-name">{activeConversation.name}</p>
                  <p className="messages-chat-property">{activeConversation.property}</p>
                </div>
              </div>
              <div className="messages-chat-body">
                {messages.map((msg) => (
                  <div key={msg.id} className={`message-bubble ${msg.from === 'user' ? 'message-bubble--sent' : 'message-bubble--received'}`}>
                    <p>{msg.text}</p>
                    <span className="message-time">
                      {msg.time}
                      {msg.from === 'user' && <CheckCheck className="w-3.5 h-3.5" style={{ color: 'var(--coral-400)' }} />}
                    </span>
                  </div>
                ))}
              </div>
              <div className="messages-chat-input">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                />
                <button className="messages-send-btn tap-target">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="messages-empty-chat">
              <MessageCircle className="w-12 h-12" style={{ color: 'var(--navy-200)' }} />
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
