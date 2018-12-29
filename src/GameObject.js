class GameObject {
  constructor (engine, state) {
    console.log({ state })
    this.engine = engine
    this.state = state
  }

  isHit ({ force, x, y, w, h }) {
    const { state } = this
    return x + w > state.x && x < state.x + state.w && y + h > state.y && y < state.y + state.h
  }

  onHit ({ force, x, y, w, h }) {

  }

  render () {

  }
}

export { GameObject }
