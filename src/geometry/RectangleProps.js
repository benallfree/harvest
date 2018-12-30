import PropTypes from 'prop-types'

const RectangleProps = {
  defaultProps: {
    x: 0,
    y: 0,
    width: 100,
    height: 50,
  },
  propTypes: {
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
  },
}

export { RectangleProps }
