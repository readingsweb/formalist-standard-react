import { List } from 'immutable'
import React from 'react'
import classNames from 'classnames'
import optionClassNames from '../../../utils/option-class-names'

// Components
import RadioButton from '../../ui/radio-button'

const StringDisplayRadio = React.createClass({
  propTypes: {
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    config: React.PropTypes.object,
    onChange: React.PropTypes.func.isRequired
  },

  render () {
    let { config, onChange, name, value } = this.props

    let optionValues = config.option_values
    // Return nothing if we have no values
    if (optionValues && optionValues.count() === 0) {
      return false
    }

    let stringFieldClassNames = classNames(
      'fm-field-string',
      'fm-field-string--radio',
      'fm-radio-group',
      optionClassNames('fm-field-string', config.display_options)
    )

    return (
      <div className={stringFieldClassNames}>
        {optionValues.map((option, i) => {
          let optionValue, optionLabel
          if (List.isList(option)) {
            optionValue = option.get(0)
            optionLabel = option.get(1) || optionValue
          } else {
            optionValue = option
            optionLabel = option
          }
          let defaultChecked = (value && optionValue === value)
          return (
            <RadioButton key={i} name={name} label={optionLabel} value={optionValue} defaultChecked={defaultChecked} onChange={onChange}/>
          )
        })}
      </div>
    )
  }
})

export default StringDisplayRadio
