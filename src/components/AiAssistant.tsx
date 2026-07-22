import { useState, useRef, useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, X, Send, Bot, User, Sparkles, Star, MapPin, Home } from 'lucide-react'
import { allListings as listings } from '../data/listings'
import type { Listing } from '../data/listings'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: ReactNode
  timestamp: Date
}

function matchListings(input: string) {
  const lower = input.toLowerCase()
  const keywords: Record<string, string[]> = {
    ibadan: ['ibadan'],
    lagos: ['lagos'],
    abuja: ['abuja'],
    enugu: ['enugu'],
    'port harcourt': ['port harcourt', 'ph'],
    manchester: ['manchester'],
    birmingham: ['birmingham'],
    london: ['london'],
    edinburgh: ['edinburgh'],
    leeds: ['leeds'],
    bristol: ['bristol'],
    accra: ['accra'],
    kumasi: ['kumasi'],
    nairobi: ['nairobi'],
    mombasa: ['mombasa'],
    johannesburg: ['johannesburg'],
    pretoria: ['pretoria'],
    'cape town': ['cape town'],
    stellenbosch: ['stellenbosch'],
    toronto: ['toronto'],
    vancouver: ['vancouver'],
    montreal: ['montreal'],
    ottawa: ['ottawa'],
    sydney: ['sydney'],
    melbourne: ['melbourne'],
    brisbane: ['brisbane'],
    berlin: ['berlin'],
    munich: ['munich'],
    amsterdam: ['amsterdam'],
    rotterdam: ['rotterdam'],
    nigeria: ['nigeria', 'naija'],
    uk: ['uk', 'united kingdom', 'britain', 'england'],
    ghana: ['ghana'],
    kenya: ['kenya'],
    'south africa': ['south africa'],
    canada: ['canada'],
    australia: ['australia'],
    germany: ['germany'],
    netherlands: ['netherlands', 'holland'],
    ui: ['ui', 'ibadan', 'university of ibadan'],
    unilag: ['unilag', 'lagos'],
    abu: ['abu', 'abuja'],
    uoym: ['manchester', 'uom'],
    uob: ['birmingham', 'uob'],
    ucl: ['london', 'ucl'],
    uoe: ['edinburgh', 'uoe'],
    mcgill: ['montreal', 'mcgill'],
    ubc: ['vancouver', 'ubc'],
    uoft: ['toronto', 'uoft'],
  }

  let matchedIds: number[] = []
  let cityName = ''

  for (const [city, words] of Object.entries(keywords)) {
    if (words.some(w => lower.includes(w))) {
      const found = listings.filter((l: Listing) =>
        l.state.toLowerCase() === city || l.country.toLowerCase() === city || l.location.toLowerCase().includes(city)
      )
      if (found.length > 0) {
        matchedIds = found.map(l => l.id)
        cityName = city.charAt(0).toUpperCase() + city.slice(1)
        break
      }
    }
  }

  return { matchedIds, cityName }
}

function renderListingCards(ids: number[]) {
  const found = listings.filter((l: Listing) => ids.includes(l.id)).slice(0, 6)
  if (found.length === 0) return null

  return (
    <div className="ai-listing-results">
      {found.map(l => (
        <Link key={l.id} to={`/home/listing/${l.id}`} className="ai-listing-card" onClick={(e) => e.stopPropagation()}>
          <img src={l.image} alt={l.title} className="ai-listing-card__img" />
          <div className="ai-listing-card__info">
            <div className="ai-listing-card__title">{l.title}</div>
            <div className="ai-listing-card__loc">
              <MapPin size={10} /> {l.location}
            </div>
            <div className="ai-listing-card__bottom">
              <span className="ai-listing-card__price">
                {l.country === 'Nigeria' ? '₦' : l.country === 'United Kingdom' ? '£' : l.country === 'Ghana' ? 'GH₵' : l.country === 'Kenya' ? 'KSh' : l.country === 'South Africa' ? 'R' : l.country === 'Germany' || l.country === 'Netherlands' ? '€' : '$'}
                {l.price}
                {l.country === 'Nigeria' ? '/yr' : '/mo'}
              </span>
              <span className="ai-listing-card__meta">
                <Star size={10} /> {l.rating} · {l.beds}bd · {l.baths}ba
              </span>
            </div>
          </div>
        </Link>
      ))}
      {ids.length > 6 && (
        <Link to="/home" className="ai-listing-more" onClick={(e) => e.stopPropagation()}>
          <Home size={14} /> View all {ids.length} listings →
        </Link>
      )}
    </div>
  )
}

function getAIResponse(input: string): ReactNode {
  const lower = input.toLowerCase()
  const { matchedIds, cityName } = matchListings(input)

  if (lower.match(/\b(hi|hello|hey|howdy|greetings)\b/)) {
    return "Hi! I'm LandLord AI, your student housing assistant. I can help you find the perfect place to live. What are you looking for?"
  }
  if (lower.match(/\b(help|what can you|how do)\b/)) {
    return "I can help you with:\n\n🏠 Finding housing in any country\n💰 Understanding rental prices\n📍 Exploring neighborhoods\n🔍 Filtering listings\n📋 Understanding the rental process\n\nJust ask me anything!"
  }
  if (lower.match(/\b(thank|thanks|cheers)\b/)) {
    return "You're welcome! Happy house hunting! 🏠"
  }
  if (lower.match(/\b(bye|goodbye|see you)\b/)) {
    return "Goodbye! Come back anytime you need help finding your perfect student home! 🎓"
  }
  if (lower.match(/\b(dark|dark mode|theme|light|night)\b/)) {
    return "You can toggle Dark Mode using the Sun/Moon icon in the top-right corner of the header! It remembers your preference."
  }
  if (lower.match(/\b(lang|language|yoruba|french|français)\b/)) {
    return "We support 3 languages! Click the Globe icon 🌐 in the header to switch between English, Yorùbá (Yoruba), and Français (French)."
  }
  if (lower.match(/\b(safe|safety|security|crime|secure)\b/)) {
    return "Safety tips for student housing:\n\n✅ Check neighborhood safety scores on listing cards\n✅ Look for well-lit areas with good transport\n✅ Read reviews from other students\n✅ Verify the landlord is verified (blue checkmark)\n✅ Ask about security features (locks, CCTV, gate)\n\nAll our listings show Safety scores on the card!"
  }
  if (lower.match(/\b(ameniti|facilities|wifi|furnished|gym|pool|laundry)\b/)) {
    return "Common amenities to look for:\n\n🔑 **Essentials**: WiFi, water, power, furnished\n🏋️ **Premium**: Gym, pool, study room, laundry\n🚌 **Location**: Near campus, bus stops, shops\n👥 **Community**: Common areas, social events\n\nUse the amenity filters to find exactly what you need!"
  }
  if (lower.match(/\b(process|how to|steps|rent|booking|book|sign up|register)\b/)) {
    return "How the rental process works:\n\n1️⃣ **Browse** - Use filters to find properties\n2️⃣ **Virtual Tour** - Click the 👁️ icon for 360° tours\n3️⃣ **Contact** - Message the landlord directly\n4️⃣ **Visit** - Schedule an in-person viewing\n5️⃣ **Agree** - Review terms and sign agreement\n6️⃣ **Pay** - Transfer deposit & first rent\n\nAlways verify the landlord before paying!"
  }
  if (lower.match(/\b(cheap|affordable|budget|save|low cost|bargain)\b/)) {
    return "Looking for affordable housing? Here are some options:\n\n🇳🇬 **Nigeria**: Ibadan (₦150K-500K/yr), Enugu (₦120K-220K/yr)\n🇬🇭 **Ghana**: Kumasi (GH₵1,200-3,200/yr)\n🇰🇪 **Kenya**: Nairobi (KSh25K-45K/mo)\n\nI can show you specific listings — just tell me a city!"
  }

  if (matchedIds.length > 0) {
    const count = matchedIds.length
    return (
      <>
        <span>I found <strong>{count} listing{count > 1 ? 's' : ''}</strong> in <strong>{cityName}</strong>! Here are the top matches:</span>
        {renderListingCards(matchedIds)}
        <span style={{ marginTop: 6, display: 'block' }}>
          💡 Click any card to view full details, or use the <strong>Location filter</strong> on the Discover page to see all {count} results.
        </span>
      </>
    )
  }

  return "I'm still learning! Here are some things I can help with:\n\n🏠 Finding housing by country or city\n💰 Budget-friendly options\n📍 Neighborhood information\n🔍 How to use the filters\n📋 Rental process guidance\n\nTry asking about housing in a specific city like Ibadan, Lagos, Manchester, Toronto, or Sydney!"
}

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: "Hi! I'm LandLord AI, your student housing assistant. Ask me about housing anywhere — I'll show you real listings with direct links!",
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
      content: text,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const aiMsg: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: getAIResponse(text),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMsg])
      setIsTyping(false)
    }, 600 + Math.random() * 600)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const renderContent = (content: ReactNode) => {
    if (typeof content === 'string') {
      return content.split('\n').map((line, i) => (
        <span key={i}>
          {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
            part.startsWith('**') && part.endsWith('**')
              ? <strong key={j}>{part.slice(2, -2)}</strong>
              : part
          )}
          {i < content.split('\n').length - 1 && <br />}
        </span>
      ))
    }
    return content
  }

  return (
    <>
      <button
        className={`ai-fab ${isOpen ? 'ai-fab--open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close AI assistant' : 'Open AI assistant'}
      >
        {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {isOpen && (
        <div className="ai-panel">
          <div className="ai-panel__header">
            <div className="ai-panel__header-info">
              <div className="ai-panel__avatar">
                <Sparkles size={16} />
              </div>
              <div>
                <div className="ai-panel__title">LandLord AI</div>
                <div className="ai-panel__status">
                  <span className="ai-panel__status-dot" />
                  {listings.length} listings worldwide
                </div>
              </div>
            </div>
            <button className="ai-panel__close" onClick={() => setIsOpen(false)} aria-label="Close">
              <X size={18} />
            </button>
          </div>

          <div className="ai-panel__messages">
            {messages.map(msg => (
              <div key={msg.id} className={`ai-bubble ${msg.role === 'user' ? 'ai-bubble--user' : 'ai-bubble--ai'}`}>
                {msg.role === 'assistant' && (
                  <div className="ai-bubble__icon"><Bot size={14} /></div>
                )}
                <div className="ai-bubble__text">{renderContent(msg.content)}</div>
                {msg.role === 'user' && (
                  <div className="ai-bubble__icon ai-bubble__icon--user"><User size={14} /></div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="ai-bubble ai-bubble--ai">
                <div className="ai-bubble__icon"><Bot size={14} /></div>
                <div className="ai-bubble__typing"><span /><span /><span /></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="ai-panel__quick">
            {['Houses in Ibadan', 'Lagos listings', 'UK housing', 'Cheap options', 'Toronto', 'Accra'].map(q => (
              <button key={q} className="ai-quick-btn" onClick={() => { setInput(q); setTimeout(() => handleSend(), 0) }}>
                {q}
              </button>
            ))}
          </div>

          <div className="ai-panel__input">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about housing in any city..."
              className="ai-input"
            />
            <button className="ai-send" onClick={handleSend} disabled={!input.trim()} aria-label="Send">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
