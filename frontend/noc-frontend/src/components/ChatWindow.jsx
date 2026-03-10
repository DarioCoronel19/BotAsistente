import { useState, useEffect, useRef } from 'react'
import { startFlow, nextStep } from '../services/api'
import Message from './Message'
import Options from './Options'
import './ChatWindow.css'

export default function ChatWindow() {
  const [flow, setFlow] = useState(null)
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    // Iniciar el flujo del chat
    startFlow().then((data) => {
      setFlow(data)
      setHistory([{ type: 'bot', message: data.message, options: data.options }])
    }).catch((error) => {
      console.error('Error al iniciar el flujo:', error)
      setHistory([{ 
        type: 'bot', 
        message: 'Lo siento, hubo un problema al iniciar el asistente. Por favor, recarga la página.',
        options: [] 
      }])
    })
  }, [])

  useEffect(() => {
    // Desplazar hacia abajo cuando hay nuevos mensajes
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const handleOption = async (option) => {
    // Añadir selección del usuario al historial
    const userMessage = option.label || option.value
    setHistory(prev => [...prev, { type: 'user', message: userMessage }])
    
    setIsLoading(true)
    
    try {
      const next = await nextStep({
        module: flow.module,
        step: flow.step,
        answer: option.value
      })
      
      setFlow(next)
      setHistory(prev => [...prev, { type: 'bot', message: next.message, options: next.options }])
    } catch (error) {
      console.error('Error:', error)
      setHistory(prev => [...prev, { 
        type: 'bot', 
        message: 'Lo siento, ocurrió un error. Por favor, intenta de nuevo.',
        options: [] 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  if (!flow && history.length === 0) {
    return (
      <div className="chat-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <span className="loading-text">Cargando asistente...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {history.map((item, index) => (
          <div key={index} className={`message-wrapper ${item.type}`}>
            {item.type === 'bot' && (
              <div className="bot-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v1.5a.75.75 0 001 .5V6a.75.75 0 00.75-.75 2.25 2.25 0 014.5 0v1.5a.75.75 0 001 .5V6a.75.75 0 00.75-.75 2.25 2.25 0 014.5 0v1.5a.75.75 0 001 .5V6a.75.75 0 00.75-.75 2.25 2.25 0 014.5 0v1.5a.75.75 0 001 .5v1.5a.75.75 0 01-.5.707 9.707 9.707 0 01-5.25 1.533A9.685 9.685 0 0112 22.5a9.716 9.716 0 01-5.25-1.467z" />
                </svg>
              </div>
            )}
            <div className="message-content">
              <Message text={item.message} isUser={item.type === 'user'} />
              {item.options && item.options.length > 0 && (
                <Options options={item.options} onSelect={handleOption} disabled={isLoading} />
              )}
            </div>
            {item.type === 'user' && (
              <div className="user-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="message-wrapper bot">
            <div className="bot-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v1.5a.75.75 0 001 .5V6a.75.75 0 00.75-.75 2.25 2.25 0 014.5 0v1.5a.75.75 0 001 .5V6a.75.75 0 00.75-.75 2.25 2.25 0 014.5 0v1.5a.75.75 0 001 .5V6a.75.75 0 00.75-.75 2.25 2.25 0 014.5 0v1.5a.75.75 0 001 .5v1.5a.75.75 0 01-.5.707 9.707 9.707 0 01-5.25 1.533A9.685 9.685 0 0112 22.5a9.716 9.716 0 01-5.25-1.467z" />
              </svg>
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
    </div>
  )
}

