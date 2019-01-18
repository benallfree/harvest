import React from 'react'
import { Rect, Text } from 'react-konva'
import Konva from 'konva'
import PropTypes from 'prop-types'
import './app.scss'

class Fps extends React.Component {
  state = {
    frameRate: 0,
    ms: 0,
  }
  anim = null

  static defaultProps = {
    x: 0,
    y: 0,
    width: 60,
    height: 20,
    color: `rbga(250,250,250,0.8)`,
    pad: 5,
  }

  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    pad: PropTypes.number,
    color: PropTypes.string,
  }

 
  componentDidMount() {
    this.anim = new Konva.Animation(frame => {
      if (frame.lastTime < this.state.ms + 1000) return
      this.setState({
        frameRate: Math.round(frame.frameRate, 0),
        ms: frame.lastTime,
      })
    })
    this.anim.start()
  }

  componentWillUnmount() {
    this.anim.stop()
  }

  render() {
    const { x, y, width, height, color, pad } = this.props
    return (
      <>
        <Rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={color}
          shadowBlur={5}
        />
        <Text
          align={'center'}
          x={x}
          y={y + pad}
          width={width}
          text={`${this.state.frameRate} FPS`}
          fontSize={height - pad * 2}
          fontFamily={'Arial'}
          fill={'white'}
        />
      </>
    )
  }
}
export { Fps }
