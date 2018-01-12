Crafty.c('Player', {
  direction: 1,
  isMoving: false, //Is true when the player clicks 'start'
  animationSpeed: 40,
  monsterName: "Player",
  movementArray: new Array(),
  runningIndex: 0, //index for moving while the game is running
  movementFinished: false,
  startMoving: false,
  isMovingTurn: false, //Should we stand still or move? Standing still when turning
  movingOnSolid: false,
  xPos: 0, //Grid position
  yPos: 0,
  isPlayer: true,

  init: function () {
    if (Crafty.mobile) {
      this.animationSpeed = 10;
    }

    this.requires('Actor, SpriteAnimation, spr_player, Movable')
        .bind('PlayerActionMoveForward', function () {
          this.movePlayerForward();
        })
        .bind('PlayerActionTurnLeft', function () {
          this.turnPlayerLeft();
        })
        .bind('PlayerActionTurnRight', function () {
          this.turnPlayerRight();
        })
        .bind('TilesDrawn', function () {
          Crafty.trigger('PlayerDirectionChange');
        })
        .bind('PlayerDirectionChange', function () {
          this.changeAnimation();
        })
        .bind("RestartLevel", this.restartLevel)
        .animate('PlayerMovingSE', 0, 0, 7)
        .animate('PlayerMovingSW', 0, 1, 7)
        .animate('PlayerMovingNW', 0, 3, 7)
        .animate('PlayerMovingNE', 0, 2, 7)
        .collision(this.hitPolygon)
        .collisionDetection();

    this.updatePosition(Game.updateRate);
  },

  updatePosition: function (timeStep) {
    if (this.isMoving && this.startMoving) {
      if (!this.isMovingTurn && !this.movingOnSolid) {
        this.moveMonster();
      }
    }

    //wait for the timestep amount in milliseconds, then recurse
    this.timeout(function () {
      this.updatePosition(timeStep)
    }, timeStep);
  },

  movePlayerForward: function () {
    if (!this.movingOnSolid) {
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
      this.z = this.globalStartZ;
    }
    this.isMoving = true;
    this.startMoving = true;
    this.isMovingTurn = false;
  },

  turnPlayerLeft: function () {
    this.isMovingTurn = true;
    this.isMoving = true;
    this.startMoving = true;
    this.direction--;
    if (this.direction < this.NW) {
      this.direction = this.SW;
    }
    Crafty.trigger('PlayerDirectionChange');
  },

  turnPlayerRight: function () {
    this.isMoving = true;
    this.startMoving = true;
    this.isMovingTurn = true;
    this.direction++;
    if (this.direction > this.SW) {
      this.direction = this.NW;
    }
    Crafty.trigger('PlayerDirectionChange');
  },

  changeAnimation: function () {
    var animation;

    if (this.direction == this.NW) {
      animation = "PlayerMovingNW";
    }
    else if (this.direction == this.NE) {
      animation = "PlayerMovingNE";
    }
    else if (this.direction == this.SE) {
      animation = "PlayerMovingSE";
    }
    else {
      animation = "PlayerMovingSW";
    }
    this.stop();
    this.animate(animation, 50, -1);
  },

  collisionDetection: function () {
    this.onHit('ClearLevel', this.clearLevel);
    this.onHit('MonsterKills', this.deathByMonster);
    this.onHit('WaterGreen', this.deathByWaterGreen);
    this.onHit('Water', this.deathByWater);
    this.onHit('Lava', this.deathByLava);
    this.onHit('Empty', this.deathByEmpty);
    this.onHit('TolkasarTail', this.clearGame)
  },

  death: function (message) {
    if (this.isMoving) {
      Game.alert(message + '<img class="helper-img" src="assets/kluss.png"/>');
      this.restartLevel();
    }
  },

  clearLevel: function () {
    Game.level++;
    Game.levelTextShown = false;
    this.restartLevel();
  },

  clearGame: function () {
    Game.isFinished = true;
    var textArr = [];
    textArr.push('Du kommer deg såvidt forbi hodet til den store, ildsprutende dragen, og bort til halen dens. Den ser ut til å sitte helt fast i veggen! Du finner en pinne på gulvet som du bruker til å vippe halen til dragen løs fra hullet i veggen. Da hører du et langt og tungt sukk. Den mørke stemmen runger i rommet igjen, og ildklulene stopper opp.');
    textArr.push('"Tusen takk for at du slapp meg løs! Her har jeg sittet fast i flere hundre år. Endelig kan jeg komme meg ut og fly igjen! Den ene veggen i rommet åpner seg sakte mens støvet rister fra veggene. Deretter hører du et stort flaks, og dragen er borte.');
    textArr.push('Når du går litt lengre inn i rommet finner du dragens skattekammer. Den er fylt med gull og diamanter. Du fyller opp en kiste med verdisaker, og drar den med deg ut av borgen. Gratulerer, du klarte spillet!');
    textArr.push("Prog., design og grafikk:<br/>Merethe Granevang<br/><br/>Ekstra grafikk:<br/>Majka 4 år og Ronja 2 år<br/><br/>Ekstra idéer og testing:<br/>Ronny Reitan og Roar Granevang<br/><br/>Takk til alle andre som hjalp til med testingen!");
    Crafty.pause();
    Game.alertNext(textArr);
    Crafty.scene("End");
  },

  deathByMonster: function () {
    this.death("<br/><br/>Monsteret spiser deg! Prøv igjen!");
  },

  deathByWater: function () {
    this.death("<br/><br/>Du faller i vannet! Prøv igjen!");
  },

  deathByWaterGreen: function () {
    this.death("<br/><br/>Du faller i slimet! Prøv igjen!");
  },

  deathByLava: function () {
    this.death("<br/><br/>Du faller i lavaen! Prøv igjen!");
  },

  deathByEmpty: function () {
    this.death("<br/><br/>Du faller ned i hullet! Prøv igjen!");
  },

  restartLevel: function () {
    this.isMoving = false;
    this.isMovingTurn = false;
    this.direction = 1;
    Game.controls.index = 0;
    this.runningIndex = 0;
    Game.lastMovementArray = this.movementArray.slice();
    this.movementArray.length = 0;
    Game.saveOldPos();
    Crafty.trigger('ResetControls');
    Crafty.trigger('PlayerDirectionChange');
    Crafty.scene("Game");
  }
});