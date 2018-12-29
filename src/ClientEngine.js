import Pressure from 'pressure'
import _ from 'lodash'

class ClientEngine {
  constructor ({ audioManager, appRoot, objects }) {
    this.canvas = document.getElementById('app')
    this.canvas.width = document.body.clientWidth
    this.canvas.height = document.body.clientHeight
    this.audioManager = audioManager

    this.ctx = this.canvas.getContext('2d')

    this.activeTouches = {}

    Pressure.set(appRoot, {
      change: (force, event) => {
        _.each(event.touches, touch => {
          const { clientX, clientY, identifier } = touch
          if (this.activeTouches[identifier]) return
          this.activeTouches[identifier] = true
          for (let i = this.objects.length - 1; i--; i >= 0) {
            const o = this.objects[i]
            const params = { force, x: clientX, y: clientY, w: 1, h: 1 }
            const isHit = o.isHit(params)
            if (isHit) {
              o.onHit(params)
              break
            }
          }
        })
      },
      end: (event) => {
        _.each(event.touches, touch => { this.activeTouches[touch.identifier] = false })
      }
    })
  }

  loop () {
    const { ctx, canvas, objects } = this
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    _.each(objects, o => o.render())
    window.requestAnimationFrame(() => this.loop())
  }

  start (objects) {
    this.objects = []
    _.each(objects, o => this.objects.push(o(this)))

    this.loop()
  }
}

export { ClientEngine }
