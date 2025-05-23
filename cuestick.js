var cueStickDrawn;
var loop;
function drawCue(){
    if (mouseNotPressedForCue == false && gameModeChosen == true && mouseIsPressed===true){
            var moverX = (mousePressedXCoord - mouseX);
            var moverY = (mousePressedYCoord - mouseY);
            var referenceVector = createVector(moverX,moverY);
            drawPath(referenceVector);
            drawCueStick(referenceVector.mult(0.15));

            cueStickDrawn = true;
            toAnimate = (referenceVector.copy()).limit(450);
            loop = 1;
    }

    if(mouseNotPressedForCue == false && gameModeChosen == true && cueStickDrawn == true && mouseIsPressed == false){
        drawCueStick(toAnimate.div(loop));
        if (loop > 4){
            cueStickDrawn = false;
        }else{
            loop++;
        }
    }
  }

  function drawPath(vectorV){
    push();
        var vector = vectorV.limit(450);
        translate(whiteBall[0].position.x,whiteBall[0].position.y);
        strokeWeight(2);
        stroke('white');
        line(0,0,vector.x,vector.y);
    pop();
  }

  function drawCueStick(vectorV){
    push();
        var vector;
        var cueStickTip;
        var handle;

        vector = createVector(250,250);
        cueStickTip = createVector(7,7);
        handle = createVector(170,170);

        vector.setHeading(vectorV.heading());
        cueStickTip.setHeading(vectorV.heading());
        handle.setHeading(vectorV.heading());
        //it work like start->|[vectorV][vector]
        vector.add(vectorV);
        cueStickTip.add(vectorV);
        handle.add(vectorV);
        // vectorVM = vectorV.mult(0.5);
        translate(whiteBall[0].position.x,whiteBall[0].position.y);

        stroke('pink')
        strokeWeight(5);
        //draw line from the end of the vector.coord to the end of the vectorV.coord
        line(-(vector.x),-(vector.y),-(vectorV.x),-(vectorV.y));
        stroke('saddlebrown');
        line(-(vectorV.x),-(vectorV.y),-(cueStickTip.x),-(cueStickTip.y));
        stroke('black');
        line(-(handle.x),-(handle.y),-(vector.x)*0.97,-(vector.y)*0.97);        
    pop();
  }