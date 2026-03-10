import './Message.css'

export default function Message({ text, isUser = false }) {
  return (
    <div className={`message ${isUser ? 'user' : 'bot'}`}>
      <p>{text}</p>
    </div>
  )
}

