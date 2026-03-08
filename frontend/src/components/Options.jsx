export default function Options({ options, onSelect }) {

  return (

    <div>

      {options.map(opt => (

        <button
          key={opt.value}
          onClick={() => onSelect(opt.value)}
          style={{ margin: "5px", padding: "10px" }}
        >
          {opt.label}
        </button>

      ))}

    </div>

  )

}