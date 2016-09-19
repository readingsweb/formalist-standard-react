import React, {Component} from 'react'
import styles from './pagination.mcss'

class Pagination extends Component {
  constructor (props) {
    super(props)

    // Bindings
  }

  nextPage () {
    const {currentPage, goToPage, totalPages} = this.props
    if (currentPage < totalPages) {
      goToPage(currentPage + 1)
    }
  }

  prevPage () {
    const {currentPage, goToPage} = this.props
    if (currentPage > 1) {
      goToPage(currentPage - 1)
    }
  }

  renderJumpSelect (currentPage, totalPages, goToPage) {
    // Create an array with the number of pages
    const pages = Array.apply(null, {length: totalPages}).map(Number.call, Number)
    return (
      <select
        onChange={(e) => goToPage(e.target.value)}
        value={currentPage}>
        {
          pages.map((i) => {
            const page = i + 1
            return <option key={page} value={page}>{page}</option>
          })
        }
      </select>
    )
  }

  render () {
    const {currentPage, goToPage, totalPages} = this.props

    const jumpSelect = this.renderJumpSelect(currentPage, totalPages, goToPage)

    return (
      <div className={styles.base}>
        <div className={styles.info}>
          Page {jumpSelect} of {totalPages}
        </div>
        <div className={styles.buttons}>
          <button
            className={styles.prevButton}
            disabled={(currentPage === 1)}
            onClick={(e) => {
              this.prevPage()
            }}>
            <span className={styles.buttonArrow}>←</span>
            <span className={styles.buttonText}> Prev</span>
          </button>
          <button
            className={styles.nextButton}
            disabled={(currentPage === totalPages)}
            onClick={(e) => {
              this.nextPage()
            }}>
            <span className={styles.buttonText}>Next </span>
            <span className={styles.buttonArrow}>→</span>
          </button>
        </div>
      </div>
    )
  }
}

/**
 * PropTypes
 * @type {Object}
 */
Pagination.propTypes = {
  currentPage: React.PropTypes.number.isRequired,
  totalPages: React.PropTypes.number.isRequired,
  goToPage: React.PropTypes.func.isRequired,
}

export default Pagination
