var megaManState;
var megaManBody;
var bossMegaMan;

var gameLoreShown;
var loreline;

let battleMusic;
let tigerImg;

var bulletShot = [];
class bullet{
    constructor(){
        this.x = megaManBody.position.x;
        this.y = megaManBody.position.y - (globalWidth*0.045);
        this.xToBoss = ((windowWidth/2) - megaManBody.position.x);
        this.yToBoss = (((windowHeight/2)-(globalWidth/2)-(globalWidth*0.04)) - megaManBody.position.y);
        this.speed = createVector(this.xToBoss,this.yToBoss);
        this.radius = globalWidth*0.01;
    }

    generate(){
        this.laser = Bodies.circle(this.x, this.y, this.radius, {
            restitution: 0,
            friction: 0,
            typeOfBody:'bullet'
        });
        World.add(engine.world, [this.laser]);
    }

    draw(){
        push();
        fill(255);
        drawVertices(this.laser.vertices);
        pop();
    }

    move(){
        push();
            Body.applyForce(this.laser,{x:this.laser.position.x, y:this.laser.position.y},this.speed.limit(0.0008));
        pop();
    }

    remove(){
        setTimeout(() => {
            World.remove(engine.world, this.laser);
            bossMegaMan.healthPoints --;
          }, 100);
    }
}

bossAtks = [];
class bossBulletAttack{
    constructor(color){
        this.x = bossMegaMan.position.x;
        this.y = bossMegaMan.position.y + globalWidth*0.16;
        this.xToPlayer = (megaManBody.position.x - (windowWidth/2));
        this.yToPlayer = (megaManBody.position.y - ((windowHeight/2)-(globalWidth/2)+(globalWidth*0.04)));
        this.speed = createVector(this.xToPlayer,this.yToPlayer);
        this.radius = globalWidth*0.05;
        this.count = 0;
        this.color = color;
    }

    generate(){
        this.laser = Bodies.circle(this.x, this.y, this.radius, {
            restitution: 0,
            friction: 0,
            typeOfBody:'Bossbullet'
        });
        World.add(engine.world, [this.laser]);
    }

    draw(){
        push();
        fill(this.color);
        drawVertices(this.laser.vertices);
        pop();
    }

    move(){
        push();
            Body.applyForce(this.laser,{x:this.laser.position.x, y:this.laser.position.y},this.speed.limit(0.0095));
        pop();
    }

    remove(){
            World.remove(engine.world, this.laser);
    }

    upTime(){
        this.count ++;
    }

}

bossSAtks = [];
class bossSwipeAttack{
    constructor(x,y,color){
        this.x = x;
        this.y = y;
        this.count = 0;
        this.countWarning = 0;
        this.generated = false;
        this.color = color;
    }

    generate(){
        this.swipe = Bodies.rectangle(this.x, this.y, globalWidth/3, globalWidth*0.08,{
            isStatic: true ,restitution: 0, friction:0,typeOfBody:'bossSwipe'
          });
        World.add(engine.world, [this.swipe]);
    }

    draw(){
        push();
        fill(this.color);
        drawVertices(this.swipe.vertices);
        pop();
    }

    move(){
        push(); 
            Body.rotate(this.swipe, Math.PI/12);
        pop();
    }

    remove(){
        World.remove(engine.world, this.swipe);
    }

    warning(x,y){
        push();
            fill(255,150,150,30);
            ellipse(x,y,250,250);
        pop();
    }

    upTime(){
        this.count ++;
    }

    upTimeWarning(){
        this.countWarning ++;
    }
}

bossWallSpikeAtks= [];
class bossSpikeAttack{
    constructor(dir,color){
        if (dir == "left"){
            this.x = windowWidth/2 - globalWidth;
            this.y = windowHeight/2 - (globalWidth/2);
            this.dir = 1;
        }
        if (dir == 'right'){
            this.x = windowWidth/2 + globalWidth*0.75;
            this.y = windowHeight/2 - (globalWidth/2); 
            this.dir = -1;
        }
        this.countDuring = 0;
        this.count= 0;
        this.countWarning = 0;
        this.generated = false;
        this.color = color;
    }

    generate(){
        if (this.dir == 1){
            this.spike = Bodies.rectangle(this.x+ globalWidth/6 , this.y, globalWidth/3, globalWidth*2,{
                isStatic: true ,restitution: 0, friction:0, typeOfBody:'bossSpike'
            });
        }else{
            this.spike = Bodies.rectangle(this.x + globalWidth/12 , this.y, globalWidth/3, globalWidth*2,{
                isStatic: true ,restitution: 0, friction:0, typeOfBody:'bossSpike'
            });
        }
        World.add(engine.world, [this.spike]);
    }

    draw(){
        push();
            fill(this.color);
            drawVertices(this.spike.vertices);
        pop();
    }

    move(){
        push(); 
            this.spike.position.x += this.dir;
        pop();
    }

    remove(){
        World.remove(engine.world, this.spike);
    }

    warning(){
        push();
            fill(255,150,150,30);
            if (this.dir == 1){
                rect(this.x,this.y,globalWidth/3,globalWidth);
            }else{
                rect(this.x-globalWidth/12,this.y,globalWidth/3,globalWidth);
            }
            
        pop();
    }

    upTime(){
        this.count ++;
    }

    upTimeWarning(){
        this.countWarning ++;
    }

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function megaManDrawAll(){

    if (gameLoreShown == false){
        gameLore(loreline);
    }else if (gameLoreShown == true){
        MegaManMovement();
        drawBorderMegaMan();
        if (megaManBody.healthPoints > 0){
            drawMegaMan();
        }else{
            gameOver();
        }
        if (random(0,30)< 1 && bossMegaMan.healthPoints > 0){
            var colorForAttacks = random(['yellow','darkgreen','chocolate','blue','pink'])
            var attackChosen = [1,2,3,4,5,6,7,8,9,10];
            var attackToImplement = random(attackChosen);
            if ( attackToImplement <= 6){
                BosslaserShot = new bossBulletAttack(colorForAttacks);
                BosslaserShot.generate();
                bossAtks.push(BosslaserShot);
            }
            if (attackToImplement >6 && attackToImplement <10 ){
                BossBarAttack = new bossSwipeAttack(megaManBody.position.x + random(-60,60),megaManBody.position.y + random(-60,60),colorForAttacks);
                bossSAtks.push(BossBarAttack);
            }
            if (attackToImplement == 10){
                var dir = random(['left','right']);
                BossSpikeWall = new bossSpikeAttack(dir,colorForAttacks);
                bossWallSpikeAtks.push(BossSpikeWall);
            }
    
        };

        if (bossMegaMan.healthPoints > 0){
            drawBossMegaMan();
        }else{
            victorious();
        }
    
        bossBulletAttackTotal();
    
        bossSpinningAttackTotal();
    
        bossWallAttackTotal();
    
        megaManBodyShootBullet();

        howToPlay();
        healthPointLeft();
    }
}

function setupMegaManAll(){
    engine.gravity.y = 1;
    setupBorderMegaMan();
    setupMegaManBody();
    setupBossMegaMan();
    gameLoreShown = false;
    loreline = 11;

    //source: https://pixabay.com
    soundFormats("mp3");
    song = loadSound('assets/verbundnetzhaushalt-beatus-epic-battle-176662.mp3');
    song.setVolume(0.09);   
}

function setupBorderMegaMan(){
    clearArray(colouredBallsDefault);
    clearArray(whiteBall);
    clearArray(borders);

    generateBorder((windowWidth/2)-globalWidth-(globalWidth*0.04), (windowHeight/2), (globalWidth*0.08), globalWidth,'megaManWall');
    generateBorder((windowWidth/2)+globalWidth+(globalWidth*0.04), (windowHeight/2), (globalWidth*0.08), globalWidth,'megaManWall');
    generateBorder((windowWidth/2), (windowHeight/2)+(globalWidth/2)+(globalWidth*0.04), (globalWidth*2), (globalWidth*0.08),'megaManWall');
  }

function setupBossMegaMan(){
    bossMegaMan = Bodies.circle(windowWidth/2,(windowHeight/2)-(globalWidth/2), globalWidth*0.08,{
      isStatic: true, friction:0,typeOfBody:'boss',healthPoints:100
    });
    World.add(engine.world, [bossMegaMan]);
}

function setupMegaManBody(){
    megaManBody = Bodies.circle((windowWidth/2), (windowHeight/2 + globalWidth/3), (globalWidth*0.04), {
        restitution: 0,
        friction: 0.05,
        typeOfBody:'megaman',
        healthPoints: 5
    });
    World.add(engine.world, [megaManBody]);
}
////////////////////////////////////////////
function drawMegaMan(){
    push();
    fill('red');
    drawVertices(megaManBody.vertices);
    pop();
}

function drawBossMegaMan(){
    push();
    fill('white');
    image(tigerImg,windowWidth/2-globalWidth/2.15,(windowHeight/2)-(globalWidth*0.65),400,300);
    drawVertices(bossMegaMan.vertices);
    stroke('black');
    strokeWeight(4);
    textSize(globalWidth*0.05);
    text('Cue',windowWidth/2-globalWidth*0.05,(windowHeight/2)-(globalWidth/2));
    pop();
}

  function drawBorderMegaMan(){
      push();
      fill(100);
      for (var i =0;i<borders.length;i++){
        drawVertices(borders[i].vertices);
      }
      pop();
  }
///////////////////////////////////////////
  function MegaManMovement(){
    if (keyIsDown(65)){
        Body.applyForce(megaManBody,{x:megaManBody.position.x, y:megaManBody.position.y},{x:-0.004, y:0});
      };
      if (keyIsDown(68)){
        Body.applyForce(megaManBody,{x:megaManBody.position.x, y:megaManBody.position.y},{x:0.004, y:0});
      };
  }

  function keyPressed(){
    if (keyCode == 87 && megaManState == true && 
        megaManBody.position.y >= (windowHeight/2)+(globalWidth/2)-(globalWidth*0.082)){
        Body.applyForce(megaManBody,{x:megaManBody.position.x, y:megaManBody.position.y},{x:0, y:-0.12});
    };

    if (keyCode == 32 && megaManBody.healthPoints > 0 && gameLoreShown == true){
        laserShot = new bullet();
        laserShot.generate();
        bulletShot.push(laserShot);
    }

    if (keyCode == 32 && gameLoreShown == false && loreline == 1){
        gameLoreShown = true;
        song.play();
    }else if(keyCode == 32 && gameLoreShown == false && loreline > 1){
        loreline --;
    }
  }
///////////////////////////////////////////////////////////////////////////
function bossBulletAttackTotal(){
    if (bossAtks.length != 0 ){
        for (var i =0; i<bossAtks.length;i++){
            var attacksRemoved = false;
            bossAtks[i].draw();
            bossAtks[i].move();
            for (var o = 0; o<borders.length;o++){
                if (attacksRemoved == false && collisionDection(borders[o],bossAtks[i].laser)){
                    bossAtks[i].upTime();
                    if (bossAtks[i].count > 9){
                        bossAtks[i].remove();
                        bossAtks.splice(i,1);
                        attacksRemoved = true;
                    }
                }
            }
            if (attacksRemoved == false && collisionDection(megaManBody,bossAtks[i].laser)){
                bossAtks[i].remove();
                megaManBody.healthPoints --;
                bossAtks.splice(i,1);
                attacksRemoved = true;
            };
        };
    };
}

function bossSpinningAttackTotal(){
    if (bossSAtks.length != 0){
        for (var i =0; i< bossSAtks.length;i++){
            
            if (bossSAtks[i].countWarning > 180){
                if (bossSAtks[i].generated == false){
                    bossSAtks[i].generate();
                    bossSAtks[i].generated = true;
                }
                bossSAtks[i].draw();
                bossSAtks[i].move();
                bossSAtks[i].upTime();
            }else{
                bossSAtks[i].warning(bossSAtks[i].x,bossSAtks[i].y);
                bossSAtks[i].upTimeWarning();
            }
            if (bossSAtks[i].generated && collisionDection(megaManBody,bossSAtks[i].swipe)){
                megaManBody.healthPoints --;
            };

            if (bossSAtks[i].count > 90){
                bossSAtks[i].remove();
                bossSAtks.splice(i,1);
            }
        };
    }
}

function bossWallAttackTotal(){
    if(bossWallSpikeAtks.length != 0){
        for (var i =0; i< bossWallSpikeAtks.length;i++){
            
            if (bossWallSpikeAtks[i].countWarning > 180){
                if (bossWallSpikeAtks[i].generated == false){
                    bossWallSpikeAtks[i].generate();
                    bossWallSpikeAtks[i].generated = true;
                }
                bossWallSpikeAtks[i].draw();
                bossWallSpikeAtks[i].move();
                bossWallSpikeAtks[i].upTime();
            }else{
                bossWallSpikeAtks[i].warning();
                bossWallSpikeAtks[i].upTimeWarning();
            }
                if (bossWallSpikeAtks[i].generated && collisionDection(megaManBody,bossWallSpikeAtks[i].spike)){
                    megaManBody.healthPoints --;
                };

            if (bossWallSpikeAtks[i].count > 90){
                bossWallSpikeAtks[i].remove();
                bossWallSpikeAtks.splice(i,1);
            }
        };
    }
}

function megaManBodyShootBullet(){
    if (bulletShot.length != 0){
        for (var i =0; i<bulletShot.length;i++){
            bulletShot[i].draw();
            bulletShot[i].move();
            if (collisionDection(bossMegaMan,bulletShot[i].laser)){
                bulletShot[i].remove();
                bulletShot.splice(i,1);
            }
        };
    };
}

////////////////////////////////////////////////////////////////////

function gameLore(loreline){
    var textX = windowWidth/2-(globalWidth*1.2);
    push();
    fill(200,100,100);
    stroke(0);
    strokeWeight(4);
    textSize(globalWidth*0.05);
    if (loreline < 12){
        text('At the beginning there were only two factions, the Colors and the Reds.',textX,windowHeight/5);
    }
    if (loreline < 11){
        text('Both lived together in harmony. The people do not even knows of "War","Hunger", and even "Fear".',textX,windowHeight/5 + (globalWidth*0.06));
    }
    if (loreline < 10){
        text('Then, everything changed when "The Cue" attacked.',textX,windowHeight/5 + 2*(globalWidth*0.06));
    }
    if (loreline < 9){
        text('The Cue and its tiger ravaged both nations, bringing everyone down to their knees.',textX,windowHeight/5 + 3*(globalWidth*0.06));
    }
    if (loreline < 8){
        text('Then the Cue, a heartless being, it enslaved the whole populations.',textX,windowHeight/5 + 4*(globalWidth*0.06));
    }
    if (loreline < 7){
        text('The Cue forced the Reds to do hard labour to build what it called "The Snooker Table".',textX,windowHeight/5 + 5*(globalWidth*0.06));
    }
    if (loreline < 6){
        text('For the Colors, they are experimented on due to their Rainbow genetic.',textX,windowHeight/5 + 6*(globalWidth*0.06));
    }
    if (loreline < 5){
        text('With the genetics being used to improve the Cues weapon, we have no chance of fighting it....',textX,windowHeight/5 + 7*(globalWidth*0.06));
    }
    if (loreline < 4){
        text('Until now.',textX,windowHeight/5 + 8*(globalWidth*0.06));
    }
    if (loreline < 3){
        text('we have sucessfully cultivated the Cues power from infiltrating its palace.',textX,windowHeight/5 + 9*(globalWidth*0.06));
    }
    if (loreline < 2){
        text('Now, Sir Knight Redious the 12th, please defeat the Cue and save us all!.',textX,windowHeight/5 + 10*(globalWidth*0.06));
    }
    text('""""PRESS SPACEBAR TO CONTINUE""""',textX,windowHeight/5 + 11*(globalWidth*0.06));
    pop();
}
//////////////////////////////////////////////////////////////////
function healthPointLeft(){
    push();
        fill('red');
        stroke(0);
        strokeWeight(4);
        textSize(globalWidth*0.05);
        text("Sir Knight Redious the 12th's life :"+ megaManBody.healthPoints,50,50);
        fill('white');
        text("The Cruel Savage Villian, Cue's life :"+ bossMegaMan.healthPoints,50,50 + (globalWidth*0.06));
    pop();
}

function howToPlay(){
    push();
        fill('red');
        stroke(0);
        strokeWeight(4);
        textSize(globalWidth*0.05);
        text("A & D : Left and Right",windowWidth-350,50);
        text("W : Jump",windowWidth-350,50 + (globalWidth*0.06));
        text("SpaceBar : Shoot bullets",windowWidth-350,50 + 2*(globalWidth*0.06));
    pop();
}

function gameOver(){
    push();
        fill('white');
        stroke(0);
        strokeWeight(4);
        textSize(globalWidth*0.2);
        text('Game Over...',windowWidth/2-(globalWidth/2),windowHeight/2);
        megaManBody.healthPoints = 0;
    pop();
}

function victorious(){
    push();
        fill(200,100,100);
        stroke(0);
        strokeWeight(4);
        textSize(globalWidth*0.2);
        text('VICTORIOUS!!',windowWidth/2-(globalWidth*0.75),windowHeight/2);
        megaManBody.healthPoints = 1;
        bossMegaMan.healthPoints = 0;
    pop();
}
//////////////////////////////////////////////////////////////////
function clearArray(list){

    while (list.length > 0){
        World.remove(engine.world, list[0]);
        list.splice(0,1);
    }
}