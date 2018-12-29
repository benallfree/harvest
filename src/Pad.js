import { GameObject } from './GameObject'

class Pad extends GameObject {
  onHit ({ force, x, y, w, h }) {
    const { state, engine: { audioManager } } = this
    if (state.isDebouncing) return false
    state.isDebouncing = true

    audioManager.play(state.playKey)
  }

  render () {
    const { engine: { ctx }, state, state: { x, y, w, h, isDebouncing, debounceStep, fadeTo } } = this
    if (isDebouncing) {
      state.alpha = Math.max(0, state.alpha - debounceStep)
      if (state.alpha <= fadeTo) {
        state.alpha = 1
        state.isDebouncing = false
      }
    }
    ctx.fillStyle = `rgba(255, 165, 0, ${state.alpha})`
    ctx.fillRect(x, y, w, h)
  }
}

export { Pad }
