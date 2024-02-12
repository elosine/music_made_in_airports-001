//#ef NOTES
/*
install supercolliderjs to node modules
Download SC code from git
set up synthdefs
use supercollider.js to launch sc server
insta
*/
//#endef NOTES

//#ef General Variables
const TEMPO_COLORS = [clr_limeGreen, clr_mustard, clr_brightBlue, clr_brightOrange, clr_lavander, clr_darkRed2, clr_brightGreen, clr_lightGrey, clr_neonMagenta, clr_plum, clr_blueGrey, clr_lightGrey, clr_lightGreen];
//Dimensions
let WORLD_W = 948;
let WORLD_H = 700;
//Timing
const LEADIN_SEC = 0;
const FRAMERATE = 60;
let FRAMECOUNT = -LEADIN_SEC * FRAMERATE;
const MS_PER_FRAME = 1000.0 / FRAMERATE;
const PX_PER_SEC = 79;
let animationIsGo = false;
//Timesync
const TS = timesync.create({
  server: '/timesync',
  interval: 1000
});
//Socket IO
let ioConnection;
if (window.location.hostname == 'localhost') {
  ioConnection = io();
} else {
  ioConnection = io.connect(window.location.hostname);
}
const SOCKET = ioConnection;
//#endef General Variables

//#ef INIT
function init() {
  makeCanvas();
  let ts_Date = new Date(TS.now());
  let tsNowEpochTime_MS = ts_Date.getTime();
  epochTimeOfLastFrame_MS = tsNowEpochTime_MS;
  animationIsGo = true;
  requestAnimationFrame(animationEngine);
}
//#endef INIT

//#ef Animation Engine
let cumulativeChangeBtwnFrames_MS = 0;
let epochTimeOfLastFrame_MS;

function animationEngine(timestamp) {
  let ts_Date = new Date(TS.now());
  let tsNowEpochTime_MS = ts_Date.getTime();
  cumulativeChangeBtwnFrames_MS += tsNowEpochTime_MS - epochTimeOfLastFrame_MS;
  epochTimeOfLastFrame_MS = tsNowEpochTime_MS;
  while (cumulativeChangeBtwnFrames_MS >= MS_PER_FRAME) {
    if (cumulativeChangeBtwnFrames_MS > (MS_PER_FRAME * FRAMERATE)) cumulativeChangeBtwnFrames_MS = MS_PER_FRAME;
    update();
    FRAMECOUNT++;
    cumulativeChangeBtwnFrames_MS -= MS_PER_FRAME;
  }
  if (animationIsGo) {
    requestAnimationFrame(animationEngine);
  }
}

function update() {
  if (FRAMECOUNT >= 0) {
    if (FRAMECOUNT == 60) {
      sendMSG();
    }
  }
}
//#endef Animation Engine

//#ef Canvas
let canvas = {};
let panelTitle = "Interactive Looping Line 20240130";
const staffRects = [];
let staffClr = 'white';
let canvasClr = clr_blueGrey;

function makeCanvas() {
  let tPanel = mkPanel({
    w: WORLD_W,
    h: WORLD_H,
    title: panelTitle,
    onwindowresize: true,
    clr: 'none',
    ipos: 'center-top',
  });
  tPanel.content.addEventListener('click', function() {
    document.documentElement.webkitRequestFullScreen({
      navigationUI: 'hide'
    });
    animationIsGo = true;
    requestAnimationFrame(animationEngine);
  });
  canvas['panel'] = tPanel;
  canvas['div'] = tPanel.content;
  let tSvg = mkSVGcontainer({
    canvas: tPanel.content,
    w: WORLD_W,
    h: WORLD_H,
    x: 0,
    y: 0,
  });
  //Change Background Color of svg container tSvg.style.backgroundColor = clr_mustard
  tSvg.style.backgroundColor = canvasClr;
  canvas['svg'] = tSvg;
}

function mkStaffRects() {
  for (var i = 0; i < NUM_NOTATION_LINES; i++) {
    let tRect = mkSvgRect({
      svgContainer: canvas.svg,
      x: 0,
      y: VERT_DISTANCE_BETWEEN_LINES * i,
      w: WORLD_W,
      h: NOTATION_H,
      fill: staffClr,
      stroke: 'yellow',
      strokeW: 0,
      roundR: 0
    });
    staffRects.push(tRect);
  }
}
//#endef Canvas

//##ef osc msg
function sendMSG() {
  // Send to Server

  SOCKET.emit('msgFromBrowser', {
    address: "/hello/from/oscjs",
    args: [{
        type: "f",
        value: Math.random()
      },
      {
        type: "f",
        value: Math.random()
      }
    ]
  });
  //Receive msg from server
  // SOCKET.on('msgFromServer', function(data) {
  //   console.log(data);
  // });
}
//##endef oscmsg




//
