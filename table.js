var borderLeft;
var borderRight;
var borderTop;
var borderRight;
var borders=[];

var holes;
///////////////////////////////////////////////
function setupBorder(){
    generateBorder((windowWidth/2)-globalWidth-(globalWidth*0.04), (windowHeight/2), (globalWidth*0.08), globalWidth,'border');
    generateBorder((windowWidth/2)+globalWidth+(globalWidth*0.04), (windowHeight/2), (globalWidth*0.08), globalWidth,'border');
    generateBorder((windowWidth/2), (windowHeight/2)-(globalWidth/2)-(globalWidth*0.04), (globalWidth*2), (globalWidth*0.08),'border');
    generateBorder((windowWidth/2), (windowHeight/2)+(globalWidth/2)+(globalWidth*0.04), (globalWidth*2), (globalWidth*0.08),'border');
  }

  function drawBorder(){
      push();
      fill('#2B1700');
      for (var i =0;i<borders.length;i++){
        drawVertices(borders[i].vertices);
      }
      pop();
  }
///////////////////////////////////////////////
function generateBorder(x,y,w,h,typeV){
    wall = Bodies.rectangle(x,y,w,h, {
        isStatic: true, friction:0,typeOfBody:typeV
      });
    World.add(engine.world, [wall]);
    borders.push(wall);
}
///////////////////////////////////////////////
function drawHoles(){
    for (var i = 0; i<6;i++){
      fill(60);
      ellipse(holes[i][0],holes[i][1],(globalWidth/36)*1.5)
    }
}

function setupTable(){
    holes = [[windowWidth/2 - (globalWidth*0.99),windowHeight/2 - ((globalWidth/2)*0.98)], //top left hole
             [windowWidth/2,windowHeight/2 - (globalWidth/2)], //top middle hole
             [windowWidth/2 + (globalWidth*0.99),windowHeight/2 - ((globalWidth/2)*0.98)],//top right hole
             [windowWidth/2 - (globalWidth*0.99),windowHeight/2 + ((globalWidth/2)*0.98)],//bottom left hole
             [windowWidth/2,windowHeight/2 + (globalWidth/2)],//bottom middle hole
             [windowWidth/2 + (globalWidth*0.99),windowHeight/2 + ((globalWidth/2)*0.98)]]//bototm right hole
}
/////////////////////////////////////////////////
function drawTable(){
    push();
    //golden corners
    fill('#FFD700');
    for (var i =0;i<2;i++){
      var topC = windowHeight/2-(globalWidth/2);
      if (i == 1){
        topC = topC + globalWidth;
      }
      topC = topC 
      for (var p = 0;p<2;p++){
        ellipse(windowWidth/2 - (globalWidth*pow(-1,p)),topC,(globalWidth*0.16));
      }
    }
  
    //green play area
    fill(0,125,0);
    rect(windowWidth/2 - globalWidth,windowHeight/2 - (globalWidth/2),(globalWidth*2),globalWidth);
  
    //the white marking lines
    for (var i = 1;i<=2;i++){
      strokeWeight(2);
      stroke(255);
      line((windowWidth/2)-(globalWidth/2),(windowHeight/2),(windowWidth/2)-(globalWidth/2),(windowHeight/2)+((globalWidth/2)*pow(-1,i)));
    }
    arc((windowWidth/2)-(globalWidth/2),windowHeight/2,(globalWidth/2)*0.6,(globalWidth/2)*0.6,HALF_PI,PI + HALF_PI);
    fill(255);
    ellipse((windowWidth/2)-(globalWidth/2),windowHeight/2,5);
    pop();
}
/////////////////////////////////////////////////////////////
