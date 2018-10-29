/**
 * @fileoverview warn on the action that is used only in mapDispatchToProps
 * @author Alexandr Metreniuc
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-unused-action"),
  RuleTester = require("eslint").RuleTester

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: "module",
  ecmaFeatures: {
    jsx: true,
  },
}

var ruleTester = new RuleTester({ parserOptions })
ruleTester.run("no-unused-action", rule, {
  valid: [
    `
    import {action1} from './actions'

    const mapDispatchToProps = {
        propAction1: action1
    }
    
    const SomeContainer = withHandlers({
        onClick: ({propAction1}) => () => {
            propAction1()
        }
    })(SomeComponent)
    `,

    `
    import {action1} from './actions'

    const mapDispatchToProps = {
        propAction1: action1
    }
    
    class SomeClassComponent extends Component {
        render() {
          return (
              <button onClick={this.props.propAction1}>
                {this.props.children}
              </button>
          );
        }
    }
    `,

    `
    import {action1} from './actions'

    const mapDispatchToProps = {
        propAction1: action1
    }
    
    class SomeClassComponent extends Component {
        render() {
          return (
              <button onClick={() => this.props.propAction1()}>
                {this.props.children}
              </button>
          );
        }
    }
    `,
    `
    import {action1} from './actions'

    const mapDispatchToProps = {
        propAction1: action1
    }
    
    class SomeClassComponent extends Component {
        render() {
          const handler = () => this.props.propAction1()
          return (
              <button onClick={handler}>
                {this.props.children}
              </button>
          );
        }
    }
    `,
    `
    import {action1} from './actions'

    const mapDispatchToProps = {
        propAction1: action1
    }
    
    class SomeClassComponent extends Component {
        handleClick() {
            this.props.propAction1()
        }
        render() {
          return (
              <button onClick={this.handleClick}>
                {this.props.children}
              </button>
          );
        }
    }
    `,
    `
    import {action1} from './actions'

    const mapDispatchToProps = {
        propAction1: action1
    }
    
    class SomeClassComponent extends Component {
        render() {
          const {propAction1} = this.props
          return (
              <button onClick={propAction1}>
                {this.props.children}
              </button>
          );
        }
    }
    `,
  ],

  invalid: [
    {
      code: `
      import {action1, action2} from './actions'

      const mapDispatchToProps = {
          propAction1: action1,
          propAction2: action2
      }

      const SomeContainer = withHandlers({
          onClick: ({propAction1}) => () => {
              propAction1()
          }
      })(SomeComponent)
      `,
      errors: [
        {
          message: `"propAction2" is not used`,
        },
      ],
    },
    {
      code: `
        import {action1, action2} from './actions'

        const mapDispatchToProps = {
            propAction1: action1,
            propAction2: action2
        }

        class SomeClassComponent extends Component {
            render() {
              return (
                  <button onClick={this.props.propAction1}>
                    {this.props.children}
                  </button>
              );
            }
        }
        `,
      errors: [
        {
          message: `"propAction2" is not used`,
        },
      ],
    },
    {
      code: `
          import {action1, action2} from './actions'

          const mapDispatchToProps = {
              propAction1: action1,
              propAction2: action2
          }

          class SomeClassComponent extends Component {
              render() {
                return (
                    <button onClick={() => this.props.propAction1()}>
                      {this.props.children}
                    </button>
                );
              }
          }
          `,
      errors: [
        {
          message: `"propAction2" is not used`,
        },
      ],
    },
    {
      code: `
        import {action1, action2} from './actions'

        const mapDispatchToProps = {
            propAction1: action1,
            propAction2: action2
        }

        class SomeClassComponent extends Component {
            handleClick() {
                this.props.propAction1()
            }
            render() {
              return (
                  <button onClick={this.handleClick}>
                    {this.props.children}
                  </button>
              );
            }
        }
        `,
      errors: [
        {
          message: `"propAction2" is not used`,
        },
      ],
    },
    {
      code: `
      import {action1} from './actions'

      const mapDispatchToProps = {
          action1,
      }

      class SomeClassComponent extends Component {
          render() {
            return (
                <button>
                  {this.props.children}
                </button>
            );
          }
      }
            `,
      errors: [
        {
          message: `"action1" is not used`,
        },
      ],
    },
  ],
})
