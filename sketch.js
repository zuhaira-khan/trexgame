var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var score;
var PLAY = 1;
var END = 0;
var gamestate = PLAY;
var obstacleGroup, cloudsGroup;
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6
var gameoverimg, restartimg;
var jumpsound, checkpointsound, diesound
var rand



function preload(){
  trex_running = loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameoverimg = loadImage("gameOver.png");
  restartimg = loadImage("restart.png");
  //loading sounds
  jumpsound = loadSound("jump.mp3")
  checkpointsound = loadSound("checkPoint.mp3")
  diesound = loadSound("die.mp3")
}

function setup() {

  createCanvas(600,200)
  
  //create a trex sprite
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  trex.debug = false;
  trex.setCollider("circle",0,0,60)
  //create a ground sprite
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  rand = Math.round(random(10,20))

  //creating invisible ground
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  //console.log("hello"+4)
  score = 0

  obstacleGroup = new Group()
  cloudsGroup = new Group()

  //creating gameover
  gameover = createSprite(300,100)
  gameover.addImage(gameoverimg)
  gameover.scale = 1.5
  gameover.visible = false

  //creating restart
  restart = createSprite(300,140)
  restart.addImage(restartimg)
  restart.scale = 0.5
  restart.visible = false
}

function draw() {
  //set background color
  background(180);
  console.log(rand)
  text("Score: "+score,500,50)
  

  if(gamestate == PLAY){
    ground.velocityX = -4;
    score=score+Math.round(frameCount/60)
    if(score%100 == 0 && score>0){
      checkpointsound.play()
    }
    // jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 100) 
    {
      trex.velocityY = -10;
      jumpsound.play()
    } 
    // when velocity is +ve trex comes down, -ve then trex moves up. 
    //limit is set so trex will come back down again and not exit canvas.
    trex.velocityY = trex.velocityY + 0.8

    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    spawnClouds();
    spawnObstacles();

    if(obstacleGroup.isTouching(trex)){
      gamestate = END
      diesound.play()
    //trex.velocityY = -10
    }
  }
  else if(gamestate == END){
    trex.velocityY = 0
    ground.velocityX = 0
    trex.changeAnimation("collided", trex_collided)
    obstacleGroup.setVelocityXEach(0)
    cloudsGroup.setVelocityXEach(0)
    obstacleGroup.setLifetimeEach(-1)
    cloudsGroup.setLifetimeEach(-1)
    gameover.visible = true
    restart.visible = true

  if(mousePressedOver(restart)){
    reset()
  }
 
  }
 
  
  
  
  //stop trex from falling down
  trex.collide(invisibleGround);

  drawSprites();
 
}
function spawnClouds(){
  if(frameCount % 60==0){
  cloud = createSprite(600,50,20,10)
  cloud.velocityX = -5
  cloud.scale = 0.5
  cloud.addImage(cloudImage)
  cloud.y = Math.round(random(10,60))
  cloud.lifetime = 120;
  //console.log(trex.depth)
  cloud.depth = trex.depth
//  console.log(cloud.depth)
  trex.depth=trex.depth+1
  cloudsGroup.add(cloud)
  }
}
function spawnObstacles(){
  if(frameCount % 60==0){
    var obstacle = createSprite(600,165,10,40)
    obstacle.debug = false;
    obstacle.velocityX = -(6 + score/100)
    var rand = Math.round(random(1,6))
    switch(rand){
      case 1:obstacle.addImage(obstacle1)
              break;
      case 2:obstacle.addImage(obstacle2)
              break;
      case 3:obstacle.addImage(obstacle3)
              break;
      case 4:obstacle.addImage(obstacle4)
              break;
      case 5:obstacle.addImage(obstacle5)
              break;
      case 6: obstacle.addImage(obstacle6)
              break;
    }
    obstacleGroup.add(obstacle)
    obstacle.scale = 0.5
    obstacle.lifetime = 100;
  }
}
function reset(){
  score = 0
  gamestate = PLAY
  obstacleGroup.destroyEach()
  cloudsGroup.destroyEach()
  gameover.visible = false
  restart.visible = false
}