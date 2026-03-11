const { loadModule } = require("../utils/moduleLoader")

// State to track current ticket
let currentTicket = {
  id: null,
  status: 'open',
  currentModule: 'intake',
  currentStep: 'welcome',
  history: [],
  slaStartTime: null,
  slaDeadline: null
}

/**
 * Inicia el flujo desde el módulo de intake (M1)
 */
function start() {
  currentTicket = {
    id: generateTicketId(),
    status: 'open',
    currentModule: 'intake',
    currentStep: 'welcome',
    history: [],
    slaStartTime: new Date().toISOString(),
    slaDeadline: null
  }

  const module = loadModule("intake")
  // Find welcome step or use first step
  let step = module.steps.find(s => s.id === 'welcome')
  if (!step) {
    step = module.steps[0]
    currentTicket.currentStep = step.id
  }

  return {
    ticket: {
      id: currentTicket.id,
      status: currentTicket.status
    },
    module: module.module,
    moduleName: module.module,
    step: step.id,
    message: step.message,
    options: step.options
  }
}

/**
 * Avanza al siguiente paso en el flujo
 * @param {string} moduleName - Nombre del módulo actual
 * @param {string} stepId - ID del paso actual
 * @param {string} answer - Respuesta seleccionada por el usuario
 */
function next(moduleName, stepId, answer) {
  // Validate module exists
  const module = loadModule(moduleName)
  
  // Find current step
  const step = module.steps.find(s => s.id === stepId)
  
  if (!step) {
    return { error: "Step not found: " + stepId }
  }

  // Find selected option
  const option = step.options.find(o => o.value === answer)
  
  if (!option) {
    return { error: "Invalid option: " + answer }
  }

  // Update ticket history
  currentTicket.history.push({
    module: moduleName,
    step: stepId,
    answer: answer,
    timestamp: new Date().toISOString()
  })

  // Determine next module and step
  let nextModuleName = option.next_module || moduleName
  let nextStepId = option.next_step

  // If no specific step, find first step of next module
  if (!nextStepId) {
    const nextModule = loadModule(nextModuleName)
    if (nextModule && nextModule.steps.length > 0) {
      nextStepId = nextModule.steps[0].id
    }
  }

  // Load next module and step
  const nextModule = loadModule(nextModuleName)
  const nextStep = nextModule.steps.find(s => s.id === nextStepId)

  if (!nextStep) {
    return { 
      error: "Next step not found: " + nextStepId + " in module " + nextModuleName 
    }
  }

  // Update current ticket state
  currentTicket.currentModule = nextModuleName
  currentTicket.currentStep = nextStepId

  // Check for ticket closure
  if (nextModuleName === 'intake' && nextStepId === 'welcome') {
    currentTicket.status = 'closed'
    currentTicket.slaDeadline = null
  }

  // Calculate SLA for verification step
  if (nextModuleName === 'closure' && nextStepId === 'check_sla') {
    const slaHours = 24
    const deadline = new Date()
    deadline.setHours(deadline.getHours() + slaHours)
    currentTicket.slaDeadline = deadline.toISOString()
  }

  return {
    ticket: {
      id: currentTicket.id,
      status: currentTicket.status,
      slaDeadline: currentTicket.slaDeadline
    },
    module: nextModule.module,
    moduleName: nextModule.name,
    step: nextStep.id,
    message: nextStep.message,
    options: nextStep.options,
    history: currentTicket.history
  }
}

/**
 * Obtiene el estado actual del ticket
 */
function getTicketStatus() {
  return {
    ticket: currentTicket,
    module: currentTicket.currentModule,
    step: currentTicket.currentStep
  }
}

/**
 * Reinicia el flujo
 */
function reset() {
  return start()
}

/**
 * Genera un ID de ticket único
 */
function generateTicketId() {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `TKT-${timestamp}-${random}`.toUpperCase()
}

module.exports = { 
  start, 
  next, 
  getTicketStatus,
  reset 
}

