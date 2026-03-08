export default function Message({ text }) {

  return (
    <div style={{
      padding: "10px",
      margin: "5px",
      background: "#eee",
      borderRadius: "8px"
    }}>
      {text}
    </div>
  )

}