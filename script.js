var 
        circle = document.getElementById("circle"),
        pfx = ["webkit", "moz", "MS", "o", ""];

// button click event
circle.addEventListener("click", ToggleAnimation, false);

// animation listener events
PrefixedEvent(circle, "AnimationStart", AnimationListener);
PrefixedEvent(circle, "AnimationIteration", AnimationListener);
PrefixedEvent(circle, "AnimationEnd", AnimationListener);

// apply prefixed event handlers
function PrefixedEvent(element, type, callback) {
     for (var p = 0; p < pfx.length; p++) {
             if (!pfx[p]) type = type.toLowerCase();
             element.addEventListener(pfx[p]+type, callback, false);
     }
}

// handle animation events
function AnimationListener(e) {

        if (e.type.toLowerCase().indexOf("animationend") >= 0) {
                ToggleAnimation();
        }
}

// start/stop animation
function ToggleAnimation(e) {
        var on = (circle.className != "");
        circle.className = (on ? "" : "animated");
        if (e) e.preventDefault();
};


// log event in the console
function LogEvent(msg) {
        log.textContent += msg + "\n";
        var ot = log.scrollHeight - log.clientHeight;
        if (ot > 0) log.scrollTop = ot;
}


///
//
//
//
//

(function(AudioContext) {
	AudioContext.prototype.createWhiteNoise = function(bufferSize) {
		bufferSize = bufferSize || 4096;
		var node = this.createScriptProcessor(bufferSize, 1, 1);
		node.onaudioprocess = function(e) {
			var output = e.outputBuffer.getChannelData(0);
			for (var i = 0; i < bufferSize; i++) {
				output[i] = Math.random() * 2 - 1;
			}
		}
		return node;
	};

	AudioContext.prototype.createPinkNoise = function(bufferSize) {
		bufferSize = bufferSize || 4096;
		var b0, b1, b2, b3, b4, b5, b6;
		b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
		var node = this.createScriptProcessor(bufferSize, 1, 1);
		node.onaudioprocess = function(e) {
			var output = e.outputBuffer.getChannelData(0);
			for (var i = 0; i < bufferSize; i++) {
				var white = Math.random() * 2 - 1;
				b0 = 0.99886 * b0 + white * 0.0555179;
				b1 = 0.99332 * b1 + white * 0.0750759;
				b2 = 0.96900 * b2 + white * 0.1538520;
				b3 = 0.86650 * b3 + white * 0.3104856;
				b4 = 0.55000 * b4 + white * 0.5329522;
				b5 = -0.7616 * b5 - white * 0.0168980;
				output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
				output[i] *= 0.11; // (roughly) compensate for gain
				b6 = white * 0.115926;
			}
		}
		return node;
	};

	AudioContext.prototype.createBrownNoise = function(bufferSize) {
		bufferSize = bufferSize || 4096;
		var lastOut = 0.0;
		var node = this.createScriptProcessor(bufferSize, 1, 1);
		node.onaudioprocess = function(e) {
			var output = e.outputBuffer.getChannelData(0);
			for (var i = 0; i < bufferSize; i++) {
				var white = Math.random() * 2 - 1;
				output[i] = (lastOut + (0.02 * white)) / 1.02;
				lastOut = output[i];
				output[i] *= 3.5; // (roughly) compensate for gain
			}
		}
		return node;
	};
})(window.AudioContext || window.webkitAudioContext);

var context = new AudioContext();

/* Waves */
var brownNoise = context.createBrownNoise(16384);
var brownGain = context.createGain();
brownGain.gain.value = 0.3;
brownNoise.connect(brownGain);

var lfo = context.createOscillator();
lfo.frequency.value = 0.1;

var lfoGain = context.createGain();
lfoGain.gain.value = 0.1;
lfo.start(0);
lfo.connect(lfoGain);
lfoGain.connect(brownGain.gain);

var wavesGain = context.createGain();
wavesGain.gain.value = 0.0;
brownGain.connect(wavesGain);
wavesGain.connect(context.destination);



