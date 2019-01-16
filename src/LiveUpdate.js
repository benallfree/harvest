import React from 'react'
import { Rect, Text } from 'react-konva'
import PropTypes from 'prop-types'
import moment from 'moment'
import './app.scss'

class LiveUpdate extends React.Component {
  static defaultProps = {
    x: null,
    y: null,
    width: 120,
    height: 40,
    color: `rbga(50,50,50,0.8)`,
    pad: 5,
  }

  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    pad: PropTypes.number,
    color: PropTypes.string,
    screenWidth: PropTypes.number,
    screenHeight: PropTypes.number,
  }

  componentDidMount() {
    this.refreshId = setInterval(() => {
      this.forceUpdate()
    }, 1000 * 60)
  }

  componentWillUnmount() {
    clearInterval(this.refreshId)
  }

  render() {
    if (~window.LiveUpdater) return null
    const { currentBuildId } = window.LiveUpdater.buildManifest
    const t = moment(currentBuildId)
    const {
      x,
      y,
      width,
      height,
      color,
      pad,
      screenWidth,
      screenHeight,
    } = this.props
    const fx = x === null ? screenWidth - width : x
    const fy = y === null ? screenHeight - height : y + 44
    return (
      <>
        <Rect
          x={fx}
          y={fy}
          width={width}
          height={height}
          fill={color}
          shadowBlur={5}
        />
        <Text
          align={'center'}
          x={fx}
          y={fy + pad}
          width={width}
          text={`Build: ${currentBuildId}\n${t.fromNow()}`}
          fontSize={height / 2 - pad * 2}
          fontFamily={'Arial'}
          fill={'white'}
        />
      </>
    )
  }
}
export { LiveUpdate }
