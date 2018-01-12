/*
 Generates levels
 */
LevelGenerator = {
  levels: new Array(),

  init: function () {//todo: more levels
    game.levelGenerator = this;
    this.levels[1] = Level1;
    this.levels[2] = Level2;
    this.levels[3] = Level3;
    this.levels[4] = Level4;
    this.levels[5] = Level5;
    this.levels[6] = Level6;
    this.levels[7] = Level7;
    this.levels[8] = Level8;
    this.levels[9] = Level9;
    this.levels[10] = Level10;
  },

  levelWidth: function () {
    return this.levels[Game.level].tiles[0][0].length;
  },

  levelHeight: function () {
    return this.levels[Game.level].tiles[0].length;
  },

  //Tiles that are solid, the player can't walk through them
  isSolid: function (tileChar) {
    if (tileChar == "s"
        || tileChar == "S"
        || tileChar == "t"
        || tileChar == "T"
        || tileChar == "u"
        || tileChar == "o"
        || tileChar == "l"
        || tileChar == "z"
        || tileChar == "Z") {
      return true;
    }
    else {
      return false;
    }
  },

  //Create the right tile based on the level map
  createTile: function (x, y, tileArray) {
    var element = tileArray[x][y];
    var monster;

    if (element == "g") {
      return Crafty.e("Grass");
    }

    else if (element == "d") {
      return Crafty.e("Dirt");
    }
    else if (element == "D") {
      return Crafty.e("DirtGray");
    }
    else if (element == "b") {
      return Crafty.e("DirtBlue");
    }

    else if (element == "s") {
      return Crafty.e("Stone");
    }
    else if (element == "S") {
      return Crafty.e("StoneDark");
    }
    else if (element == "l") {
      return Crafty.e("StoneLight");
    }
    else if (element == "o") {
      return Crafty.e("StoneTile");
    }
    else if (element == "z") {
      return Crafty.e("StoneBrown");
    }
    else if (element == "Z") {
      return Crafty.e("StoneBrownTile");
    }

    else if (element == "w") {
      return Crafty.e("Water");
    }
    else if (element == "W") {
      return Crafty.e("WaterGreen");
    }
    else if (element == "L") {
      return Crafty.e("Lava");
    }
    else if (element == "p") {
      return Crafty.e("Empty");
    }

    else if (element == "t") {
      return Crafty.e("Tree");
    }
    else if (element == "T") {
      return Crafty.e("TreeBlue");
    }
    else if (element == "u") {
      return Crafty.e("Statue");
    }
    else if (element == "i") {
      return Crafty.e("TorchRight");
    }
    else if (element == "I") {
      return Crafty.e("TorchLeft");
    }

    else if (element == "e") {
      return Crafty.e("Stairs_up_east");
    }
    else if (element == "E") {
      return Crafty.e("Stairs_up_west");
    }
    else if (element == "f") {
      return Crafty.e("Stairs_down_east");
    }
    else if (element == "F") {
      return Crafty.e("Stairs_down_west");
    }

    else if (element == "m") {
      return Crafty.e("Mushrooms");
    }
    else if (element == "M") {
      return Crafty.e("MushroomsBlue");
    }

    else if (element == "9") {
      return Crafty.e("Treasure1");
    }
    else if (element == "8") {
      return Crafty.e("Treasure2");
    }
    else if (element == "7") {
      return Crafty.e("Treasure3");
    }

    else if (element == "c") {
      monster = Crafty.e("Player");
      Game.movables.push(monster);
      Game.player = monster;
      return monster;
    }
    else if (element == "1") {
      monster = Crafty.e("Spider");
      Game.movables.push(monster);
      return monster;
    }
    else if (element == "3") {
      monster = Crafty.e("SpiderBlue");
      Game.movables.push(monster);
      return monster;
    }
    else if (element == "2") {
      monster = Crafty.e("Fly");
      //Game.movables.push(monster);
      return monster;
    }
    else if (element == "4") {
      monster = Crafty.e("Snail");
      Game.movables.push(monster);
      return monster;
    }
    else if (element == "5") {
      monster = Crafty.e("SnailBlue");
      Game.movables.push(monster);
      return monster;
    }

    else if (element == "K") {
      monster = Crafty.e("TolkasarHead");
      Game.movables.push(monster);
      return monster;
    }
    else if (element == "k") {
      return Crafty.e("TolkasarTail");
    }
    else if (element == "h") {
      return Crafty.e("TolkasarHandRight");
    }
    else if (element == "H") {
      return Crafty.e("TolkasarHandLeft");
    }

    else {//Game tile not found
      return null;
    }
  },

  drawTiles: function (iso, level, tileArray, z) {
    //reverse the order
    var tileArrayReversed = new Array();
    var yReversed = this.levelHeight();
    for (var y = 0; y < this.levelHeight(); y++) {
      yReversed--;
      tileArrayReversed[yReversed] = tileArray[y];
    }

    var tile;
    for (y = 0; y < this.levelHeight(); y++) {
      for (var x = 0; x < this.levelWidth(); x++) {
        tile = this.createTile(x, y, tileArrayReversed);
        if (tile != null) {
          tile.startX = x;
          tile.startY = y;
          tile.xPos = y;//reversed
          tile.yPos = x;
          tile.startZ = tile.zModifier + z + level.startZ;
          if (tile.isTolkasarHead) {
            tile.place(x, y, tile.zModifier + z + level.startZ, 256, tile.tileHeight);
          }
          else if (tile.isTolkasarHandRight) { //hack to make it in front of tolkasars head
            tile.place(x, y, tile.zModifier + z + level.startZ, 1000, tile.tileHeight);
          }
          else {
            tile.place(x, y, tile.zModifier + z + level.startZ, 64, tile.tileHeight);
          }
        }
      }
    }
  },

  //Create the specified level
  create: function (iso, levelNum) {
    if (levelNum >= this.levels.length) {
      Crafty.scene("End"); //todo: make end scene
    }
    var level = this.levels[levelNum];
    Game.levelEntity = level;
    Crafty.background(level.bgColor);

    for (var i = 0; i < level.tiles.length; i++) {
      this.drawTiles(iso, level, level.tiles[i], i);
    }
    Crafty.trigger('TilesDrawn');
    Game.refreshView();
  }

};