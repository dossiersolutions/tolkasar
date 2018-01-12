/*
 Make a diamond isometric game area
 */
Crafty.c("DiamondIsometric", {
  _tile: 64,
  _z: 0,

  //Place in diamond isometric map
  place: function (x, y, z, width, tileHeight) {
    var pos = this.pos2px(x, y, z);
    var relativeZ = z;

    if (tileHeight == 3) {
      relativeZ = z - 2;
      z = (z - 2) + width;
    }
    else {
      z = (z * 32) + width;
    }

    this.attr({
      x: pos.left,
      y: pos.top,
      globalStartZ: ((relativeZ * 32) + width), //used for determining which tile is in front of another
      z: z
    });

    return this;
  },

  //Converts from position to pixels
  pos2px: function (x, y, z) {
    var xPos = .5 * (x * this._tile) + (y * .5 * this._tile);
    var yPos = ((.25 * this._tile) * (y - x)) + this._tile + (-1 * .5 * z * this._tile);

    return {
      left: xPos,
      top: yPos
    }
  }
});