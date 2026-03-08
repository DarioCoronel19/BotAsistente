const flowEngine = require("../services/flowEngine")

exports.startFlow = (req, res) => {

  const result = flowEngine.start()

  res.json(result)

}

exports.nextStep = (req, res) => {

  const { module, step, answer } = req.body

  const result = flowEngine.next(module, step, answer)

  res.json(result)

}