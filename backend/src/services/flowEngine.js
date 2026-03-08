const { loadModule } = require("../utils/moduleLoader")

function start() {

  const module = loadModule("intake")

  const step = module.steps[0]

  return {
    module: module.module,
    step: step.id,
    message: step.message,
    options: step.options
  }

}

function next(moduleName, stepId, answer) {

  const module = loadModule(moduleName)

  const step = module.steps.find(s => s.id === stepId)

  const option = step.options.find(o => o.value === answer)

  if (!option) {
    return { error: "Invalid option" }
  }

  if (option.next_module) {

    const nextModule = loadModule(option.next_module)

    const nextStep = nextModule.steps[0]

    return {
      module: nextModule.module,
      step: nextStep.id,
      message: nextStep.message,
      options: nextStep.options
    }

  }

  const nextStep = module.steps.find(s => s.id === option.next_step)

  return {
    module: module.module,
    step: nextStep.id,
    message: nextStep.message,
    options: nextStep.options
  }

}

module.exports = { start, next }