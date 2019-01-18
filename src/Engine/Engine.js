import React, { Component } from 'react'
import { Stage, Layer, Text } from 'react-konva'
import { Fps } from './Fps'
import { LiveUpdate } from './LiveUpdate'
import './engine.scss'

class Engine extends Component {
  state = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  static defaultProps = {
    showFps: true,
    showOta: true,
    gameRender: ({ width }) => (
      <Text
        align={'center'}
        x={0}
        y={50}
        width={width}
        text={`Your game goes here.`}
        fontSize={50}
        fontFamily={'Arial'}
        fill={'white'}
      />
    ),
  }

  componentDidMount() {
    this.sizeWatcherId = setInterval(() => {
      const dims = {
        width: window.innerWidth,
        height: window.innerHeight,
      }
      if (dims.height === this.state.height && dims.width === this.state.width)
        return
      this.setState(dims)
    }, 100)
  }

  componentWillUnmount() {
    clearInterval(this.sizeWatcherId)
  }

  render() {
    const { showOta, showFps, gameRender } = this.props
    const { width, height } = this.state
    return (
      <Stage width={width} height={height}>
        <Layer>
          {showFps && <Fps />}
          {showOta && <LiveUpdate screenWidth={width} screenHeight={height} />}
          {gameRender({ width, height })}
        </Layer>
      </Stage>
    )
  }
}

export { Engine }
