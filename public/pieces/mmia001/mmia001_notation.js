//How to run a function from a dictionary
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

function init() {
  const W = 400;
  const H = 400;
  var styleLimeGreen = {
    fillStyle: clr_limeGreen
  };
  var styleMagenta = {
    fillStyle: clr_neonMagenta
  };
  var styleYellow = {
    fillStyle: 'yellow'
  };
  var styleBrightBlue = {
    fillStyle: clr_brightBlue
  };
  var styleDarkRed = {
    fillStyle: clr_darkRed
  };
  let borderPlates = [{
    clr: clr_brightBlue,
    onTimer: 0,
    sndfunc: reverseChips()
  }, {
    clr: clr_limeGreen,
    onTimer: 0,
    sndfunc: bloop()
  }, {
    clr: 'yellow',
    onTimer: 0,
    sndfunc: beam()
  }, {
    clr: clr_darkRed,
    onTimer: 0,
    sndfunc:swirl()
  }, {
    clr: clr_brightBlue,
    onTimer: 0,
    sndfunc: reverseChips()
  }, {
    clr: clr_limeGreen,
    onTimer: 0,
    sndfunc: bloop()
  }, {
    clr: 'yellow',
    onTimer: 0,
    sndfunc: beam()
  }, {
    clr: clr_darkRed,
    onTimer: 0,
    sndfunc: function(){swirl()}
  }, {
    clr: clr_brightBlue,
    onTimer: 0,
    sndfunc: reverseChips()
  }, {
    clr: clr_darkRed,
    onTimer: 0,
    sndfunc: swirl()
  }];
  var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Body = Matter.Body,
    Events = Matter.Events,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Common = Matter.Common,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Bodies = Matter.Bodies;
  // create engine
  var engine = Engine.create(),
    world = engine.world;
  // create renderer
  var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: W,
      height: H,
      wireframes: false
    }
  });
  Render.run(render);
  // create runner
  var runner = Runner.create();
  Runner.run(runner, engine);
  // an example of using composite events on the world
  Events.on(world, 'afterAdd', function(event) {
    // do something with event.object
  });
  // an example of using beforeUpdate event on an engine

  Events.on(engine, 'beforeUpdate', function(event) {
    var engine = event.source;
    borderPlates.forEach((bpObj, bpIx) => {
      if (Common.now() < bpObj.onTimer) {
        world.bodies[bpIx].render.fillStyle = 'white';
      }else{
        world.bodies[bpIx].render.fillStyle = bpObj.clr;
      }
    });
  });
  // an example of using collisionStart event on an engine
  Events.on(engine, 'collisionStart', function(event) {
    var pairs = event.pairs;
    borderPlates[7].sndfunc;
    console.log(borderPlates[7]);

    // change object colours to show those starting a collision
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i];
      let aid = pair.bodyA.id;
      let bid = pair.bodyB.id;
      borderPlates[pair.bodyA.id].sndfunc;
      console.log('a: ' + aid + ' b: ' + bid);
      if (aid <= borderPlates.length) {
        borderPlates[aid - 1].onTimer = Common.now() + 175;
        borderPlates[aid - 1].sndfunc;
      }

      if (bid <= borderPlates.length) {
        borderPlates[bid - 1].onTimer = Common.now() + 250;
        borderPlates[bid - 1].sndfunc;
      }
    }
  });
  // an example of using collisionActive event on an engine
  Events.on(engine, 'collisionActive', function(event) {
    var pairs = event.pairs;
    // change object colours to show those in an active collision (e.g. resting contact)
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i];
      // pair.bodyA.render.fillStyle = clr_neonMagenta;
      // pair.bodyB.render.fillStyle = clr_neonMagenta;
    }
  });
  // an example of using collisionEnd event on an engine
  Events.on(engine, 'collisionEnd', function(event) {
    var pairs = event.pairs;
    // change object colours to show those ending a collision
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i];

      let aid = pair.bodyA.id;
      let bid = pair.bodyB.id;
      if (aid <= borderPlates.length) {
        pair.bodyA.render.fillStyle = borderPlates[aid - 1].clr;
      }

      if (bid < borderPlates.length) {
        pair.bodyB.render.fillStyle = borderPlates[bid - 1].clr;
      }
    }
  });

  // scene code
  Composite.add(world, [
    Bodies.rectangle(86, 12, 172, 24, { //top (centerX, centerY, width, height)
      isStatic: true,
      render: styleBrightBlue
    }),
    Bodies.rectangle(286, 12, 145, 24, {
      isStatic: true,
      render: styleLimeGreen
    }),
    Bodies.rectangle(388, 104, 24, 136, {
      isStatic: true,
      render: styleYellow
    }),
    Bodies.rectangle(388, 280, 24, 163, {
      isStatic: true,
      render: styleDarkRed
    }),
    Bodies.rectangle(320, 388, 82, 24, { //top (centerX, centerY, width, height)
      isStatic: true,
      render: styleBrightBlue
    }),
    Bodies.rectangle(230, 388, 66, 24, { //top (centerX, centerY, width, height)
      isStatic: true,
      render: styleLimeGreen
    }),
    Bodies.rectangle(154, 388, 44, 24, { //top (centerX, centerY, width, height)
      isStatic: true,
      render: styleYellow
    }),
    Bodies.rectangle(70, 388, 90, 24, { //top (centerX, centerY, width, height)
      isStatic: true,
      render: styleDarkRed
    }),
    Bodies.rectangle(12, 295, 24, 122, {
      isStatic: true,
      render: styleBrightBlue
    }),
    Bodies.rectangle(12, 120, 24, 153, {
      isStatic: true,
      render: styleDarkRed
    })

  ]);

  // var stack = Composites.stack(70, 100, 9, 4, 50, 50, function(x, y) {
  var stack = Composites.stack(100, 50, 1, 1, 50, 50, function(x, y) { //(ctrX, ctrY, #columns, #rows, ?, ?)
    return Bodies.circle(x, y, 8, {
      restitution: 1.22,
      friction: 0.1,
      render: styleMagenta
    });
  });
  Composite.add(world, stack);

  engine.gravity.y = 1;


  var shakeScene = function(engine) {
    var timeScale = (1000 / 60) / engine.timing.lastDelta;
    var bodies = Composite.allBodies(engine.world);
    for (var i = 0; i < bodies.length; i++) {
      var body = bodies[i];
      // if (!body.isStatic && body.position.y >= (H/2)) {
      // scale force for mass and time applied
      var forceMagnitude = (0.03 * body.mass) * timeScale;
      // apply the force over a single update
      Body.applyForce(body, body.position, {
        x: (forceMagnitude + Common.random() * forceMagnitude) * Common.choose([1, -1]),
        y: -forceMagnitude + Common.random() * -forceMagnitude
      });
      // }
    }
  };
  // add mouse control
  var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });
  Composite.add(world, mouseConstraint);
  // keep the mouse in sync with rendering
  render.mouse = mouse;
  // an example of using mouse events on a mouse
  Events.on(mouseConstraint, 'mousedown', function(event) {
    var mousePosition = event.mouse.position;
    // console.log('mousedown at ' + mousePosition.x + ' ' + mousePosition.y);
    shakeScene(engine);
  });
  // an example of using mouse events on a mouse
  Events.on(mouseConstraint, 'mouseup', function(event) {
    var mousePosition = event.mouse.position;
    // console.log('mouseup at ' + mousePosition.x + ' ' + mousePosition.y);
  });
  // an example of using mouse events on a mouse
  Events.on(mouseConstraint, 'startdrag', function(event) {
    // console.log('startdrag', event);
  });
  // an example of using mouse events on a mouse
  Events.on(mouseConstraint, 'enddrag', function(event) {
    // console.log('enddrag', event);
  });
  // fit the render viewport to the scene
  Render.lookAt(render, {
    min: {
      x: 0,
      y: 0
    },
    max: {
      x: W,
      y: H
    }
  });
  console.log(world);
}

//##ef osc msg
function reverseChips() {
  SOCKET.emit('reverseChips', {
    address: "/reverseChips",
  });
}
function swirl() {
  console.log('sending swirl');
  SOCKET.emit('swirl', {
    address: "/swirl",
  });
}
function bloop() {
  SOCKET.emit('bloop', {
    address: "/bloop",
  });
}
function beam() {
  SOCKET.emit('beam', {
    address: "/beam",
  });
}
function giant() {
  SOCKET.emit('giant', {
    address: "/giant",
  });
}
function chime() {
  SOCKET.emit('chime', {
    address: "/chime",
  });
}
function crunch() {
  SOCKET.emit('crunch', {
    address: "/crunch",
  });
}
//##endef oscmsg
