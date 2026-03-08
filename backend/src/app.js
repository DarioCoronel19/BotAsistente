const express = require("express")
const cors = require("cors")

const flowRoutes = require("./routes/flowRoutes")

const app = express()

app.use(cors())
app.use(express.json())

app.use("/flow", flowRoutes)

const PORT = 3001

app.listen(PORT, () => {
  console.log("NOC Flow Engine running on port", PORT)
})