const express = require("express")
const router = express.Router()

const flowController = require("../controllers/flowController")

router.post("/start", flowController.startFlow)

router.post("/next", flowController.nextStep)

module.exports = router