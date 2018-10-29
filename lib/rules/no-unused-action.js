/**
 * @fileoverview warn on the action that is used only in mapDispatchToProps
 * @author Alexandr Metreniuc
 */
"use strict"

const { dot, hasName, isCallExpression } = require("../utils")

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

  // TODO There are containers that passes actions down to the component
  // ex: PayPalButtonContainer
  // solution: if it's not a shorthand we can skip assuming that this is a mapping
  create: function(context) {
    var getScopedVariables = (scope, vars = []) => {
      const variables = scope.variables.map(x => ({
        name: x.name,
        defType: x.defs[0] && x.defs[0].type,
      }))
      vars.push(...variables)

      const { childScopes } = scope
      if (childScopes.length === 0) {
        return
      }

      childScopes.forEach(s => getScopedVariables(s, vars))
      return vars
    }
    const declaredActions = []
    const usedProps = []
    let mdpNode
    let unusedActionsFromScope = []

    return {
      // gather all action used in the function or class scope
      Identifier(node) {
        if (!hasName("mapDispatchToProps", node)) {
          return
        }

        // usage in connect
        if (isCallExpression(node.parent)) {
          return
        }

        mdpNode = node

        const actions = dot("init.properties", node.parent) || []
        const mdpProps = actions.map(a => ({
          key: a.key.name,
          value: a.value.name,
          shorthand: a.shorthand,
        }))
        const keys = mdpProps.map(a => a.key)
        declaredActions.push(...keys)

        const scope = context.getScope()

        const scopedVars = getScopedVariables(scope)

        const unusedActions = mdpProps.filter(
          action =>
            !scopedVars.some(
              scoped =>
                // ignore import scoped var if shorthand
                action.shorthand
                  ? scoped.name === action.value &&
                    scoped.type === "ImportBinding"
                  : scoped.name === action.key
            )
        )

        if (scopedVars.length > 0 && unusedActions.length > 0) {
          unusedActionsFromScope = unusedActions.map(x => x.key)
        }
      },

      // gather all props used via "this.props"
      MemberExpression(node) {
        const propsAccess = dot("object.property.name", node)
        if (propsAccess) {
          usedProps.push(node.property.name)
        }
      },

      "Program:exit"() {
        const unusedActionsFromInstance = declaredActions.filter(
          a => !usedProps.includes(a)
        )

        const unusedAction = unusedActionsFromInstance.find(a =>
          unusedActionsFromScope.includes(a)
        )

        if (unusedAction) {
          context.report({
            message: `"${unusedAction}" is not used`,
            node: mdpNode,
          })
        }
      },
    }
  },
}
