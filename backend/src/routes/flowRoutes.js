const express = require("express")
const router = express.Router()

const flowController = require("../controllers/flowController")

// Ruta de prueba
router.get("/", (req, res) => {
  res.send("Flow routes working")
})

router.get("/start", flowController.startFlow)

router.post("/start", flowController.startFlow)

router.post("/next", flowController.nextStep)

module.exports = router