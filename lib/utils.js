const { curry, path, anyPass, propEq } = require("ramda")

const dot = curry((p, obj) => path(p.split("."), obj))

const isOfType = propEq("type")

const hasName = propEq("name")

const isVariableDeclarator = isOfType("VariableDeclarator")
const isObjectExpression = isOfType("ObjectExpression")
const isFunctionDeclaration = isOfType("FunctionDeclaration")
const isFunction = anyPass([
  isOfType("FunctionExpression"),
  isOfType("ArrowFunctionExpression"),
])

module.exports = {
  dot,
  isOfType,
  hasName,
  isVariableDeclarator,
  isObjectExpression,
  isFunctionDeclaration,
  isFunction,
}
