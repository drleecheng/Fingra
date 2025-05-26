let handPose;
let video;
let hands = [];
let p5canvas = null;
let camSignal = false;
const synth = new Tone.MonoSynth({
	"volume": -8,
	"detune": 0,
	"portamento": 0,
	"envelope": {
		"attack": 0.05,
		"attackCurve": "linear",
		"decay": 0.3,
		"decayCurve": "exponential",
		"release": 0.8,
		"releaseCurve": "exponential",
		"sustain": 0.4
	},
	"filter": {
		"Q": 1,
		"detune": 0,
		"frequency": 0,
		"gain": 0,
		"rolloff": -12,
		"type": "lowpass"
	},
	"filterEnvelope": {
		//"attack": 0.001,
		//"attackCurve": "linear",
		"decay": 0.7,
		"decayCurve": "exponential",
		"release": 0.8,
		"releaseCurve": "exponential",
		"sustain": 0.1,
		"baseFrequency": 300,
		"exponent": 2,
		"octaves": 4
	},
	"oscillator": {
		"detune": 0,
		"frequency": 440,
		"partialCount": 8,
		"partials": [
			1.2732395447351628,
			0,
			0.4244131815783876,
			0,
			0.25464790894703254,
			0,
			0.18189136353359467,
			0
		],
		"phase": 0,
		"type": "square8"
	}
}).toDestination();

// A variable to track a pinch between thumb and index
let pinch = 0;

function cameraOnSignal() {
  camSignal = true;
}

function setup() {
  p5canvas = createCanvas(640, 480);
  p5canvas.parent('#canvas');
  video = createCapture(VIDEO);
  video.hide();
  handPose = ml5.handPose(modelReady);
}

function modelReady() {
  handPose.detectStart(video, gotHands);
}

function draw() {
  // Draw the webcam video
  if (video)
    image(video, 0, 0, width, height);

  // If there is at least one hand
  if ((hands.length > 0)&&(camSignal)) {
    // Find the index finger tip and thumb tip
    let finger = hands[0].index_finger_tip;
    let thumb = hands[0].thumb_tip;

    // Draw circles at finger positions
    let centerX = (finger.x + thumb.x) / 2;
    let centerY = (finger.y + thumb.y) / 2;
    // Calculate the pinch "distance" between finger and thumb
    if (dist(finger.x, finger.y, thumb.x, thumb.y) <= 100)
    {
      if (dist(finger.x, finger.y, thumb.x, thumb.y) > 40)
        pinch = 40;
      else 
        pinch = dist(finger.x, finger.y, thumb.x, thumb.y);
      // This circle's size is controlled by a "pinch" gesture
      fill(0, 255, 0, 200);
      stroke(0);
      strokeWeight(2);
      circle(centerX, centerY, pinch);
      if (frameCount%5 == 0)
      {
        synth.volume.value = pinch/2 - 20;
        let pitch = -finger.y/3+250;
        synth.triggerAttackRelease(pitch, "1n");
      }
    }
  }
}

// Callback function for when handPose outputs data
function gotHands(results) {
  // Save the output to the hands variable
  hands = results;
}
