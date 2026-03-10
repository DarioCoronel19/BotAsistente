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
            style={{ animationDelay: `${index * 0.1}s` }}
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
    no_internet: '📡',
    slow_internet: '🐢',
    device_issue: '💻',
    wifi_issue: '📶',
    wired_issue: '🔌',
    no_service: '🚫',
    slow_dns: '🔍',
    packet_loss: '📦',
    high_latency: '⏱️',
    intermittent: '↔️',
    hardware: '🔧',
    software: '💿',
    password: '🔑',
    account: '👤',
    default: '👉'
  }
  return icons[value] || icons.default
}

