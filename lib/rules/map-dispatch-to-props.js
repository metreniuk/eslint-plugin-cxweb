const R = require("ramda")

/**
 * @fileoverview prefer object literal
 * @author Alexandr Metreniuc
 */
;("use strict")

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: "prefer object literal",
      category: "Fill me in",
      recommended: false,
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ],
  },

  create: function(context) {
    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    const { compose, curry, equals, prop, ifElse, isNil, identity, path } = R

    const safeProp = propName => ifElse(isNil, identity, prop(propName))
    const isOfType = curry((type, node) =>
      compose(
        equals(type),
        safeProp("type")
      )(node)
    )

    const hasName = curry((name, node) =>
      compose(
        equals(name),
        safeProp("name")
      )(node)
    )

    const isVariableDeclarator = isOfType("VariableDeclarator")
    const isObjectExpression = isOfType("ObjectExpression")
    const isFunctionDeclaration = isOfType("FunctionDeclaration")

    function shouldIgnore(node) {
      const isObjExpression =
        isVariableDeclarator(node.parent) &&
        isObjectExpression(node.parent.init)
      const isMDP = hasName("mapDispatchToProps")
      const isMDPDeclaration =
        isMDP &&
        (isVariableDeclarator(node.parent) ||
          isFunctionDeclaration(node.parent))
      const hasSimpleForm =
        isMDPDeclaration &&
        !isObjExpression &&
        hasSingleParam(node) &&
        hasReturnOnly(node)

      return !isMDPDeclaration || isObjectExpression || !hasSimpleForm
    }

    function hasSingleParam(path) {
      const parent = path.parent.init || path.parent
      return parent && parent.params && parent.params.length === 1
    }

    function hasReturnOnly(node) {
      const { body } = getDeclarationBlock(node)
      return body.length === 1
    }

    function getDeclarationBlock(node) {
      const { parent } = node
      return isVariableDeclarator(parent) ? parent.init.body : parent.body
    }

    return {
      // give me methods
      Identifier(node) {
        if (!hasName("mapDispatchToProps", node)) {
          return
        }

        const { parent } = node

        const varDeclaratorLength = path(["init", "params", "length"], parent)
        const funcLength = path(["params", "length"], parent)

        if (varDeclaratorLength === 1 || funcLength === 1) {
          context.report({
            message: "mapDispatchToProps should be an object literal",
            node,
          })
        }
      },
    }
  },
}
