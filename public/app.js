
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
(function (Pressure, _, axios) {
  'use strict';

  Pressure = Pressure && Pressure.hasOwnProperty('default') ? Pressure['default'] : Pressure;
  _ = _ && _.hasOwnProperty('default') ? _['default'] : _;
  axios = axios && axios.hasOwnProperty('default') ? axios['default'] : axios;

  var ClientEngine = function ClientEngine (ref) {
    var this$1 = this;
    var audioManager = ref.audioManager;
    var appRoot = ref.appRoot;
    var objects = ref.objects;

    this.canvas = document.getElementById('app');
    this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight;
    this.audioManager = audioManager;

    this.ctx = this.canvas.getContext('2d');

    this.activeTouches = {};

    Pressure.set(appRoot, {
      change: function (force, event) {
        _.each(event.touches, function (touch) {
          var clientX = touch.clientX;
          var clientY = touch.clientY;
          var identifier = touch.identifier;
          if (this$1.activeTouches[identifier]) { return }
          this$1.activeTouches[identifier] = true;
          for (var i = this$1.objects.length - 1; i--; i >= 0) {
            var o = this$1.objects[i];
            var params = { force: force, x: clientX, y: clientY, w: 1, h: 1 };
            var isHit = o.isHit(params);
            if (isHit) {
              o.onHit(params);
              break
            }
          }
        });
      },
      end: function (event) {
        _.each(event.touches, function (touch) { this$1.activeTouches[touch.identifier] = false; });
      }
    });
  };

  ClientEngine.prototype.loop = function loop () {
      var this$1 = this;

    var ref = this;
      var ctx = ref.ctx;
      var canvas = ref.canvas;
      var objects = ref.objects;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    _.each(objects, function (o) { return o.render(); });
    window.requestAnimationFrame(function () { return this$1.loop(); });
  };

  ClientEngine.prototype.start = function start (objects) {
      var this$1 = this;

    this.objects = [];
    _.each(objects, function (o) { return this$1.objects.push(o(this$1)); });

    this.loop();
  };

  var GameObject = function GameObject (engine, state) {
    console.log({ state: state });
    this.engine = engine;
    this.state = state;
  };

  GameObject.prototype.isHit = function isHit (ref) {
      var force = ref.force;
      var x = ref.x;
      var y = ref.y;
      var w = ref.w;
      var h = ref.h;

    var ref$1 = this;
      var state = ref$1.state;
    return x + w > state.x && x < state.x + state.w && y + h > state.y && y < state.y + state.h
  };

  GameObject.prototype.onHit = function onHit (ref) {
      var force = ref.force;
      var x = ref.x;
      var y = ref.y;
      var w = ref.w;
      var h = ref.h;


  };

  GameObject.prototype.render = function render () {

  };

  var Pad = /*@__PURE__*/(function (GameObject$$1) {
    function Pad () {
      GameObject$$1.apply(this, arguments);
    }

    if ( GameObject$$1 ) Pad.__proto__ = GameObject$$1;
    Pad.prototype = Object.create( GameObject$$1 && GameObject$$1.prototype );
    Pad.prototype.constructor = Pad;

    Pad.prototype.onHit = function onHit (ref) {
      var force = ref.force;
      var x = ref.x;
      var y = ref.y;
      var w = ref.w;
      var h = ref.h;

      var ref$1 = this;
      var state = ref$1.state;
      var audioManager = ref$1.engine.audioManager;
      if (state.isDebouncing) { return false }
      state.isDebouncing = true;

      audioManager.play(state.playKey);
    };

    Pad.prototype.render = function render () {
      var ref = this;
      var ctx = ref.engine.ctx;
      var state = ref.state;
      var ref_state = ref.state;
      var x = ref_state.x;
      var y = ref_state.y;
      var w = ref_state.w;
      var h = ref_state.h;
      var isDebouncing = ref_state.isDebouncing;
      var debounceStep = ref_state.debounceStep;
      var fadeTo = ref_state.fadeTo;
      if (isDebouncing) {
        state.alpha = Math.max(0, state.alpha - debounceStep);
        if (state.alpha <= fadeTo) {
          state.alpha = 1;
          state.isDebouncing = false;
        }
      }
      ctx.fillStyle = "rgba(255, 165, 0, " + (state.alpha) + ")";
      ctx.fillRect(x, y, w, h);
    };

    return Pad;
  }(GameObject));

  var Fps = /*@__PURE__*/(function (GameObject$$1) {
    function Fps (engine, props) {
      GameObject$$1.call(this, engine, Object.assign({}, props, {w: 50, h: 17, frames: 0, start: (new Date()).getSeconds(), fps: 0}));
    }

    if ( GameObject$$1 ) Fps.__proto__ = GameObject$$1;
    Fps.prototype = Object.create( GameObject$$1 && GameObject$$1.prototype );
    Fps.prototype.constructor = Fps;
    Fps.prototype.render = function render () {
      var ref = this;
      var ctx = ref.engine.ctx;
      var state = ref.state;
      var ref_state = ref.state;
      var x = ref_state.x;
      var y = ref_state.y;
      var w = ref_state.w;
      var h = ref_state.h;
      state.frames += 1;
      var now = (new Date()).getSeconds();
      if (state.start !== now) {
        state.start = now;
        state.fps = state.frames;
        state.frames = 0;
      }
      ctx.textBaseline = 'top';
      ctx.fillStyle = "rgb(50, 50, 50)";
      ctx.fillRect(x, y, w, h);

      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.fillText(((state.fps) + " FPS"), x + 4, y + 4);
    };

    return Fps;
  }(GameObject));

  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  function webAudioTouchUnlock (context) {
    return new Promise(function (resolve, reject) {
      if (context.state === 'suspended' && 'ontouchstart' in window) {
        var unlock = function () {
          context.resume().then(function () {
            document.body.removeEventListener('touchstart', unlock);
            document.body.removeEventListener('touchend', unlock);

            resolve(true);
          },
          function (reason) {
            reject(reason);
          });
        };

        document.body.addEventListener('touchstart', unlock, false);
        document.body.addEventListener('touchend', unlock, false);
      } else {
        resolve(false);
      }
    })
  }

  var AudioManager = function AudioManager (assets) {
    var this$1 = this;

    this.assets = {};
    _.each(assets, function (a, k) {
      axios.get(("/assets/djembe/" + (a.name) + ".mp3"), { responseType: 'arraybuffer' })
        .then(function (response) {
          this$1.assets[k] = Object.assign({}, a, {raw: response.data});
        })
        .catch(function (error) {
          console.error(error);
          throw error
        });
    });
    this.isInitialized = false;
  };

  AudioManager.prototype.play = function play (key) {
      var this$1 = this;

    this.init().then(function () {
      var source = audioCtx.createBufferSource();
      source.buffer = this$1.assets[key].buffer;
      source.connect(audioCtx.destination);
      source.start();
      console.log('playing');
    });
  };

  AudioManager.prototype.init = function init () {
      var this$1 = this;

    return webAudioTouchUnlock(audioCtx).then(function (wasPreviouslyLocked) {
      if (this$1.isInitialized) { return true }
      return Promise.all(_.map(this$1.assets, function (a, k) { return new Promise(function (resolve, reject) {
        audioCtx.decodeAudioData(a.raw, function (buffer) {
          a.buffer = buffer;
          resolve();
        },
        function (e) { console.log('Error with decoding audio data' + e.err); reject(e); });
      }); })).then(function () { this$1.isInitialized = true; })
    }).catch(function (e) {
      console.error(e);
      throw e
    })
  };

  var assets = {
    hi: { name: '54014__domingus__djembe-hi-1' },
    lo: { name: '54017__domingus__djembe-lo-1' }
  };

  var audioManager = new AudioManager(assets);

  var objects = [
    function (engine) { return new Pad(engine, {
      alpha: 1,
      fadeTo: 0.6,
      isDebouncing: false,
      debounceStep: 0.1,
      x: 0,
      y: 0,
      w: w,
      h: w,
      playKey: 'hi'
    }); },
    function (engine) { return new Pad(engine, {
      alpha: 1,
      fadeTo: 0.6,
      isDebouncing: false,
      debounceStep: 0.1,
      x: w * 1,
      y: 0,
      w: w,
      h: w,
      playKey: 'lo'
    }); },
    function (engine) { return new Fps(engine, {
      x: 0, y: 0
    }); }
  ];

  var engine = new ClientEngine({ audioManager: audioManager, appRoot: '#app' });
  var w = engine.canvas.width / 3;
  engine.start(objects);

}(Pressure, _, axios));
