//Xiaohua Huo
//xhuo3@ucsc.edu
//I finished all the basic requirements by following the helper videos.
//I did a Cat Animation and Mouse Control
//When you click the ON button of cat animation, the cat will shake its tail.
//I use four part in series for making the tail, which has three limbs.
//When you click and hold the canvas, you can rotation the cat by move 
//your mouse. 

// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_GlobalRotateMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix

function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let g_globalAngleX = -20;
let g_globalAngleY = -30;
let g_globalAngleZ = 0;
let g_tailAngle = 0;
let g_tailMidAngle = 0;
let g_tailMid2Angle = 0;
let g_tailEndAngle = 0; 
let g_catAnimation = false;
let g_headShakeAngle = 0;
let g_headVerticalAngle = 0;
let g_upperArmAngle = 0;
let g_lowerArmAngle = 0;

function addActionForHtmlUI(){
  //Button Event
  document.getElementById('animationCatOffButton').onclick = function() {g_catAnimation = false;};
  document.getElementById('animationCatOnButton').onclick = function() {g_catAnimation = true;};
  
  //Camera Angle
  document.getElementById('angleSlidex').addEventListener('mousemove', function(){g_globalAngleX = this.value; renderAllShapes();});
  document.getElementById('angleSlidey').addEventListener('mousemove', function(){g_globalAngleY = this.value; renderAllShapes();});
  document.getElementById('angleSlidez').addEventListener('mousemove', function(){g_globalAngleZ = this.value; renderAllShapes();});

  //head shake
  document.getElementById('headShakeSlide').addEventListener('mousemove', function(){g_headShakeAngle = this.value; renderAllShapes();});
  document.getElementById('headVerticalSlide').addEventListener('mousemove', function(){g_headVerticalAngle = this.value; renderAllShapes();});

  document.getElementById('upperArmSlide').addEventListener('mousemove', function(){g_upperArmAngle = this.value; renderAllShapes();});
  document.getElementById('lowerArmSlide').addEventListener('mousemove', function(){g_lowerArmAngle = this.value; renderAllShapes();});
}

function main() {
  //set up
  setupWebGL();  

  connectVariablesToGLSL();

  addActionForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev){if(ev.buttons == 1){click(ev)}};

  // Specify the color for clearing <canvas>
  gl.clearColor(0.68, 0.85, 0.90, 1.0);

  requestAnimationFrame(tick);
}

var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;

function tick(){
  g_seconds = performance.now() / 1000.0 - g_startTime;
  // console.log(g_seconds);

  updateAnimationAngles();

  renderAllShapes();

  requestAnimationFrame(tick);
}

function click(ev) {
  //Extract the event click and return it in WebGL coordinates
  [x, y] = convertCoordinatesEventToGL(ev);

  g_globalAngleY = x * 180;
  g_globalAngleX = y * 180;

  renderAllShapes();
}

function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return ([x, y]);
}

function updateAnimationAngles(){
  if (g_catAnimation){
    g_tailAngle = (30 * Math.sin(g_seconds));
    g_tailMidAngle = (45 * Math.sin(g_seconds));
    g_tailMid2Angle = (90 * Math.sin(g_seconds));
    g_tailEndAngle = (45 * Math.sin(g_seconds));
  }
}

function renderAllShapes(){
  var startTime = performance.now();

  var globalRotMat = new Matrix4();
  globalRotMat.rotate(g_globalAngleX, 1, 0, 0);
  globalRotMat.rotate(-g_globalAngleY, 0, 1, 0);
  globalRotMat.rotate(g_globalAngleZ, 0, 0, 1);
  globalRotMat.scale(0.6, 0.6, 0.6);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  var body = new Cube();
  body.matrix.translate(-0.1, -0.5, 0);
  var body_head = new Matrix4(body.matrix);
  var body_buttom = new Matrix4(body.matrix);
  var R_F_Leg_Up_Co = new Matrix4(body.matrix);
  var L_F_Leg_Up_Co = new Matrix4(body.matrix);
  body.matrix.rotate(-20,1,0,0);
  body.matrix.scale(0.3, 0.8, 0.3);
  body.color = [0.9, 0.9, 0.9, 1.0];
  body.render();

  var R_F_leg_up = new Cube();
  R_F_leg_up.color = [0.9, 0.9, 0.9, 1];
  R_F_leg_up.matrix = R_F_Leg_Up_Co;
  R_F_leg_up.matrix.translate(-0.03, 0.3, -0.3);
  R_F_leg_up.matrix.translate(0, 0.3, 0);
  R_F_leg_up.matrix.rotate(g_upperArmAngle, 1, 0, 0);
  R_F_leg_up.matrix.translate(0, -0.3, 0);
  var R_F_leg_Mid_Co = new Matrix4(R_F_leg_up.matrix);
  R_F_leg_up.matrix.scale(0.15, 0.35, 0.1);
  R_F_leg_up.render();

  var R_F_leg_Mid = new Cube();
  R_F_leg_Mid.color = [0.575, 0.575, 0.575, 1];
  R_F_leg_Mid.matrix = R_F_leg_Mid_Co;
  R_F_leg_Mid.matrix.translate(0.001, -0.3, 0.0001);
  R_F_leg_Mid.matrix.translate(0, 0.3, 0);
  R_F_leg_Mid.matrix.rotate(g_lowerArmAngle, 1, 0, 0);
  R_F_leg_Mid.matrix.translate(0, -0.3, 0);
  var R_Foot_Co = new Matrix4(R_F_leg_Mid.matrix);
  R_F_leg_Mid.matrix.scale(0.149, 0.35, 0.1);
  R_F_leg_Mid.render();

  var R_Foot = new Cube();
  R_Foot.color = [0.45, 0.45, 0.45, 1];
  R_Foot.matrix = R_Foot_Co;
  R_Foot.matrix.translate(-0.05, -0.1, -0.05);
  R_Foot.matrix.scale(0.2, 0.1, 0.15);
  R_Foot.render();

  var L_F_leg_up = new Cube();
  L_F_leg_up.matrix = L_F_Leg_Up_Co;
  L_F_leg_up.color = [0.9, 0.9, 0.9, 1];
  L_F_leg_up.matrix.translate(0.17, 0.3, -0.3);
  L_F_leg_up.matrix.scale(0.15, 0.35, 0.1);
  var L_F_leg_Mid_Co = L_F_leg_up.matrix;
  L_F_leg_up.render();

  var L_F_leg_Mid = new Cube();
  L_F_leg_Mid.matrix = L_F_leg_Mid_Co;
  L_F_leg_Mid.color = [0.575, 0.575, 0.575, 1];
  L_F_leg_Mid.matrix.translate(0, -1, 0);
  var L_Foot_Co = new Matrix4(L_F_leg_Mid.matrix);
  L_F_leg_Mid.render();

  var L_Foot = new Cube();
  L_Foot.matrix = L_Foot_Co;
  L_Foot.color = [0.45, 0.45, 0.45, 1];
  L_Foot.matrix.scale(1.2, 0.3, 1.4);
  L_Foot.matrix.translate(-0.0001, -0.5, -0.2)
  L_Foot.render();

  var head = new Cube();
  head.matrix = body_head;
  head.matrix.translate(-0.075, 0.7, -0.4);
  head.matrix.translate(0.25, 0.25, 0.25);
  head.matrix.rotate(-5, 1, 0, 0);
  head.matrix.rotate(-g_headShakeAngle, 0, 1, 0);
  head.matrix.rotate(g_headVerticalAngle, 1, 0, 0);
  head.matrix.translate(-0.25, -0.25, -0.25)
  head.matrix.scale(0.45, 0.45, 0.45);
  var head_face = new Matrix4(head.matrix);
  var leftEarCo = new Matrix4(head.matrix);
  var rightEarCo = new Matrix4(head.matrix);
  head.color = [0.9, 0.9, 0.9, 1.0];
  head.render();

  var leftEar = new Ear();
  leftEar.matrix = leftEarCo;
  leftEar.color = [0.5, 0.5, 0.5, 1];
  leftEar.matrix.translate(0.85, 1, 0, 0);
  leftEar.matrix.scale(0.35, 0.5, 0.7);
  leftEar.render();

  var rightEar = new Ear();
  rightEar.matrix = rightEarCo;
  rightEar.color = [0.5, 0.5, 0.5, 1];
  rightEar.matrix.translate(0.15, 1, 0, 0);
  rightEar.matrix.scale(0.35, 0.5, 0.7);
  rightEar.render();

  var face = new Cube();
  face.matrix = head_face;
  face.matrix.translate(0.15, 0.15, -0.05);
  face.matrix.scale(0.7, 0.7, 0.1);
  var leftEyeCo = new Matrix4(face.matrix);
  var rightEyeCo = new Matrix4(face.matrix);
  var mouthCo = new Matrix4(face.matrix);
  face.color = [0.5, 0.5, 0.5, 1];
  face.render();

  var leftEye = new Cube();
  leftEye.matrix = leftEyeCo;
  leftEye.matrix.scale(0.15, 0.5, 0.1);
  leftEye.matrix.translate(4.5, 0.5, -0.2);
  leftEye.color = [1,1,1,1];
  leftEye.render();

  var rightEye = new Cube();
  rightEye.matrix = rightEyeCo;
  rightEye.matrix.scale(0.15, 0.5, 0.1);
  rightEye.matrix.translate(1.5, 0.5, -0.2);
  rightEye.color = [1,1,1,1];
  rightEye.render();

  var mouth = new Cube();
  mouth.matrix = mouthCo;
  mouth.matrix.scale(0.1, 0.1, 0.1);
  mouth.matrix.translate(4.75, 1, -0.2);
  mouth.color = [1,1,1,1];
  mouth.render();

  var buttom = new Cube();
  buttom.matrix = body_buttom;
  buttom.matrix.translate(-0.1, -0.1, -0.1);
  buttom.matrix.scale(0.5, 0.4, 0.5);
  var buttom_buttom2 = new Matrix4(buttom.matrix);
  var tailCo = new Matrix4(buttom.matrix);
  buttom.color = [0.4, 0.4, 0.4, 1];
  buttom.render();

  var buttom2 = new Cube();
  buttom2.matrix = buttom_buttom2;
  buttom2.matrix.translate(0.075, 0.2, -0.05);
  buttom2.matrix.scale(0.85, 1, 0.85);
  var buttom2_buttom3 = new Matrix4(buttom2.matrix);
  buttom2.color = [0.5, 0.5, 0.5, 1];
  buttom2.render();

  var buttom3 = new Cube();
  buttom3.matrix = buttom2_buttom3;
  buttom3.color = [0.65, 0.65, 0.65, 1];
  buttom3.matrix.translate(0.075, 0.4, -0.1);
  buttom3.matrix.scale(0.85, 0.85, 0.85);
  buttom3.render();

  var tail = new Cube();
  tail.matrix = tailCo;
  tail.color = [0.3, 0.3, 0.3, 1];
  tail.matrix.translate(0.4, 0, 0.7);
  tail.matrix.rotate(g_tailAngle, 0, 1, 0);
  var tail_Mid_Co = new Matrix4(tail.matrix);
  tail.matrix.translate(0, 0, 0.3)
  tail.matrix.scale(0.2, 0.2, 0.5);
  tail.render();

  var tail_Mid = new Cube();
  tail_Mid.color = [0.3, 0.3, 0.3, 1];
  tail_Mid.matrix = tail_Mid_Co;
  tail_Mid.matrix.translate(0, 0, 0.8);
  tail_Mid.matrix.rotate(g_tailMidAngle, 0, 1, 0);
  var tail_Mid2_Co = new Matrix4(tail_Mid.matrix);
  tail_Mid.matrix.scale(0.2, 0.2, 0.5);
  tail_Mid.render();

  var tail_Mid2 = new Cube();
  tail_Mid2.color = [0.3, 0.3, 0.3, 1];
  tail_Mid2.matrix = tail_Mid2_Co;
  tail_Mid2.matrix.translate(0, 0, 0.5);
  tail_Mid2.matrix.rotate(g_tailMid2Angle, 0, 1, 0);
  var tail_End_Co = new Matrix4(tail_Mid2.matrix);
  tail_Mid2.matrix.scale(0.2, 0.2, 0.5);
  tail_Mid2.render();

  var tail_End = new Cube();
  tail_End.color = [0.3, 0.3, 0.3, 1];
  tail_End.matrix = tail_End_Co;
  tail_End.matrix.translate(0, 0, 0.5);
  tail_End.matrix.rotate(g_tailEndAngle, 0, 1, 0);
  tail_End.matrix.scale(0.2, 0.2, 0.5);
  tail_End.render();
  



  /*
  // Draw the body cube
  var body = new Cube();
  body.color = [1.0, 0.0, 0.0, 1.0];
  body.matrix.translate(-0.25, -0.75, 0.0);
  body.matrix.rotate(-5, 1, 0, 0);
  body.matrix.scale(0.5, 0.3, 0.5);
  body.render();

  //Draw a left arm
  var leftArm = new Cube();
  leftArm.color = [1.0, 1.0, 0.0, 1.0];
  leftArm.matrix.setTranslate(0.0, -0.5, 0.0);
  leftArm.matrix.rotate(-5, 1, 0, 0);
  leftArm.matrix.rotate(-g_yellowAngle, 0, 0, 1);
  var yellowCoordinates = new Matrix4(leftArm.matrix);
  leftArm.matrix.scale(0.25, 0.7, 0.5);
  leftArm.matrix.translate(-0.5, 0, 0);
  leftArm.render();

  var box = new Cube();
  box.color = [1, 0, 1, 1];
  box.matrix = yellowCoordinates;
  box.matrix.translate(0, 0.65, 0);
  box.matrix.rotate(g_magentaAngle,0,0,1);
  box.matrix.scale(.3,.3,.3);
  box.matrix.translate(-0.5, 0, -0.001);
  // box.matrix.rotate(-30, 1, 0, 0);
  // box.matrix.scale(.2, .4, .2);
  box.render();

  var k = 10.0;
  for (var i = 1; i < k; i ++){
    var c = new Cube();
    c.matrix.translate(-0.8, 1.9*i/k-1.0, 0);
    c.matrix.rotate(g_seconds*100,1,1,1);
    c.matrix.scale(.1,0.5/k,1.0/k);
    c.render();
  }
  */
  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration), "numdot");
}

function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID);
  if(!htmlElm){
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}