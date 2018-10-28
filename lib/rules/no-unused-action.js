/**
 * @fileoverview warn on the action that is used only in mapDispatchToProps
 * @author Alexandr Metreniuc
 */
"use strict"

const { flatten, map, compose, prop, filter } = require("ramda")
const { dot, hasName, isFunctionScope } = require("../utils")

module.exports = {
  meta: {
    docs: {
      description: "warn on the action that is used only in mapDispatchToProps",
      category: "Redux",
      recommended: false,
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ],
  },

  create: function(context) {
    const funcScopedVariables = compose(
      map(prop("name")),
      flatten,
      map(prop("variables")),
      filter(isFunctionScope)
    )
    const declaredActions = []
    const usedProps = []
    let mdpNode

    return {
      Identifier(node) {
        if (!hasName("mapDispatchToProps", node)) {
          return
        }
        mdpNode = node

        const actions = dot("init.properties", node.parent) || []
        const keys = actions.map(a => a.key.name)
        declaredActions.push(...keys)

        const scope = context.getScope()

        const { childScopes } = scope
        const scopedVars = funcScopedVariables(childScopes)
        const unusedAction = keys.find(k => !scopedVars.includes(k))

        if (scopedVars.length > 0 && unusedAction) {
          context.report({ message: `${unusedAction} is not used`, node })
        }
      },

      // this part is for classes
      MemberExpression(node) {
        const propsAccess = dot("object.property.name", node)
        if (propsAccess) {
          usedProps.push(node.property.name)
        }
      },

      "Program:exit"() {
        const unusedAction = declaredActions.find(a => !usedProps.includes(a))

        if (usedProps.length > 0 && unusedAction) {
          context.report({
            message: `${unusedAction} is not used`,
            node: mdpNode,
          })
        }
      },
    }
  },
}
