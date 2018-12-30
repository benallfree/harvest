import React from 'react'
import _ from 'lodash'
import { GameImage } from '../GameImage'
import { RectangleProps } from '../geometry'
import { AudioManager } from '../AudioManager'
import { logo, samples } from './assets'

const assets = {}
AudioManager.addAssets(samples).then(results => {
  _.each(results, v => {
    assets[v.key] = v.id
    console.log('asset ready', v)
  })
})

const tapZoneKeys = ['loking', 'mid4', 'mid2', 'hi1', 'hi3', 'hi2']

class Djembe extends React.Component {
  constructor(props) {
    super(props)
    this.image = new window.Image()
    this.image.src = logo
    this.calc()
  }
  static defaultProps = { ...RectangleProps.defaultProps }
  static propTypes = { ...RectangleProps.propTypes }

  componentDidUpdate() {
    this.calc()
  }

  calc() {
    const { x, y, width, height } = this.props
    this.cx = x + width / 2
    this.cy = y + height / 2
    this.r = Math.min(width / 2, height / 2)
    const ringSize = this.r / 6
    this.r2 = Math.pow(this.r, 2)
    this.hitZones = [
      Math.pow(ringSize * 0.5, 2),
      Math.pow(ringSize * 2, 2),
      Math.pow(ringSize * 3, 2),
      Math.pow(ringSize * 4, 2),
      Math.pow(ringSize * 5, 2),
      ringSize,
    ]
    console.log(this)
  }

  handleClick = e => {
    _.each(e.evt.touches, t => {
      const { screenX, screenY } = t
      const distanceFromCenter =
        Math.pow(this.cx - screenX, 2) + Math.pow(this.cy - screenY, 2)
      if (distanceFromCenter <= this.r2) {
        console.log(this.hitZones, distanceFromCenter)
        const ringIdx = _.findIndex(this.hitZones, z => distanceFromCenter <= z)

        AudioManager.play(assets[tapZoneKeys[ringIdx]])
      }
    })
  }

  render() {
    const { x, y, width, height } = this.props
    return (
      <GameImage
        onClick={this.handleClick}
        onTouchStart={this.handleClick}
        src={logo}
        keepAspect
        centerInContainer
        {...{ x, y, width, height }}
      />
    )
  }
}

export { Djembe }
