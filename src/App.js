import React, { Component } from 'react'
import { Stage, Layer } from 'react-konva'
import { Fps } from './Fps'
import { Djembe } from './Djembe'
import { LiveUpdate } from './LiveUpdate'
import './app.scss'

class App extends Component {
  state = {
    width: window.innerWidth,
    height: window.innerHeight,
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
    console.log('xzzzxxxben')
    const { width, height } = this.state
    return (
      <Stage width={width} height={height}>
        <Layer>
          <Fps />
          <LiveUpdate screenWidth={width} screenHeight={height} />

          <Djembe width={width} height={height} />
        </Layer>
      </Stage>
    )
  }
}

export { App }
