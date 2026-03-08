import { useState, useEffect } from "react"
import { startFlow, nextStep } from "../services/api"

import Message from "./Message"
import Options from "./Options"

export default function ChatWindow() {

  const [flow, setFlow] = useState(null)

  useEffect(() => {

    startFlow().then(setFlow)

  }, [])

  const handleOption = async (value) => {

    const next = await nextStep({
      module: flow.module,
      step: flow.step,
      answer: value
    })

    setFlow(next)

  }

  if (!flow) return <div>Loading...</div>

  return (

    <div>

      <Message text={flow.message} />

      <Options options={flow.options} onSelect={handleOption} />

    </div>

  )

}