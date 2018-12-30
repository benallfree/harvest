import React, { Component } from 'react'
import { render } from 'react-dom'
import { Stage, Layer } from 'react-konva'
import { Fps } from './Fps'
import { Djembe } from './Djembe'

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
    const { width, height } = this.state
    return (
      <Stage width={width} height={height}>
        <Layer>
          <Fps />
          <Djembe width={width} height={height} />
        </Layer>
      </Stage>
    )
  }
}

render(<App />, document.getElementById('app'))
