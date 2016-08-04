import React, {Component} from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import classNames from 'classnames'
import { List } from 'immutable'
import extractComponent from '../../../utils/extract-component'

// Import components
import FieldErrors from '../common/errors'
import FieldHeader from '../common/header'
import Sortable from '../../ui/sortable'
import Popout from '../../ui/popout'
import SearchSelector from '../../ui/search-selector'

// Import styles
import styles from './search-multi-selection-field.mcss'

/**
 * Default component for representing a "selected/selection" item
 * @param  {Object} props Taking the shape of:
 *
 * {
 *   option: { label: 'foo'}
 *  }
 *
 * I.e., expecting the option to have a `label` key with a string value.
 *
 * @return {ReactElement}
 */
const SelectDefault = ({option}) => (
  <div>
    {option.label}
  </div>
)

SelectDefault.propTypes = {
  option: React.PropTypes.shape({
    label: React.PropTypes.string
  })
}

/**
 * Search Selection field
 *
 * Handles the singular select of a
 *
 */
class SearchMultiSelectionField extends Component {

  constructor (props) {
    super(props)

    // Initial state
    this.state = {
      selections: props.selections,
      selectorFocus: false,
      selectorQuery: null,
    }

    // Bindings
    this.onChange = this.onChange.bind(this)
    this.onChooseClick = this.onChooseClick.bind(this)
    this.onSelection = this.onSelection.bind(this)
    this.onRemove = this.onRemove.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.openSelector = this.openSelector.bind(this)
    this.closeSelector = this.closeSelector.bind(this)
    this.toggleSelector = this.toggleSelector.bind(this)
    this.onPopoutOpen = this.onPopoutOpen.bind(this)
    this.onSelectorBlur = this.onSelectorBlur.bind(this)
    this.onSelectorFocus = this.onSelectorFocus.bind(this)
    this.onSelectorQueryChange = this.onSelectorQueryChange.bind(this)
  }

  /**
   * onChange handler
   *
   * @param  {Event} e Change event from a form input/select
   */
  onChange (values, selections) {
    this.props.actions.edit(
      (val) => {
        return values
      }
    )
    this.setState({
      selections,
    })
  }

  /**
   * On choose click, open selector
   * @return {Null}
   */
  onChooseClick (e) {
    e.preventDefault()
    this.toggleSelector()
  }

  /**
   * When selected item is removed
   * @param {Number} index Index of the item to remove
   * @return {Null}
   */
  onRemove (index) {
    const {value} = this.props
    const {selections} = this.state
    this.onChange(
      value.delete(index),
      selections.delete(index)
    )
  }

  /**
   * When selected item is removed
   * @return {Null}
   */
  onDrop (newOrder) {
    const value = this.props.value.slice()
    const selections = this.state.selections.slice()
    const updatedValue = newOrder.map((index) => (
      value.get(index)
    ))
    const updatedSelections = newOrder.map((index) => (
      selections.get(index)
    ))
    this.onChange(
      List(updatedValue),
      List(updatedSelections)
    )
  }

  /**
   * When a selection is made, trigger change and close the selector
   * @return {Null}
   */
  onSelection (id, selection) {
    let {value} = this.props
    value = value || List()
    // Exists already? Remove it
    const index = value.indexOf(id)
    if (index > -1) {
      this.onRemove(index)
    } else {
      const {selections} = this.state
      this.onChange(
        value.push(id),
        selections.push(selection)
      )
    }
  }

  /**
   * Open the selector popout
   * @return {Null}
   */
  openSelector () {
    this._popout.openPopout()
  }

  /**
   * Close the selector popout
   * @return {Null}
   */
  closeSelector () {
    this._popout.closePopout()
  }

  /**
   * Toggle the selector popout
   * @return {Null}
   */
  toggleSelector () {
    this._popout.togglePopout()
  }

  /**
   * On popout open, focus the search input
   * @return {Null}
   */
  onPopoutOpen () {
    this._selector.focusSearch()
  }

  /**
   * On selector focus
   * @param  {Event} e Keyboard event
   * @return {Null}
   */
  onSelectorFocus (e) {
    this.setState({
      selectorFocus: true,
    })
  }

  /**
   * On selector blur
   * @param  {Event} e Keyboard event
   * @return {Null}
   */
  onSelectorBlur (e) {
    this.setState({
      selectorFocus: false,
    })
  }

  onSelectorQueryChange (selectorQuery) {
    this.setState({
      selectorQuery,
    })
  }

  render () {
    const {attributes, config, errors, hint, label, name, value} = this.props
    const {placeholder, selector_label, render_option_as, render_selection_as} = attributes
    const {selections, selectorFocus, selectorQuery} = this.state
    const hasErrors = (errors.count() > 0)

    // Set up field classes
    const fieldClassNames = classNames(
      styles.base,
      {
        [`${styles.baseInline}`]: attributes.inline
      }
    )

    // Determine the selection/selected display components
    let Option = SelectDefault
    let Selection = SelectDefault

    // Extract them from the passed `config.components` if it exists
    if (config.components) {
      if (render_option_as) {
        Option = extractComponent(config.components, render_option_as) || Option
      }
      if (render_selection_as) {
        Selection = extractComponent(config.components, render_selection_as) || Selection
      }
    }

    // Selections
    const numberOfSelections = selections.count()

    return (
      <div className={fieldClassNames}>
        <div className={styles.header}>
          <FieldHeader id={name} label={label} hint={hint} error={hasErrors} />
        </div>
        <div className={styles.display}>
          <button className={styles.wrapper} onClick={this.onChooseClick}>
            <div className={styles.selectionPlaceholder}>
              {placeholder || 'Make a selection'}
              {(numberOfSelections > 0) ? ` (${numberOfSelections} selected)` : null}
            </div>
            <Popout ref={(r) => this._popout = r} placement='left' onClose={this.onPopoutClose} onOpen={this.onPopoutOpen} closeOnEsc={!selectorFocus || !selectorQuery} closeOnOutsideClick>
              <div className={styles.openSelectorButton}>
                {selector_label || 'Select'}
              </div>
              <SearchSelector
                ref={(r) => this._selector = r}
                onSelection={this.onSelection}
                onBlur={this.onSelectorBlur}
                onFocus={this.onSelectorFocus}
                onQueryChange={this.onSelectorQueryChange}
                optionComponent={Option}
                params={attributes.search_params}
                perPage={attributes.search_per_page}
                query={selectorQuery}
                selectedIds={(value) ? value.toJS() : []}
                threshold={attributes.search_threshold}
                url={attributes.search_url} />
            </Popout>
          </button>
        </div>
        {
          (numberOfSelections > 0)
          ? <div id={name} className={styles.selectedItems}>
            <Sortable canRemove onRemove={this.onRemove} onDrop={this.onDrop}>
              {selections.map((option, index) => <Selection key={`${index}_${option.id}`} option={option} />)}
            </Sortable>
          </div>
          : null
        }
        {(hasErrors) ? <FieldErrors errors={errors} /> : null}
      </div>
    )
  }
}

/**
 * Enable parent to pass context
 */
SearchMultiSelectionField.contextTypes = {
 globalConfig: React.PropTypes.object
}

/**
 * PropTypes
 * @type {Object}
 */
SearchMultiSelectionField.propTypes = {
  actions: React.PropTypes.object,
  name: React.PropTypes.string,
  config: React.PropTypes.object,
  attributes: React.PropTypes.shape({
    label: React.PropTypes.string,
    hint: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    inline: React.PropTypes.bool,
    selections: ImmutablePropTypes.list,
    search_url: React.PropTypes.string,
    search_per_page: React.PropTypes.number,
    search_params: React.PropTypes.object,
    search_threshold: React.PropTypes.number,
    selector_label: React.PropTypes.string,
    render_option_as: React.PropTypes.string,
    render_selection_as: React.PropTypes.string
  }),
  hint: React.PropTypes.string,
  label: React.PropTypes.string,
  errors: ImmutablePropTypes.list,
  value: ImmutablePropTypes.list
}

SearchMultiSelectionField.defaultProps = {
  selections: List(),
}

export default SearchMultiSelectionField
