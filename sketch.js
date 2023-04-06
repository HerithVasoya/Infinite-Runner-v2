//game variabes
var Background, BackgroundImg;
var rockGroup, rock1, rock2, rock3;
var hunter, hunterAni, hunterCollided, hunterJumpImg;
var InvisibleGround;
var score = 0;

//GameState variables
var GameState = 1;
var Play = 1;
var End = 0;

function preload(){
    rock1 = loadImage("rock1.png");
    rock2 = loadImage("rock2.png");
    rock3 = loadImage("rock3.png");
    
    BackgroundImg = loadImage("background.jpeg");

    hunterAni = loadAnimation("H-walk1.png", "H-walk2.png", "H-walk3.png", "H-walk4.png", "H-walk5.png", "H-walk6.png", "H-walk7.png", "H-walk8.png", "H-walk9.png", "H-walk10.png", "H-walk11.png", "H-walk12.png");
    hunterJumpImg = loadImage("H-walk4.png");
    hunterCollided = loadImage("hunter-collided.png");

    jumpSound = loadSound("jump.mp3");
    dieSound = loadSound("die.mp3");
}

function setup() {
    createCanvas(600, 600);
    
    Background = createSprite(500, 300, 600, 600);
    Background.addImage("Bg", BackgroundImg);
    Background.scale = 0.5;

    hunter = createSprite(400, 170, 100, 100);
    hunter.addAnimation("walk", hunterAni);
    hunter.addAnimation("jump", hunterJumpImg);
    hunter.addAnimation("Collided", hunterCollided);
    hunter.setCollider("rectangle", -325, 110, 40, 50);
    hunter.debug = true;

    InvisibleGround = createSprite(300, 400, 600, 2);
    InvisibleGround.visible = false;

    //creates group for rocks
    rockGroup = createGroup();
}

function draw() {
 drawSprites();
 
 if (GameState == Play) {

    if(keyDown("space") && hunter.y >= 250) {
        hunter.velocityY = -12;
        hunter.changeAnimation("jump", hunterJumpImg);
        jumpSound.play();
    }
    else if ( hunter.y >= 250) {
        hunter.changeAnimation("walk", hunterAni);
    } 
    
    //moves background
    Background.velocityX = -(1 + 2.05 * score/150);
    
    //add gravity
    hunter.velocityY = hunter.velocityY + 0.8;

    //spawns rocks
    spawnObstacles();

    //checks if rocks are touching the hunter
    if(rockGroup.isTouching(hunter)){
        GameState = End;
        dieSound.play()
      
    }
    
    if (Background.x < 50) {
        Background.x = Background.width/4;
    }

    score += 1;
    textSize(15);
    text("Distance: " + score, 450, 150);
 }
 else if (GameState == End) {
    
    trex.changeAnimation("Collided", hunterCollided);
    
    Background.velocityX = 0;
    hunter.velocityY = 0;

    //changes lifetime to never be destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
    //keeps rocks still 
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
 }

 hunter.collide(InvisibleGround);

}

function spawnObstacles(){
    if (frameCount % 60 === 0){
      var rock = createSprite(600,400,40,80);
      //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: rock.addImage(rock1);
              break;
      case 2: rock.addImage(rock2);
              break;
      case 3: rock.addImage(rock3);
              break;
      default: break;
    }

      rock.scale = 0.1
      rock.velocityX = -(1 + 2.05 * score/150);
      
      
       //assign scale and lifetime to the obstacle           
       //rock.scale = 0.5;
       rock.lifetime = 600;
      
      //add each obstacle to the group
       rockGroup.add(rock);
    }
   }