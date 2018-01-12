/*
 Takes care of the input controls and trigger next move action for all moving entities
 */
Crafty.c('ControlOrder', {//for moving player and MonsterMoveSelectedMovement
  FORWARD: 0,
  TURN_RIGHT: 1,
  TURN_LEFT: 2,
  U_TURN_AND_GO: 3,
  STAND_STILL: 4,
  index: 0, //index for initializing the movement array, for player only
  pixelsToMove: 16, //How many pixels remains before next action
  onePixelMove: 16, //How many pixels should we move between actions
  stage: 1, //Boss stages
  actionsBeforeNextStage: 10, //Remaining actions before next stage
  actionsInOneStage: 30, //How many actions should we trigger before next stage

  init: function () {
    game.controls = this;
    this
        .bind('MovePlayerForward', function () {
          this.add(this.FORWARD);
        })
        .bind('MovePlayerLeft', function () {
          this.add(this.TURN_LEFT);
        })
        .bind('MovePlayerRight', function () {
          this.add(this.TURN_RIGHT);
        })
        .bind('NextMoveAction', function () {
          this.triggerNextMoveActions();
        })
        .bind('StartMoving', function () {
          this.resetMonsterMovement();
          Game.player.isMoving = true;
        })
        .bind('ResetControls', function () {
          this.index = 0;
          this.resetMonsterMovement();
        });

    this.checkForNextAction(Game.updateRate);
  },

  checkForNextAction: function (timeStep) {
    this.pixelsToMove--;
    if (this.pixelsToMove <= 0) { //No pixels to move
      Crafty.trigger("NextMoveAction");
      this.pixelsToMove = this.onePixelMove;
    }

    //wait for the timestep amount in milliseconds, then recurse
    this.timeout(function () {
      this.checkForNextAction(timeStep)
    }, timeStep);
  },

  //Trigger next action for all movable objects
  triggerNextMoveActions: function () {
    var alreadyMoved = new Array();
    var monster;
    for (var i = 0; i < Game.movables.length; i++) {
      monster = Game.movables[i];
      if (alreadyMoved.indexOf(monster.monsterName) == -1) {
        if (!(monster.isPlayer && !Game.player.isMoving)) {//Don't move the player if the 'move' button hasn't been clicked yet
          if (monster.isMovable) {
            //monster.snapToGrid(); //todo rmg: do we need this?
          }
          monster.isMoving = true;
          this.nextMoveAction(monster);
          alreadyMoved.push(monster.monsterName);
          if (monster.hasFourAnimations) {
            this.animateMonster(monster);
          }
        }
      }
    }
  },

  //Animate monster based on direction
  animateMonster: function (monster) {
    var animation;

    if (monster.direction == monster.NW) {
      animation = "AnimateNW";
    }
    else if (monster.direction == monster.NE) {
      animation = "AnimateNE";
    }
    else if (monster.direction == monster.SE) {
      animation = "AnimateSE";
    }
    else {
      animation = "AnimateSW";
    }
    monster.stop();
    monster.animate(animation, 100, -1);
  },

  //Reset all movables
  resetMonsterMovement: function () {
    Crafty("Fireball").destroy()

    var movable;
    for (var i = 0; i < Game.movables.length; i++) {
      movable = Game.movables[i];
      movable.pixelsToMove = Game.controls.pixelsToMove;
      if (movable.isMovableMonster) {
        movable.reset();
      }
      if (movable.isTolkasarHead) {
        movable.resetTolkasar();
      }
    }
  },

  //Register a new movement
  add: function (movement) {
    //$("#numberOfSelectedControls").text((parseInt($("#numberOfSelectedControls").text()) + 1));
    var arrow;
    if (movement == this.FORWARD) {
      $("#selectedControls").append('<img src="assets/up-arrow.png" height="20"/>'); //todo: more dynamic
    }
    else if (movement == this.TURN_LEFT) {
      $("#selectedControls").append('<img src="assets/left-arrow.png" height="20"/>'); //todo: more dynamic
    }
    else if (movement == this.TURN_RIGHT) {
      $("#selectedControls").append('<img src="assets/right-arrow.png" height="20"/>'); //todo: more dynamic
    }
    Game.player.movementArray[this.index] = movement;
    this.index++;
  },

  //Update boss stage
  updateStage: function () {//For boss stages
    this.actionsBeforeNextStage--;
    if (this.actionsBeforeNextStage <= 0) {
      this.stage++;
      this.actionsBeforeNextStage = this.actionsInOneStage;
      Crafty.trigger("NextStage");
    }
  },

  //Check if next step is solid or out of game area
  nextStepIsSolid: function (monster) {
    var x = monster.xPos;
    var y = monster.yPos;

    if (monster.direction == monster.NW) {
      x--;
    }
    else if (monster.direction == monster.NE) {
      y++
    }
    else if (monster.direction == monster.SE) {
      x++
    }
    else {
      y--;
    }

    //Check out of game area
    if (y < 0 || x < 0 ||
        y >= Game.levelGenerator.levelHeight()
        || x >= Game.levelGenerator.levelWidth()) {
      return true
    }

    //Remember that x an y are switched in the level array)
    return Game.levelGenerator.isSolid(Game.levelEntity.tiles[1][Game.levelGenerator.levelHeight() - y - 1][x]);
  },

  //Do the next action for a movable object
  nextMoveAction: function (monster) {
    this.updateStage();

    if (monster.isPlayer) {//may implement for other monsters later
      if (this.nextStepIsSolid(monster)) {
        monster.movingOnSolid = true;
      }
      else {
        monster.movingOnSolid = false;
      }
    }

    if (monster.movementArray[monster.runningIndex] == this.FORWARD) {
      Crafty.trigger(monster.monsterName + "ActionMoveForward");
    }
    else if ((monster.movementArray[monster.runningIndex] == this.U_TURN_AND_GO)) {//Only for monsters, not player
      Crafty.trigger(monster.monsterName + "ActionMoveUturnAndGo");
    }
    else if (monster.movementArray[monster.runningIndex] == this.TURN_LEFT) {
      Crafty.trigger(monster.monsterName + "ActionTurnLeft");
    }
    else if (monster.movementArray[monster.runningIndex] == this.TURN_RIGHT) {
      Crafty.trigger(monster.monsterName + "ActionTurnRight");
    }
    else if (monster.movementArray[monster.runningIndex] == this.STAND_STILL) {//Only for monsters, not player
      Crafty.trigger(monster.monsterName + "ActionStandStill");
    }

    if (monster.movementFinished && monster.isPlayer && !Game.isFinished) {
      Game.alert('<p>Du kom ikke helt fram. Prøv igjen!</p>Du må gå helt fram til mål (trappa) i en omgang. Husk at pilene til høyre og venstre ikke er gå-piler, men snu-piler.</p><p>Hver gang du prøver på nytt går alt tilbake til startposisjonen.</p>');
      Crafty.trigger('RestartLevel');
    }
    monster.runningIndex++;

    if (monster.runningIndex >= monster.movementArray.length) {
      if (!monster.isPlayer) {
        monster.attr({runningIndex: 0});
      }
      else {
        monster.movementFinished = true;
      }
    }
  }
});