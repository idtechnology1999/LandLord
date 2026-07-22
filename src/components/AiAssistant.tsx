import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react'

interface Message {
  id: number
  role: 'user' | 'assistant'
  text: string
  timestamp: Date
}

const AI_RESPONSES: Record<string, string> = {
  greeting: "Hi! I'm LandLord AI, your student housing assistant. I can help you find the perfect place to live. What are you looking for?",
  help: "I can help you with:\n\n🏠 Finding housing in any country\n💰 Understanding rental prices\n📍 Exploring neighborhoods\n🔍 Filtering listings\n📋 Understanding the rental process\n\nJust ask me anything!",
  cheap: "Looking for affordable housing? Here are some tips:\n\n🇳🇬 **Nigeria**: Ibadan (₦200K-500K/yr), Enugu (₦150K-300K/yr)\n🇬🇭 **Ghana**: Kumasi (GH₵3K-5K/yr)\n🇰🇪 **Kenya**: Mombasa (KSh25K-45K/mo)\n\nUse the price filter on the Discover page to find options in your budget!",
  uk: "UK student housing options:\n\n🏙 **Manchester**: £500-900/mo - Great student area near universities\n🏙 **Birmingham**: £450-800/mo - More affordable, large student community\n🏙 **London**: £800-1,500/mo - Premium but well-connected\n🏙 **Edinburgh**: £550-950/mo - Beautiful city, good student life\n\nMost include bills. Use the Location filter → UK to explore!",
  nigeria: "Nigerian student housing:\n\n📍 **Ibadan**: UI area,₦200K-500K/year\n📍 **Lagos**: Yaba/Surulere, ₦300K-800K/year\n📍 **Abuja**: Wuse/Garki, ₦400K-900K/year\n📍 **Enugu**: UNN area, ₦150K-350K/year\n📍 **Port Harcourt**: UNIPORT area, ₦250K-600K/year\n\nRent is typically paid yearly. Most include water & power backup.",
  canada: "Canadian student housing:\n\n🍁 **Toronto**: CAD 1,200-2,200/mo - Top universities, vibrant city\n🍁 **Vancouver**: CAD 1,400-2,500/mo - Beautiful but expensive\n🍁 **Montreal**: CAD 800-1,500/mo - Most affordable, bilingual\n🍁 **Ottawa**: CAD 900-1,600/mo - University town, capital city\n\nMost include utilities. 12-month leases common.",
  safety: "Safety tips for student housing:\n\n✅ Check neighborhood safety scores on listing cards\n✅ Look for well-lit areas with good transport\n✅ Read reviews from other students\n✅ Verify the landlord is verified (blue checkmark)\n✅ Ask about security features (locks, CCTV, gate)\n\nAll our listings show Safety scores on the card!",
  amenities: "Common amenities to look for:\n\n🔑 **Essentials**: WiFi, water, power, furnished\n🏋️ **Premium**: Gym, pool, study room, laundry\n🚌 **Location**: Near campus, bus stops, shops\n👥 **Community**: Common areas, social events\n\nUse the amenity filters to find exactly what you need!",
  process: "How the rental process works:\n\n1️⃣ **Browse** - Use filters to find properties\n2️⃣ **Virtual Tour** - Click the 👁️ icon for 360° tours\n3️⃣ **Contact** - Message the landlord directly\n4️⃣ **Visit** - Schedule an in-person viewing\n5️⃣ **Agree** - Review terms and sign agreement\n6️⃣ **Pay** - Transfer deposit & first rent\n\nAlways verify the landlord before paying!",
  fallback: "I'm still learning! Here are some things I can help with:\n\n🏠 Finding housing by country\n💰 Budget-friendly options\n📍 Neighborhood information\n🔍 How to use the filters\n📋 Rental process guidance\n\nTry asking about housing in a specific country or city!"
}

function getAIResponse(input: string): string {
  const lower = input.toLowerCase()

  if (lower.match(/\b(hi|hello|hey|howdy|greetings)\b/)) return AI_RESPONSES.greeting
  if (lower.match(/\b(help|what can you|how do)\b/)) return AI_RESPONSES.help
  if (lower.match(/\b(cheap|affordable|budget|save|low cost|bargain)\b/)) return AI_RESPONSES.cheap
  if (lower.match(/\b(uk|united kingdom|britain|england|manchester|birmingham|london|edinburgh|leeds|bristol)\b/)) return AI_RESPONSES.uk
  if (lower.match(/\b(nigeria|naija|ibadan|lagos|abuja|enugu|port harcourt|ph)\b/)) return AI_RESPONSES.nigeria
  if (lower.match(/\b(canada|toronto|vancouver|montreal|ottawa|canadian)\b/)) return AI_RESPONSES.canada
  if (lower.match(/\b(safe|safety|security|crime|secure)\b/)) return AI_RESPONSES.safety
  if (lower.match(/\b(ameniti|facilities|wifi|furnished|gym|pool|laundry)\b/)) return AI_RESPONSES.amenities
  if (lower.match(/\b(process|how to|steps|rent|booking|book|sign up|register)\b/)) return AI_RESPONSES.process
  if (lower.match(/\b(ghana|accra|kumasi|kenya|nairobi|mombasa|south africa|johannesburg|cape town)\b/)) return "We have listings in that region! Use the Location filter on the Discover page to explore properties there. Click the 🌍 icon in the filter bar and select the country, then state/city, then area."
  if (lower.match(/\b(dark|dark mode|theme|light|night)\b/)) return "You can toggle Dark Mode using the Sun/Moon icon in the top-right corner of the header! It remembers your preference."
  if (lower.match(/\b(lang|language|yoruba|french|français)\b/)) return "We support 3 languages! Click the Globe icon 🌐 in the header to switch between English, Yorùbá (Yoruba), and Français (French)."
  if (lower.match(/\b(thank|thanks|cheers)\b/)) return "You're welcome! Happy house hunting! 🏠"
  if (lower.match(/\b(bye|goodbye|see you)\b/)) return "Goodbye! Come back anytime you need help finding your perfect student home! 🎓"

  return AI_RESPONSES.fallback
}

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      text: AI_RESPONSES.greeting,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  const handleSend = () => {
    const text = input.trim()
    if (!text) return

    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      text,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const aiMsg: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        text: getAIResponse(text),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMsg])
      setIsTyping(false)
    }, 800 + Math.random() * 700)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* FAB Button */}
      <button
        className={`ai-fab ${isOpen ? 'ai-fab--open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close AI assistant' : 'Open AI assistant'}
      >
        {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="ai-panel">
          {/* Header */}
          <div className="ai-panel__header">
            <div className="ai-panel__header-info">
              <div className="ai-panel__avatar">
                <Sparkles size={16} />
              </div>
              <div>
                <div className="ai-panel__title">LandLord AI</div>
                <div className="ai-panel__status">
                  <span className="ai-panel__status-dot" />
                  Always here to help
                </div>
              </div>
            </div>
            <button
              className="ai-panel__close"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="ai-panel__messages">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`ai-bubble ${msg.role === 'user' ? 'ai-bubble--user' : 'ai-bubble--ai'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="ai-bubble__icon">
                    <Bot size={14} />
                  </div>
                )}
                <div className="ai-bubble__text">
                  {msg.text.split('\n').map((line, i) => (
                    <span key={i}>
                      {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
                        part.startsWith('**') && part.endsWith('**')
                          ? <strong key={j}>{part.slice(2, -2)}</strong>
                          : part
                      )}
                      {i < msg.text.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </div>
                {msg.role === 'user' && (
                  <div className="ai-bubble__icon ai-bubble__icon--user">
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="ai-bubble ai-bubble--ai">
                <div className="ai-bubble__icon">
                  <Bot size={14} />
                </div>
                <div className="ai-bubble__typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="ai-panel__quick">
            {['Help me find housing', 'Cheap options', 'UK listings', 'Nigeria listings'].map(q => (
              <button
                key={q}
                className="ai-quick-btn"
                onClick={() => {
                  setInput(q)
                  setTimeout(() => handleSend(), 0)
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="ai-panel__input">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about housing..."
              className="ai-input"
            />
            <button
              className="ai-send"
              onClick={handleSend}
              disabled={!input.trim()}
              aria-label="Send"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
