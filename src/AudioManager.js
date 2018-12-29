import axios from 'axios'
import _ from 'lodash'

const audioCtx = new (window.AudioContext || window.webkitAudioContext)()

function webAudioTouchUnlock (context) {
  return new Promise(function (resolve, reject) {
    if (context.state === 'suspended' && 'ontouchstart' in window) {
      var unlock = function () {
        context.resume().then(function () {
          document.body.removeEventListener('touchstart', unlock)
          document.body.removeEventListener('touchend', unlock)

          resolve(true)
        },
        function (reason) {
          reject(reason)
        })
      }

      document.body.addEventListener('touchstart', unlock, false)
      document.body.addEventListener('touchend', unlock, false)
    } else {
      resolve(false)
    }
  })
}

class AudioManager {
  constructor (assets) {
    this.assets = {}
    _.each(assets, (a, k) => {
      axios.get(`/assets/djembe/${a.name}.mp3`, { responseType: 'arraybuffer' })
        .then((response) => {
          this.assets[k] = { ...a, raw: response.data }
        })
        .catch((error) => {
          console.error(error)
          throw error
        })
    })
    this.isInitialized = false
  }

  play (key) {
    this.init().then(() => {
      var source = audioCtx.createBufferSource()
      source.buffer = this.assets[key].buffer
      source.connect(audioCtx.destination)
      source.start()
      console.log('playing')
    })
  }

  init () {
    return webAudioTouchUnlock(audioCtx).then((wasPreviouslyLocked) => {
      if (this.isInitialized) return true
      return Promise.all(_.map(this.assets, (a, k) => new Promise((resolve, reject) => {
        audioCtx.decodeAudioData(a.raw, (buffer) => {
          a.buffer = buffer
          resolve()
        },
        (e) => { console.log('Error with decoding audio data' + e.err); reject(e) })
      }))).then(() => { this.isInitialized = true })
    }).catch(e => {
      console.error(e)
      throw e
    })
  }
}

export { AudioManager }
