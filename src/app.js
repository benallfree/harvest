import './app.scss'
import { ClientEngine } from './ClientEngine'
import { Pad } from './Pad'
import { Fps } from './Fps'
import { AudioManager } from './AudioManager'

const assets = {
  hi: { name: '54014__domingus__djembe-hi-1' },
  lo: { name: '54017__domingus__djembe-lo-1' }
}

const audioManager = new AudioManager(assets)

const objects = [
  engine => new Pad(engine, {
    alpha: 1,
    fadeTo: 0.6,
    isDebouncing: false,
    debounceStep: 0.1,
    x: 0,
    y: 0,
    w: w,
    h: w,
    playKey: 'hi'
  }),
  engine => new Pad(engine, {
    alpha: 1,
    fadeTo: 0.6,
    isDebouncing: false,
    debounceStep: 0.1,
    x: w * 1,
    y: 0,
    w: w,
    h: w,
    playKey: 'lo'
  }),
  engine => new Fps(engine, {
    x: 0, y: 0
  })
]

const engine = new ClientEngine({ audioManager, appRoot: '#app' })
const w = engine.canvas.width / 3
engine.start(objects)
