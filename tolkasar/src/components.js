/*
 Components that are used by other components
 */

//Required by every element on the screen
Crafty.c('Actor', {
  init: function () {
    this.requires('2D, DOM, DiamondIsometric, Collision');
    this.hitPolygon = new Crafty.polygon([15, 50], [33, 40], [50, 50], [33, 60]); //for collisionDetection with monsters and obstacles
    this.tileHitPolygon = new Crafty.polygon([10, 18], [33, 7], [55, 18], [33, 30]); //for collisionDetection with tiles
  },
  hitPolygon: null, //Selected hitPolygon
  zModifier: 0,
  tileHeight: 1,

  setZModifier: function (z) {
    this.zModifier = z; //how high the tile is
  },

  setTileHeight: function (tileHeight) {
    this.tileHeight = tileHeight; //how many tiles high the tile is
  }
});

//Required by all movable elements
Crafty.c('Movable', {
  NW: 0,
  NE: 1,
  SE: 2,
  SW: 3,
  initialDirection: 1,
  isMovable: true,

  init: function () {
    this.direction = this.initialDirection;
  },

  moveNe: function () {
    this.x = this.x + 2;
    this.y = this.y - 1;
  },

  moveSe: function () {
    this.x = this.x + 2;
    this.y = this.y + 1;
  },

  moveNw: function () {
    this.x = this.x - 2;
    this.y = this.y - 1;
  },

  moveSw: function () {
    this.x = this.x - 2;
    this.y = this.y + 1;
  },

  /*
   snapToGrid:function () {
   if (this.isTolkasarHead) {
   this.place(this.yPos - 1, this.xPos + 1, 2, 256, this.tileHeight); //todo make more generic
   }
   else {
   this.place(this.yPos - 1, this.xPos + 1, 1, 64, this.tileHeight); //increase z to get in front in the view
   }
   },*/

  moveMonster: function () {
    if (this.direction == this.NE) {
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
    this.z = this.globalStartZ;
  }
});





