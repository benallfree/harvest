import React from 'react'
import { Image } from 'react-konva'
import PropTypes from 'prop-types'
import { constrain, center, RectangleProps } from './geometry'

class GameImage extends React.Component {
  state = {
    image: null,
  }
  static defaultProps = {
    ...Image.defaultProps,
    ...RectangleProps.defaultProps,
    src: 'https://konvajs.github.io/assets/yoda.jpg',
    keepAspect: true,
    centerInContainer: false,
  }

  static propTypes = {
    ...Image.propTypes,
    ...RectangleProps.propTypes,
    keepAspect: PropTypes.bool,
    centerInContainer: PropTypes.bool,
  }

  componentDidMount() {
    const { src } = this.props
    const image = new window.Image()
    image.src = src
    image.onload = () => {
      this.setState({
        image: image,
      })
    }
  }

  render() {
    const { keepAspect, centerInContainer, ...rest } = this.props
    const { x, y, width, height } = this.props
    const { image } = this.state
    let nw = width
    let nh = height
    if (image && keepAspect) {
      const constraint = constrain(
        { width: image.naturalWidth, height: image.naturalHeight },
        { width, height },
      )
      nw = constraint.width
      nh = constraint.height
    }
    let xo = 0
    let yo = 0
    if (centerInContainer) {
      const offsets = center({ width: nw, height: nh }, { width, height })
      xo = offsets.xOffset
      yo = offsets.yOffset
    }

    return (
      <Image
        image={this.state.image}
        {...rest}
        x={x + xo}
        y={y + yo}
        width={nw}
        height={nh}
      />
    )
  }
}

export { GameImage }
