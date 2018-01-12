//Master component for all monsters
Crafty.c('Monster', {
  direction: 1,
  init: function () {
    this.requires('Actor, Movable')
  }
});

//Every monster that kills extends this one. Used for collition detection.
Crafty.c('MonsterKills', {
  init: function () {
  }
});

//Monsters who only moves around on one tile
Crafty.c('MonsterMoveSameTile', {
  pixelsToMove: 3,
  onePixelMove: 3, //how many pixels one move is. May be random

  init: function () {
    this.updatePosition(Game.updateRate);
  },

  updatePosition: function (timeStep) {
    this.moveMonster();

    //wait for the timestep amount in milliseconds, then recurse
    this.timeout(function () {
      this.updatePosition(timeStep)
    }, timeStep);
  },

  moveMonster: function () {
    if (this.pixelsToMove == 0) { //No more pixels to move, move back to center
      if (this.direction == this.NW) {
        this.direction = this.SE;
      }
      else if (this.direction == this.SE) {
        this.direction = this.NW;
      }
      else if (this.direction == this.NE) {
        this.direction = this.SW;
      }
      else if (this.direction == this.SW) {
        this.direction = this.NE;
      }
    }
    else if (this.pixelsToMove == -(this.onePixelMove)) { //We're back at the center
      this.onePixelMove = Math.floor(Math.random() * 6) + 1;
      this.pixelsToMove = this.onePixelMove;
      this.direction = Math.floor(Math.random() * 4);
    }
    else if (this.direction == this.NE) {
      this.moveNe();
    }
    else if (this.direction == this.NW) {
      this.moveNw();
    }
    else if (this.direction == this.SE) {
      this.moveSe();
    }
    else if (this.direction == this.SW) {
      this.moveSw();
    }

    this.pixelsToMove--;
  }
});

//Monsters who move a special selected movement
Crafty.c('MonsterMoveSelectedMovement', {
  FORWARD: 0,
  TURN_RIGHT: 1,
  TURN_LEFT: 2,
  U_TURN_AND_GO: 3, //two turns and one forward in one action
  STAND_STILL: 4, //two turns and one forward in one action
  isMovingTurn: false, //Turning moves don't go forward
  runningIndex: 0, //index for moving while the game is running
  hasFourAnimations: false, //Has direction animations
  isMovableMonster: true,
  isMoving: false,

  init: function () {
    this.bind(this.monsterName + 'ActionStandStill', function () {
      this.isMovingTurn = true;
      this.isMoving = true;
    })
        .bind(this.monsterName + 'ActionMoveForward', function () {
          //Update coordinates
          if (this.direction == this.NW) {
            this.xPos--;
          }
          else if (this.direction == this.NE) {
            this.yPos++
          }
          else if (this.direction == this.SE) {
            this.xPos++
          }
          else {
            this.yPos--;
          }
          this.isMovingTurn = false;
          this.isMoving = true;
        })
        .bind(this.monsterName + 'ActionMoveUturnAndGo', function () {
          //Update coordinates
          if (this.direction == this.NW) {
            this.xPos++;
          }
          else if (this.direction == this.NE) {
            this.yPos--
          }
          else if (this.direction == this.SE) {
            this.xPos--
          }
          else {
            this.yPos++;
          }
          this.isMovingTurn = false;
          this.direction = this.direction - 2;
          if (this.direction < this.NW) {
            this.direction = this.direction + 4;
          }
          this.isMoving = true;
        })
        .bind(this.monsterName + 'ActionMoveBackwards', function () {
          this.isMovingTurn = false;
          this.isMoving = true;
        })
        .bind(this.monsterName + 'ActionTurnLeft', function () {
          this.isMovingTurn = true;
          this.direction--;
          if (this.direction < this.NW) {
            this.direction = this.SW;
          }
          this.isMoving = true;
        })
        .bind(this.monsterName + 'ActionTurnRight', function () {
          this.isMovingTurn = true;
          this.direction++;
          if (this.direction > this.SW) {
            this.direction = this.NW;
          }
          this.isMoving = true;
        });

    this.updatePosition(Game.updateRate);
  },

  updatePosition: function (timeStep) {
    if (!this.isMovingTurn && this.isMoving) {
      this.moveMonster();
    }

    //wait for the timestep amount in milliseconds, then recurse
    this.timeout(function () {
      this.updatePosition(timeStep)
    }, timeStep);
  },

  reset: function () {
    this.runningIndex = 0;
    this.direction = this.initialDirection;
    this.isMovingTurn = false;
    this.yPos = this.startX;//reversed
    this.xPos = this.startY;
    this.place(this.startX, this.startY, this.startZ, this.width, this.tileHeight);
    this.isMoving = false;
  }

});

Crafty.c('Spider', {
  monsterName: "Spider",
  movementArray: new Array(),
  init: function () {
    this.requires('Monster, SpriteAnimation, spr_spider, MonsterMoveSelectedMovement, MonsterKills')
        .collision(this.hitPolygon);
    this.movementArray = [this.U_TURN_AND_GO, this.FORWARD, this.FORWARD];
    this.attr({initialDirection: this.NW});
    this.direction = this.initialDirection;
    this.animate('spiderAnim', 0, 0, 3);
    //this.animate('spiderAnim', 0, 4, 3);
    this.animate('spiderAnim', 5, -1)
  }
});

Crafty.c('SpiderBlue', {
  monsterName: "SpiderBlue",
  movementArray: new Array(),
  init: function () {
    this.requires('Monster, SpriteAnimation, spr_spiderBlue, MonsterMoveSelectedMovement, MonsterKills')
        .collision(this.hitPolygon);
    this.movementArray = [this.U_TURN_AND_GO, this.FORWARD, this.FORWARD, this.FORWARD];
    this.attr({initialDirection: this.SW});
    this.direction = this.initialDirection;
    this.animate('spiderAnim', 0, 0, 3);
    //this.animate('spiderAnim', 4, 4, 7);
    this.animate('spiderAnim', 5, -1)
  }
});

Crafty.c('Fly', {
  monsterName: "Fly",
  init: function () {
    this.requires('Monster, spr_fly, MonsterMoveSameTile, MonsterKills')
        .collision(this.hitPolygon);
  }
});

Crafty.c('Snail', {
  monsterName: "Snail",
  movementArray: new Array(),
  init: function () {
    this.requires('Monster, SpriteAnimation, spr_snail, MonsterMoveSelectedMovement, MonsterKills')
        .collision(this.hitPolygon);
    this.movementArray = [
      this.FORWARD, this.FORWARD, this.FORWARD, this.U_TURN_AND_GO, this.FORWARD, this.FORWARD, this.TURN_RIGHT,
      this.FORWARD, this.FORWARD, this.FORWARD, this.U_TURN_AND_GO, this.FORWARD, this.FORWARD, this.TURN_LEFT
    ];
    this.attr({initialDirection: this.NE});
    this.direction = this.initialDirection;
    this.hasFourAnimations = true;
    this.animate('AnimateSE', 0, 0, 2)
        .animate('AnimateSW', 0, 1, 2)
        .animate('AnimateNW', 0, 2, 2)
        .animate('AnimateNE', 0, 3, 2);
    /*this.animate('AnimateSE', 8, 0, 10)
     .animate('AnimateSW', 8, 1, 10)
     .animate('AnimateNW', 8, 2, 10)
     .animate('AnimateNE', 8, 3, 10);*/
    this.animate('AnimateSW', 50, -1)
  }
});

Crafty.c('SnailBlue', {
  monsterName: "SnailBlue",
  movementArray: new Array(),
  init: function () {
    this.requires('Monster, SpriteAnimation, spr_snailBlue, MonsterMoveSelectedMovement, MonsterKills')
        .collision(this.hitPolygon);
    this.movementArray = [this.U_TURN_AND_GO, this.FORWARD, this.FORWARD, this.FORWARD];
    this.attr({initialDirection: this.SW});
    this.direction = this.initialDirection;
    this.hasFourAnimations = true;
    this.animate('AnimateSE', 0, 0, 2)
        .animate('AnimateSW', 0, 1, 2)
        .animate('AnimateNW', 0, 2, 2)
        .animate('AnimateNE', 0, 3, 2);
    /*
     this.animate('AnimateSE', 11, 0, 13)
     .animate('AnimateSW', 11, 1, 13)
     .animate('AnimateNW', 11, 2, 13)
     .animate('AnimateNE', 11, 3, 13);*/
    this.animate('AnimateSW', 50, -1)
  }
});

Crafty.c('TolkasarHandRight', {
  monsterName: "TolkasarHandRight",
  isTolkasarHandRight: true,
  init: function () {
    this.requires('Monster, spr_tolkasarHand')
        .collision(this.spr_tolkasarHand);  //TODO: increase hitpolygon
  }
});
Crafty.c('TolkasarHandLeft', {
  monsterName: "TolkasarHandLeft",
  init: function () {
    this.requires('Monster, spr_tolkasarHand')
        .collision(this.spr_tolkasarHand);  //TODO: increase hitpolygon
  }
});
Crafty.c('TolkasarTail', {
  monsterName: "TolkasarTail",
  init: function () {
    this.requires('Monster, SpriteAnimation, spr_tolkasarTail')
        .collision(this.spr_tolkasarHand);  //TODO: increase hitpolygon
    if (!Crafty.mobile) {//Too heavy for the mobile version
      this
          .animate('Animate', 0, 0, 3)
          .animate('Animate', 50, -1);
    }
    this.setZModifier(-1);//Should be 1 tile below the others
  }
});

Crafty.c('TolkasarHead', {
  monsterName: "TolkasarHead",
  isTolkasarHead: true,
  movementArrayStage2: new Array(),
  remainingWaitingForFireball: 0,
  startingRemainingWaitingForFireball: 5,
  movesBetweenFireballs: 5,

  init: function () {
    this.requires('Monster, spr_tolkasarHead, MonsterMoveSelectedMovement')
        .collision(this.spr_tolkasarHead);  //TODO: increase hitpolygon
    this.movementArray = [this.FORWARD, this.FORWARD, this.FORWARD, this.U_TURN_AND_GO, this.FORWARD];

    this.attr({initialDirection: this.NW});
    this.direction = this.initialDirection;
    this.remainingWaitingForFireball = this.startingRemainingWaitingForFireball;

    this
        .bind("NextMoveAction", function () {
          this.remainingWaitingForFireball--;
          if (this.remainingWaitingForFireball <= 0) {
            var fireball = Crafty.e("Fireball");
            fireball.place(this.yPos, this.xPos, -4, 1000, fireball.tileHeight);
            fireball.startX = this.yPos;
            fireball.startY = this.xPos;
            fireball.xPos = this.yPos;//reversed
            fireball.yPos = this.xPos;
            this.remainingWaitingForFireball = this.movesBetweenFireballs;
            Game.movables.push(fireball);
          }
        });
  },

  resetTolkasar: function () {
    this.remainingWaitingForFireball = this.startingRemainingWaitingForFireball;
  }
});

Crafty.c('Fireball', {
  monsterName: "Fireball",
  movementArray: new Array(),
  isFireball: true,

  init: function () {
    this.requires('Monster, SpriteAnimation, spr_fireball, MonsterMoveSelectedMovement, MonsterKills')
        .collision(this.hitPolygon);
    this.movementArray = [this.FORWARD, this.FORWARD];
    this.attr({initialDirection: this.SW});
    this.direction = this.initialDirection;
    this.animate('Animation', 0, 0, 3);
    this.animate('Animation', 10, -1);
    this.onHit('StoneDark', function () {
      this.destroy();
    });
  }
});