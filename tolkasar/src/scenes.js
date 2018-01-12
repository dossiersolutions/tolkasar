Crafty.scene('Loading', function () {
  Crafty.e('2D, DOM, Text')
      .text('Loading...')
      .attr({x: 0, y: 0});

  //Gimp: gaussian blur: 0.7 on all images

  //todo: put sprites into one file
  Crafty.load(['assets/mPlayerAnimBlur.png'], function () {
    //Tiles
    Crafty.sprite(64, 'assets/tiles.png', {
      spr_grass: [3, 0, 1, 1],
      spr_dirt: [0, 0, 1, 1],
      spr_dirtBlue: [1, 0, 1, 1],
      spr_dirtGray: [2, 0, 1, 1],
      spr_stone: [2, 1, 1, 1],
      spr_stoneDark: [3, 1, 1, 1],
      spr_stoneLight: [1, 1, 1, 1],
      spr_stoneTile: [1, 2, 1, 1],
      spr_stoneBrown: [0, 1, 1, 1],
      spr_stoneBrownTile: [0, 2, 1, 1],
      spr_mushrooms: [0, 3, 1, 1],
      spr_mushroomsBlue: [1, 3, 1, 1],
      spr_tree: [4, 0, 1, 2],
      spr_treeBlue: [4, 2, 1, 2],
      spr_statue: [2, 4, 1, 1],
      spr_treasure1: [3, 3, 1, 1],
      spr_treasure2: [3, 4, 1, 1],
      spr_treasure3: [2, 3, 1, 1],
      spr_stairs_down_east: [1, 4, 1, 1],
      spr_stairs_down_west: [0, 4, 1, 1],
      spr_stairs_up_west: [3, 2, 1, 1],
      spr_stairs_up_east: [2, 2, 1, 1]
    });

    Crafty.sprite(64, 'assets/mWaterBlur.png', {
      spr_water: [0, 0, 1, 1]
    });
    Crafty.sprite(64, 'assets/mWaterGreenBlur.png', {
      spr_waterGreen: [0, 0, 1, 1]
    });
    Crafty.sprite(64, 'assets/lava2Blur.png', {
      spr_lava: [0, 0, 1, 1]
    });

    Crafty.sprite(64, 'assets/torchBlur.png', {
      spr_torchRight: [0, 0, 1, 1]
    });
    Crafty.sprite(64, 'assets/torchBlurLeft.png', {
      spr_torchLeft: [0, 0, 1, 1]
    });

    /*
     //Monsters
     Crafty.sprite(64, 'assets/monsters.png', {
     spr_player:         [0, 0],
     spr_spider:         [0, 4],
     spr_spiderBlue:     [4, 4],
     spr_fly:            [8, 4],
     spr_snail:          [8, 0],
     spr_snailBlue:      [11, 0],
     spr_treasure3:      [11, 4],
     spr_treasure2:      [12, 4],
     spr_treasure1:      [13, 4]
     });
     */

    //Monsters
    Crafty.sprite(64, 'assets/mPlayerAnimBlur.png', {
      spr_player: [0, 0]
    }, 0, 0);

    Crafty.sprite(64, 'assets/spiderAnimBlur.png', {
      spr_spider: [0, 0]
    }, 0, 0);

    Crafty.sprite(64, 'assets/spiderAnimBlurBlue.png', {
      spr_spiderBlue: [0, 0]
    }, 0, 0);

    Crafty.sprite(64, 'assets/mMyggBlurLiten64.png', {
      spr_fly: [0, 0]
    }, 0, 0);

    Crafty.sprite(64, 'assets/snail4Blur.png', {
      spr_snail: [0, 0]
    }, 0, 0);

    Crafty.sprite(64, 'assets/snail4BlurYellow.png', {
      spr_snailBlue: [0, 0]
    }, 0, 0);

    //Tolkasar
    Crafty.sprite(256, 'assets/TolkasarLeftHandBlur.png', {
      spr_tolkasarHand: [0, 0]
    }, 0, 0);
    Crafty.sprite(128, 'assets/tolkasarTailBlur.png', {
      spr_tolkasarTail: [0, 0]
    }, 0, 0);
    Crafty.sprite(256, 'assets/tolkasar_head2Blur.png', {
      spr_tolkasarHead: [0, 0]
    }, 0, 0);
    Crafty.sprite(64, 'assets/fireballBlur.png', {
      spr_fireball: [0, 0]
    }, 0, 0);

    Crafty.scene('Game');
  })
});

//Starts the game
Crafty.scene('Game', function () {
  Game.movables.length = 0; //clear for old monsters
  Crafty.viewport.init(Game.screenWidth, Game.screenHeight);

  game.iso = Crafty.isometric.size(64);
  LevelGenerator.init();
  LevelGenerator.create(game.iso, Game.level);

  $("#lastSelectedControls").html($("#selectedControls").children().clone());
  $("#selectedControls").html(""); //Don't copy previous steps

  if (Game.level == 1 && !Game.levelTextShown) {//First time
    Game.center();
    var textArr = new Array();
    textArr.push("<br/><img src='assets/tolkasarHeadingBlur.png'>");
    textArr.push("Du vandrer hjemover fra den lokale tavernaen. Med ett ser du to kjente typer stå foran deg. Ronny Råskinn og Jarle Jernøks puster tungt og ser forslåtte ut. De stopper opp en stund og forteller deg at de prøvde seg på borgen til den mektige dragen Tokasar. Ingen har sett ham eller rikdommene hans på flere hundre år.");
    textArr.push('Det antas at dragen er borte, men at rikdommene hans fortsatt er gjemt i borgen hans. <br/><img class="helper-img" src="assets/dragonSmall.png"/>');
    textArr.push('Ronny Råskinn og Jarle Jernøks forteller at de ble stoppet av gigantiske insekter og krypdyr. Du smiler lurt, og tenker "Dette høres ut som et oppdrag for Ira Ildkule!".<br/><img class="helper-img" src="assets/ira2.png"/>');
    textArr.push(Game.levelEntity.text);
    Game.alertNext(textArr);
    Game.levelTextShown = true;
    Game.center();
  }
  else {
    if (!Game.levelTextShown) {//New level
      Game.alert(Game.levelEntity.text);
      Game.levelTextShown = true;
    }

    Game.centerOnPrevious();
  }

  Crafty.viewport.clampToEntities = false;
  Crafty.viewport.mouselook(true);
});

Crafty.scene('End', function () {
  Game.center();
  var text = Crafty.e('2D, DOM, Text')
      .text('The End').css("font-size", "xx-large").css("text-align", "center").css("white-space", "nowrap")
      .attr({x: 200, y: 100});
  Crafty.viewport.centerOn(text);
});
