import { GameObject } from './GameObject'

class Fps extends GameObject {
  constructor (engine, props) {
    super(engine, { ...props, w: 50, h: 17, frames: 0, start: (new Date()).getSeconds(), fps: 0 })
  }
  render () {
    const { engine: { ctx }, state, state: { x, y, w, h } } = this
    state.frames += 1
    const now = (new Date()).getSeconds()
    if (state.start !== now) {
      state.start = now
      state.fps = state.frames
      state.frames = 0
    }
    ctx.textBaseline = 'top'
    ctx.fillStyle = `rgb(50, 50, 50)`
    ctx.fillRect(x, y, w, h)

    ctx.fillStyle = 'white'
    ctx.font = '12px Arial'
    ctx.fillText(`${state.fps} FPS`, x + 4, y + 4)
  }
}

export { Fps }
