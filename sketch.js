//-------------------------------------------COMMENTARY---------------------------word count : 506-----------------
// Before the cue ball was placed and registered onto the table with Matter.js, it was drawn with “ellipse()”. 
// This will show the user where the cue ball will be placed. Additionally, the user won’t accidentally move 
// the other balls when they are moving their cursor around to find a suitable spot to place the cue ball.

// To improve the gameplay experience, I’ve made it so that the user can move the cue ball by dragging their 
// cursor at any point on the table. With keys, the action is too imprecise. This issue was noticed when I was 
// trying to hit the blue ball across the table. With the old method of moving the cue ball requires the user’s 
// cursor to be on it and drag their mouse in the opposite direction, I am unable to shoot the cue ball with 
// sufficient strength if my cursor is dragged outside of the browser. Hence, by finding the vector of where the 
// user drags their mouse and applying it onto the cue ball, the user’s gameplay is no longer hindered by the cue 
// ball’s position.


// There is an array that contains the coordinates of the game mode’s box in the main menu (modePosition). 
// “masterFunctionsetupGameMode()” will iterate through the array and record which gamemode the user selects. 
// The chosen gamemode's index will be the inputs of “isRedBallRando(i)” and “isColouredBallsRando(i)” to 
// gain outputs that will influence the balls' position. These outputs will be used in “setupTower()”. 
// To randomise the balls’ location, I simply use “ballPosRandomiser()” which returns an object with two 
// values that represent the X and Y coordinate that is randomised within the range of the table.

// I decided to constrain the cue ball according to the rules. At the start, “setupWhiteBall()” in sketch.js, 
// will constrain the cue ball within the semi-circle starting area. This is done by calculating the counterclockwise 
// angle between the positive x-axis and the difference of the cursor’s position and the center of the semi-circle. 
// Afterwards, that angle value is then calculated with the radius of the semi-circle to find the maximum distance 
// the cue ball can be moved from the center point. With the additional use of “constrain()” and setting the limiting 
// range toward the left side of the table, the cue ball’s position is constrained to only the starting area initially. 
// However, if the cue ball is potted or somehow goes off screen, the cue ball can be placed anywhere on the table.

// I designed an extension that is related to snooker by its "loading screen lore". I had the idea of wanting to 
// create something funny, outrageous, and to an extent "not seen in snooker gaming before". Therefore, why not 
// create something with a gameplay that's so different from snooker with the "personification of snooker” twist 
// on it. Hence, I made an extension that introduces the manic shooter gameplay with the general story of the 
// protagonist (a red ball) fighting to overthrow the evil antagonist (the cue ball). This can be accessed by 
// potting all red balls or through the main menu.
//-------------------------------------------COMMENTARY----------------------------------------------------------


var Engine = Matter.Engine;//update simulated world, mane objects
var Render = Matter.Render;//visualises output of engine as HTML canvas element
var Runner = Matter.Runner;//continuously updates engine
var World = Matter.World;
var Bodies = Matter.Bodies;//simulate physical objects
var Body = Matter.Body;
var Constraint = Matter.Constraint;//method for creating and manupilating constraints (fixed distance btw bodies/position)
var Mouse = Matter.Mouse;//method for manipulating and creating mouse input
var MouseConstraint = Matter.MouseConstraint;//allows user to interact with bodies via mouse
var Composites = Matter.Composites;//methods to create composite bodies (stacks,pyramids)
var Collision = Matter.Collision;

var Events = Matter.Events//method to listen to events

var engine;
var globalWidth;

var mouseNotPressedForCue;
var mousePressedXCoord;
var mousePressedYCoord;

var canvas;
function preload(){
  //source: https://pixabay.com
  soundFormats("mp3");
  song = loadSound('assets/sunset-vibes-lo-fichillhop-9503.mp3');
  song.setVolume(0.09); 

  //source: https://www.pngfind.com/mpng/ihhoTR_free-png-download-jumping-tiger-png-images-background/
  tigerImg = loadImage("assets/pngfind.com-white-tiger-png-181761.png");
}
////////////////////////////////////////////////////////////
function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  print(canvas);
  engine = Engine.create();  // create an engine
  engine.gravity.x = 0;
  engine.gravity.y = 0;
  engine.velocityIterations = 4;

  globalWidth = windowWidth*0.39;

  ogsize = globalWidth/36;
  size = ogsize /2;

  boxesRandom = false;
  colouredBallsRandom = false;

  mouseNotPressedForCue = true;

  gameModeChosen = false;

  megaManState = false;

  setupGameMechanic();

  mouseNotPressedForCue = true;
}
////////////////////////////////////////////////////////////
function draw() {
  background(0);

  Engine.update(engine);

  if (gameModeChosen == false){
    gameModeStartText();
    gameModeOption(modePosition,modeText);
  }else if(megaManState == true && gameModeChosen == true){
    megaManDrawAll();
  } else {
    drawTable();

    drawBorder();
    
    slottedBall(ballOut);
  
    drawHoles();
  
    drawTower();

    masterFunctionsetupWhiteBall();

    drawCue();

    if (boxes.length == 0){
      song.pause();
      setupMegaManAll();
      megaManState = true;
      gameModeChosen = true;
    };
  }


}
//////////////////////////////////////////////////////////////
function mouseClicked(){
  if (mouseNotPressedForCue == true && gameModeChosen == true){
    if (ballOut.balltype == "cue"){
      setupEngineWhiteBall(windowWidth/2 - globalWidth,windowWidth/2 + globalWidth,
      windowHeight/2 - (globalWidth/2),windowHeight/2 + (globalWidth/2),"out");
      ballOut.refresh();
    }else{
      setupEngineWhiteBall((windowWidth/2)-(globalWidth/2)-((globalWidth/2)*0.3),(windowWidth/2)-(globalWidth/2),
      (windowHeight/2)-((globalWidth/2)*0.3),(windowHeight/2)+((globalWidth/2)*0.3),"play");
    }
    mouseNotPressedForCue = false;
  }

  if (gameModeChosen == false){
    masterFunctionsetupGameMode();
  }
}

function mousePressed(){
  mousePressedXCoord = mouseX;
  mousePressedYCoord = mouseY;
}
/////////////////////////////////////////////////////////////
function drawVertices(vertices) {
  beginShape();
  for (var i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape(CLOSE);
}
////////////////////////////////////////////////////////////
function isOffScreen(body){
  var pos = body.position;
  if (pos.y > windowHeight || pos.y<0 || pos.x<0 || pos.x>windowWidth){
    return true;
  }else{
    return false;
  }
}
////////////////////////////////////////////////////////////
function removeFromWorld(body) {
  World.remove(engine.world, body);
}
/////////////////////////////////////////////////////////
function setupMouseInteraction(){
  var mouse = Mouse.create(canvas.elt);
  var mouseParams = {
    mouse: mouse 
  }
  mouseConstraint = MouseConstraint.create(engine, mouseParams);
  mouseConstraint.mouse.pixelRatio = pixelDensity();
  World.add(engine.world, mouseConstraint);
}
