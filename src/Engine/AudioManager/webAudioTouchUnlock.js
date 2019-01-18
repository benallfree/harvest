function webAudioTouchUnlock(context) {
  return new Promise(function(resolve, reject) {
    if (context.state === 'suspended' && 'ontouchstart' in window) {
      var unlock = function() {
        context.resume().then(
          function() {
            document.body.removeEventListener('touchstart', unlock)
            document.body.removeEventListener('touchend', unlock)

            resolve(true)
          },
          function(reason) {
            reject(reason)
          },
        )
      }

      document.body.addEventListener('touchstart', unlock, false)
      document.body.addEventListener('touchend', unlock, false)
    } else {
      resolve(false)
    }
  })
}

export { webAudioTouchUnlock }
