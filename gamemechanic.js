var boxesRandom;
var colouredBallsRandom;

var gameModeChosen;

var modePosition;
var modeText;

var point;

var ballOut;
var prevballOut;
class ballForSlottingMechanic{
  constructor(ball,colour){
    this.balltype = ball;
    this.colourCompare = colour;
  }

  refresh(){
    this.balltype = "temp";
    this.colourCompare=0;
  }

  clone(){
    return new ballForSlottingMechanic(this.balltype,this.colourCompare);
  }
}
function setupGameMechanic(){
    modePosition = [{x:(windowWidth/2)-globalWidth, y:windowHeight/2, w:100, h:100},
                {x:(windowWidth/2)-50, y:windowHeight/2, w:180, h:100},
                {x:(windowWidth/2)+globalWidth-100, y:windowHeight/2, w:180, h:100},
                {x:(windowWidth/2)-50, y:windowHeight*0.75, w:100, h:100}];
    modeText = ["Default","Red Randomised","All Randomised","Secret"];

    ballOut = new ballForSlottingMechanic("temp",0);
    prevballOut = new ballForSlottingMechanic("temp",0);
    ballOut.refresh();
    prevballOut.refresh();
}

/////////////////////////////////////////////////////////////
function ballNearHole(list){
    Events.on(engine, 'beforeUpdate', function(event) {
      for (var i =0;i<list.length;i++){
        // Check if the body is near the center
        if (isNearHole(list[i])) {
          // Remove the body from the world
          ballOut.balltype = list[i].typeOfBody;
          ballOut.colourCompare = list[i].colour;
          World.remove(engine.world, list[i]);
          list.splice(i,1);
        }
      }
    });
  }
  
  function isNearHole(body) {
    for (var i=0;i<6;i++){
      const holeX = holes[i][0];
      const holeY = holes[i][1];
    
      // Set a threshold distance for considering it "near"
      const threshold = (globalWidth/36)*1.5/2; // Adjust this value as needed
    
      // Calculate the distance between the body's position and the canvas center
      const distance = Matter.Vector.magnitude(Matter.Vector.sub(body.position, { x: holeX, y: holeY }));
      if (distance<threshold){
        return true;
      }
    }
    return false;
  }
  /////////////////////////////////////////////////////////////

  function gameModeStartText(){
    push();
        fill(255);
        stroke(0);
        strokeWeight(4);
        textSize(globalWidth*0.05);
        text('Which game mode do you want to start with?',windowWidth/2-(globalWidth/2),windowHeight/5);
    pop();
  }

  function gameModeOption(pos,textV){
    for (var i =0;i<pos.length;i++){
        drawGameMode(pos[i].x,pos[i].y,pos[i].w,pos[i].h,textV[i]);
    }
  }

  function drawGameMode(x,y,w,h,textstr){
    push();
        stroke(200);
        strokeWeight(3);
        rect(x,y,w,h);
        textSize(14);
        text(textstr,x+(w/5),y+(h/2));
    pop();
  }

  function userSelectedGameMode(mX,mY,x,y,w,h){
    if ((mX>x) && (mX<(x+w)) && (mY > y) && (mY < (y+h))){
        return true;
    }
    return false;
  }

  function isRedBallsRando (mode){
    if (mode ==0){
        return false;
    }
    else{
        return true;
    }
  }

  function isColouredBallsRando (mode){
    if (mode == 2){
        return true;
    }
    else{
        return false;
    }
  }

  function masterFunctionsetupGameMode(){
    for (var i=0;i<modePosition.length;i++){
      if (userSelectedGameMode(mouseX,mouseY,modePosition[i].x,modePosition[i].y,modePosition[i].w,modePosition[i].h)){
        if (i == 3){
          setupMegaManAll();
          megaManState = true;
          gameModeChosen = true;
          break;
        }else{  
          song.play();

          setupBorder();

          setupTable();

          boxesRandom = isRedBallsRando(i);
          colouredBallsRandom = isColouredBallsRando(i);
          gameModeChosen = true;
          setupTower(boxesRandom,colouredBallsRandom);
          break;
        }
      }
    }
  }
  ///////////////////////////////////////////////////////////////////////
  function collisionDection(bodyA,bodyB){
    if (Collision.collides(bodyA,bodyB) != null){
        if (Collision.collides(bodyA,bodyB).collided != null){
            print(bodyA.typeOfBody+"-"+bodyB.typeOfBody);
            return true;
        }
    }
  }

  function iterateForCollision(bodyGroupA,bodyGroupB){
    for(var i = 0;i<bodyGroupA.length;i++){
        for(var o=0;o<bodyGroupB.length;o++){
            collisionDection(bodyGroupA[i],bodyGroupB[o]);
        }
    }
  }
////////////////////////////////////////////////////////////////////////////
function slottedBall(typeV){
  if (typeV.balltype != "temp"){
    if(typeV.balltype == 'cue'){
      mouseNotPressedForCue = true;
      prevballOut = typeV.clone();
    }
    if(typeV.balltype == 'red'){
      prevballOut = typeV.clone();
      typeV.refresh();
    }
    if(typeV.balltype == 'colour'){
      if (prevballOut.balltype == typeV.balltype){
        alert("You made a mistake of slotting two consecutive coloured balls");
        resetColourBall(typeV);
      } else{
        resetColourBall(typeV);
      }
      prevballOut = typeV.clone();
      typeV.refresh();
    }
  }
}

function resetColourBall(typeV){
  var check = typeV.colourCompare;
  for (var i = 0; i<colouredBallsDefault.length;i++){
    if (check == colouredBallsDefault[i][2]){
      var startX = colouredBallsDefault[i][0];
      var startY = colouredBallsDefault[i][1];
      var colorOfBall = colouredBallsDefault[i][2];
      generateBall(startX,startY,size,colouredBalls,colorOfBall,'colour');
      break; 
    }
  } 
}

