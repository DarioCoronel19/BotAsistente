const fs = require("fs")
const path = require("path")

const modulesPath = path.join(__dirname, "../modules")

function loadModule(moduleName) {

  const file = path.join(modulesPath, `${moduleName}.json`)

  const raw = fs.readFileSync(file)

  return JSON.parse(raw)

}

module.exports = { loadModule }