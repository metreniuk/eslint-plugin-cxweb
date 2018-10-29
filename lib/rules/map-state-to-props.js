/**
 * @fileoverview prefer structured selector to a function
 * @author Alexandr Metreniuc
 */
"use strict"
const { last } = require("ramda")
const {
  dot,
  hasName,
  isVariableDeclarator,
  isFunctionDeclaration,
  isFunction,
  isCallExpression,
} = require("../utils")

module.exports = {
  meta: {
    docs: {
      description: "prefer structured selector to a function",
      category: "stylistic",
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ],
  },

  // TODO before reporting check if every selector calls like selector(state, ?props)
  // ref: CheckoutContainer, FooterCotnainer, HeaderAvatarContainer, BundleUpsellFooterContainer, ChannelUpsellContainer
  // TODO dissalow inline mapStateToProps
  // ex: AutoFillInputContainer
  create: function(context) {
    return {
      Identifier(node) {
        if (!hasName("mapStateToProps", node)) {
          return
        }

        const { parent } = node

        // usage in connect
        if (isCallExpression(parent)) {
          return
        }

        // const varDeclaratorParamsLength = dot("init.params.length", parent)
        const varDeclaratorBody = dot("init.body.body", parent)
        const varDeclaratorBodyLength =
          varDeclaratorBody && dot("length", varDeclaratorBody)

        if (
          isVariableDeclarator(parent) &&
          // (varDeclaratorParamsLength !== 1 || varDeclaratorBodyLength !== 1)
          varDeclaratorBodyLength !== 1
        ) {
          return
        }

        // const funcLength = dot("params.length", parent)
        const funcBody = dot("body.body", parent)
        const funcBodyLength = funcBody && dot("length", funcBody)
        if (
          isFunctionDeclaration(parent) &&
          // (funcLength !== 1 || funcBodyLength !== 1)
          funcBodyLength !== 1
        ) {
          return
        }

        const body = varDeclaratorBody || funcBody
        const returnStatement = body && last(body)
        const argument = returnStatement && dot("argument", returnStatement)

        if (argument && isFunction(argument)) {
          return
        }

        context.report({
          message: "mapStateToProps should be a structured selector",
          node,
        })
      },
    }
  },
}
