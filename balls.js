var boxes;

var colouredBalls;
var colouredBallsDefault=[];

var whiteBall = [];

var ogsize;
var size;

function setupTower(boxesRandom,colouredBallsRandom){
    var startX;
    var startY
    var randoPos;
    boxes = [];
    colouredBalls=[];
    colouredBallsDefault=[[(windowWidth/2)-(globalWidth/2),(windowHeight/2)+((globalWidth/4)*0.6),'yellow'],[(windowWidth/2)-(globalWidth/2),(windowHeight/2)-((globalWidth/4)*0.6),'darkgreen'],
                          [(windowWidth/2)-(globalWidth/2),(windowHeight/2),'chocolate'],[(windowWidth/2),(windowHeight/2),'blue'],
                          [(windowWidth/2)+(globalWidth/2)-ogsize,(windowHeight/2),'pink'],[(windowWidth/2)+(globalWidth/4*3),(windowHeight/2),'black']];

    if (boxesRandom != false){
        for (var i =0; i<15;i++){
            randoPos = ballPosRandomiser();
            startX = randoPos.x;
            startY = randoPos.y;
            generateBall(startX,startY,size,boxes,'red','red');
        }
    }else{
        for (var row=1; row<=6;row++){
            startX = windowWidth/2-(1.80*ogsize)+(globalWidth/2);
            startY = windowHeight/2+ogsize;
            if (row > 1) {
                startY = startY-(ogsize*(row/2));
                startX = startX+(ogsize*(row*0.90));
            }
        
            for (var i = 1;i<row;i++){
                generateBall(startX,startY,size,boxes,'red','red');
                startY = startY+ogsize;
            }
        }
    }
  
    for (var i = 0;i<colouredBallsDefault.length;i++){
      if (colouredBallsRandom == false){
        startX = colouredBallsDefault[i][0];
        startY = colouredBallsDefault[i][1];
        var colorOfBall = colouredBallsDefault[i][2];
      }else{
        randoPos = ballPosRandomiser();
        startX = randoPos.x;
        startY = randoPos.y;
        var colorOfBall = colouredBallsDefault[i][2];
      }
      
      generateBall(startX,startY,size,colouredBalls,colorOfBall,'colour')
    }    
}
  
function drawTower(){
    push();
      for (var i = 0; i<boxes.length;i++){
        drawBall(boxes[i]);
      }
  
      for (var i = 0;i<colouredBalls.length;i++){
        drawBall(colouredBalls[i]);
      }
    pop();
    ballNearHole(boxes);
    ballNearHole(colouredBalls);
  }
////////////////////////////////////////////////////////////////////////////////////////
  function ballPosRandomiser(){
    var Posx = random((windowWidth/2)-globalWidth,(windowWidth/2)+globalWidth);
    var Posy = random((windowHeight/2)-(globalWidth/2),(windowHeight/2)+(globalWidth/2));
    var pos = {x: Posx,y: Posy};
    return pos;
  }
/////////////////////////////////////////////////////////////
function setupWhiteBall(x1,x2,y1,y2,ballStatus){  
    var mX = constrain(mouseX,x1,x2);
    var mY = constrain(mouseY,y1,y2);
  

    if (ballStatus == "play"){
      let d = dist(mouseX, mouseY, (windowWidth/2)-(globalWidth/2),windowHeight/2);
      if (d > (globalWidth/2)*0.3) {
        // Calculate angle and set the ball inside the play area semi-circle
        let angle = atan2(mouseY - windowHeight/2, mouseX - ((windowWidth/2)-(globalWidth/2)));
        let constrainedX = ((windowWidth/2)-(globalWidth/2)) + cos(angle) * ((globalWidth/2)*0.3);
        let constrainedY = windowHeight/2 + sin(angle) * ((globalWidth/2)*0.3);
        if (constrainedX < (windowWidth/2)-(globalWidth/2)){
          mX = constrainedX;
          mY = constrainedY;
        }
      } 
    }

    push();
    fill(255);
    ellipse(mX,mY,ogsize);
    stroke(0);
    strokeWeight(4);
    textSize(globalWidth*0.05);
    text('Place the cue ball in the starting area to start playing',windowWidth/2-(globalWidth/2),windowHeight/5);
    pop();
}
  
  function setupEngineWhiteBall(x1,x2,y1,y2, ballStatus){
    var startX = constrain(mouseX,x1,x2);
    var startY = constrain(mouseY,y1,y2);
    if (ballStatus == "play"){
      let d = dist(mouseX, mouseY, (windowWidth/2)-(globalWidth/2),windowHeight/2);
      if (d > (globalWidth/2)*0.3) {
        // Calculate angle and set the ball inside the play area semi-circle
        let angle = atan2(mouseY - windowHeight/2, mouseX - ((windowWidth/2)-(globalWidth/2)));
        let constrainedX = ((windowWidth/2)-(globalWidth/2)) + cos(angle) * ((globalWidth/2)*0.3);
        let constrainedY = windowHeight/2 + sin(angle) * ((globalWidth/2)*0.3);
        if (constrainedX < (windowWidth/2)-(globalWidth/2)){
          startX = constrainedX;
          startY = constrainedY;
        }
      } 
    }
    generateBall(startX,startY,size,whiteBall,'white','cue');
  }
  
  function masterFunctionsetupWhiteBall(){
    if (mouseNotPressedForCue == true){
      if (ballOut.balltype == "cue"){
        setupWhiteBall(windowWidth/2 - globalWidth,windowWidth/2 + globalWidth,
        windowHeight/2 - (globalWidth/2),windowHeight/2 + (globalWidth/2),"out");
      }else{
        setupWhiteBall((windowWidth/2)-(globalWidth/2)-((globalWidth/2)*0.3),(windowWidth/2)-(globalWidth/2),
        (windowHeight/2)-((globalWidth/2)*0.3),(windowHeight/2)+((globalWidth/2)*0.3),"play");
      }
    };
  
    if(mouseNotPressedForCue == false){
      drawWhiteBall();
      iterateForCollision(whiteBall,boxes);
      iterateForCollision(whiteBall,colouredBalls);
      iterateForCollision(whiteBall,borders);
      if(isOffScreen(whiteBall[0]) && whiteBall.length == 1){
        removeFromWorld(whiteBall[0]);
        whiteBall.splice(0,1);
        mouseNotPressedForCue = true;
      }
    };
  }
  
  function drawWhiteBall(){
    push();
    if (mouseNotPressedForCue == false && whiteBall.length !=0){
      drawBall(whiteBall[0])
    }
    pop();
    ballNearHole(whiteBall);
  }
  
  function mouseReleased(){
    if (mouseNotPressedForCue == false && gameModeChosen == true && whiteBall.length == 1){
        setTimeout(() => {
            var dynamicDamp = 25000/globalWidth;
            var moverX = (mousePressedXCoord - mouseX)/(globalWidth*dynamicDamp);
            var moverY = (mousePressedYCoord - mouseY)/(globalWidth*dynamicDamp);
      
            var mover = createVector(moverX,moverY);
            Body.applyForce(whiteBall[0],{x:whiteBall[0].position.x, y:whiteBall[0].position.y},mover.limit(0.016));
          }, 90);
    }
  }

/////////////////////////////////////////////////////////////
  function generateBall(x,y,size,boxes,colourV,typeV){
    var box = Bodies.polygon(x, y,50,size,{
        restitution: 0.8,
        friction: 0.11,
        frictionAir:0.011,
        colour: colourV,
        typeOfBody: typeV,
      });
      World.add(engine.world,[box]);
      boxes.push(box);
  }

  function drawBall(ball){
    ball.angle = 0;
    ball.angularSpeed = 0;
    ball.angularVelocity = 0;
    fill(ball.colour);
    drawVertices(ball.vertices);
  }