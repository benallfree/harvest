import _ from 'lodash'
import axios from 'axios'
import { webAudioTouchUnlock } from './webAudioTouchUnlock'

const audioCtx = new (window.AudioContext || window.webkitAudioContext)()

class AudioManager {
  assets = []
  isInitialized = false

  addAssets(obj) {
    return Promise.all(
      _.map(
        obj,
        (blobUrl, k) =>
          new Promise((resolve, reject) => {
            axios
              .get(blobUrl, { responseType: 'arraybuffer' })
              .then(response => {
                this.assets.push({
                  raw: response.data,
                })
                const map = { key: k, id: this.assets.length - 1 }
                resolve(map)
              })
              .catch(error => {
                console.error(error)
                throw error
              })
          }),
      ),
    )
  }

  play(id) {
    this.init().then(() => {
      var source = audioCtx.createBufferSource()
      source.buffer = this.assets[id].buffer
      source.connect(audioCtx.destination)
      source.start()
    })
  }

  init() {
    return webAudioTouchUnlock(audioCtx)
      .then(wasPreviouslyLocked => {
        if (this.isInitialized) return true
        return Promise.all(
          _.map(
            this.assets,
            a =>
              new Promise((resolve, reject) => {
                audioCtx.decodeAudioData(
                  a.raw,
                  buffer => {
                    a.buffer = buffer
                    resolve()
                  },
                  e => {
                    console.log('Error with decoding audio data' + e.err)
                    reject(e)
                  },
                )
              }),
          ),
        ).then(() => {
          this.isInitialized = true
        })
      })
      .catch(e => {
        console.error(e)
        throw e
      })
  }
}

const AudioManagerObj = new AudioManager()

export { AudioManagerObj as AudioManager }
