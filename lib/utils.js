const { compose, curry, equals, path, anyPass } = require("ramda")

const dot = curry((p, obj) => path(p.split("."), obj))

const isOfType = curry((type, node) =>
  compose(
    equals(type),
    dot("type")
  )(node)
)

const hasName = curry((name, node) =>
  compose(
    equals(name),
    dot("name")
  )(node)
)

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
