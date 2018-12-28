import React from 'react'
import _ from 'lodash'
import axios from 'axios'
import ReactDOM from 'react-dom'
import Pressure from 'react-pressure'

const assets = {
  hi: { name: '54014__domingus__djembe-hi-1.mp3' }
}

class AudioManager {
  constructor (assets) {
    this.assets = {}
    _.each(assets, (a, k) => {
      axios.get(`/assets/djembe/${a.name}`, { responseType: 'arraybuffer' })
        .then((response) => {
          this.assets[k] = { ...a, raw: response.data }

          console.log(response)
        })
        .catch((error) => {
          console.error(error)
          throw error
        })
    })
    this.audioCtx = null
  }

  play (key) {
    this.init().then(audioCtx => {
      var source = audioCtx.createBufferSource()

      // set the buffer in the AudioBufferSourceNode
      source.buffer = this.assets[key].buffer

      // connect the AudioBufferSourceNode to the
      // destination so we can hear the sound
      source.connect(audioCtx.destination)
      source.start()
    })
  }

  init () {
    return new Promise(resolve => {
      if (this.audioCtx) {
        resolve(this.audioCtx)
        return
      }
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      Promise.all(_.map(this.assets, (a, k) => new Promise((resolve, reject) => {
        console.error({ a })
        this.audioCtx.decodeAudioData(a.raw, (buffer) => {
          a.buffer = buffer
          resolve()
        },
        (e) => { console.log('Error with decoding audio data' + e.err); reject(e) })
      }))).then(() => resolve(this.audioCtx))
    })
  }
}

const am = new AudioManager(assets)

const forceHistory = []
const SoundPlayer = Pressure(props => {
  const coded = JSON.stringify(props)
  if (forceHistory[0] !== coded) forceHistory.unshift(coded)
  return <>
    <div style={{ border: '1px solid red', padding: 5, margin: 10 }} >Play</div>
    {_.map(forceHistory, (f, i) => ((<div key={i}>{f}</div>)))}
  </>
}, { polyfill: true, polyfillSpeedUp: 0, polyfillSpeedDown: 0 })

export class SoundPl extends React.Component {
  render () {
    return (
      <article>
        <h1>Hi from DummyComponent.</h1>
        <em>Now let's play with React!</em>
      </article>
    )
  }
}

// Define the root element.
const root = document.getElementById('app')

// Append the DummyComponent instance to the root element.
ReactDOM.render(<SoundPlayer />, root)
