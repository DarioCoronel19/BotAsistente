import axios from "axios"

const API = "http://localhost:3001/flow"

export const startFlow = async () => {

  const res = await axios.post(`${API}/start`)

  return res.data

}

export const nextStep = async (data) => {

  const res = await axios.post(`${API}/next`, data)

  return res.data

}