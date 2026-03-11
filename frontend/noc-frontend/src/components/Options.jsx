import './Options.css'

export default function Options({ options, onSelect, disabled = false }) {
  if (!options || options.length === 0) return null

  return (
    <div className="options-container">
      <div className="options-grid">
        {options.map((option, index) => (
          <button
            key={index}
            className="option-button"
            onClick={() => onSelect(option)}
            disabled={disabled}
          >
            <span className="option-icon">
              {getOptionIcon(option.value)}
            </span>
            <span className="option-label">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function getOptionIcon(value) {
  const icons = {
    // Network issues
    no_internet: '📡',
    slow_internet: '🐢',
    wifi_issue: '📶',
    wired_issue: '🔌',
    no_service: '🚫',
    slow_dns: '🔍',
    packet_loss: '📦',
    high_latency: '⏱️',
    intermittent: '↔️',
    
    // Device issues
    device_issue: '💻',
    hardware: '🔧',
    software: '💿',
    
    // Account issues
    password: '🔑',
    account: '👤',
    
    // Actions/Status
    restart: '🔄',
    escalate: '⬆️',
    resolve: '✅',
    close: '❌',
    cancel: '🚪',
    
    // Default
    default: '👉'
  }
  return icons[value] || icons.default
}

