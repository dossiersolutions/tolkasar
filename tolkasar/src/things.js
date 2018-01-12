Crafty.c('Grass', {
  init: function () {
    this.requires('Actor, spr_grass');
  }
});

Crafty.c('Dirt', {
  init: function () {
    this.requires('Actor, spr_dirt');
  }
});

Crafty.c('DirtBlue', {
  init: function () {
    this.requires('Actor, spr_dirtBlue');
  }
});
Crafty.c('DirtGray', {
  init: function () {
    this.requires('Actor, spr_dirtGray');
  }
});

Crafty.c('Stone', {
  init: function () {
    this.requires('Actor, spr_stone');
  }
});
Crafty.c('StoneDark', {
  init: function () {
    this.requires('Actor, spr_stoneDark');
  }
});
Crafty.c('StoneLight', {
  init: function () {
    this.requires('Actor, spr_stoneLight');
  }
});
Crafty.c('StoneTile', {
  init: function () {
    this.requires('Actor, spr_stoneTile');
  }
});
Crafty.c('StoneBrown', {
  init: function () {
    this.requires('Actor, spr_stoneBrown');
  }
});
Crafty.c('StoneBrownTile', {
  init: function () {
    this.requires('Actor, spr_stoneBrownTile');
  }
});

Crafty.c('Water', {
  init: function () {
    this.requires('Actor, SpriteAnimation, spr_water')
        .collision(this.tileHitPolygon)
        .animate('AnimateWater', 0, 0, 2);
    this.animate('AnimateWater', 60, -1);
  }
});
Crafty.c('WaterGreen', {
  init: function () {
    this.requires('Actor, SpriteAnimation, spr_waterGreen')
        .collision(this.tileHitPolygon);
    if (!Crafty.mobile) {//Too heavy for the mobile version
      this.animate('AnimateWater', 0, 0, 2);
      this.animate('AnimateWater', 60, -1);
    }
  }
});
Crafty.c('Lava', {
  init: function () {
    this.requires('Actor, SpriteAnimation, spr_lava')
        .collision(this.tileHitPolygon);
    if (!Crafty.mobile) {//Too heavy for the mobile version
      this.animate('AnimateLava', 0, 0, 3);
      this.animate('AnimateLava', 20, -1);
    }
  }
});
Crafty.c('Empty', {
  init: function () {
    this.requires('Actor, spr_empty')
        .collision(this.tileHitPolygon);
  }
});

Crafty.c('Tree', {
  init: function () {
    this.requires('Actor, spr_tree');
    this.setTileHeight(3);
    this.setZModifier(2);//Should be 2 tiles abowe the others
  }
});
Crafty.c('TreeBlue', {
  init: function () {
    this.requires('Actor, spr_treeBlue');
    this.setTileHeight(3);
    this.setZModifier(2);//Should be 2 tiles abowe the others
  }
});

Crafty.c('Statue', {
  init: function () {
    this.requires('Actor, spr_statue');
  }
});

Crafty.c('TorchRight', {
  init: function () {
    this.requires('Actor, SpriteAnimation, spr_torchRight');
    if (!Crafty.mobile) {//To heavy for the mobile version
      this.animate('animate', 0, 0, 2);
      this.animate('animate', 5, -1)
    }
  }
});
Crafty.c('TorchLeft', {
  init: function () {
    this.requires('Actor, SpriteAnimation, spr_torchLeft');
    if (!Crafty.mobile) {//To heavy for the mobile version
      this.animate('animate', 0, 0, 2);
      this.animate('animate', 5, -1)
    }
  }
});

Crafty.c('ClearLevel', {
  init: function () {
  }
});

Crafty.c('Stairs_up_east', {
  init: function () {
    this.requires('Actor, spr_stairs_up_east, ClearLevel')
        .collision(this.hitPolygon); //must be called on all object that can collide;
  }
});
Crafty.c('Stairs_up_west', {
  init: function () {
    this.requires('Actor, spr_stairs_up_west, ClearLevel')
        .collision(this.hitPolygon);
  }
});

Crafty.c('Stairs_down_east', {
  init: function () {
    this.requires('Actor, spr_stairs_down_east, ClearLevel')
        .collision(this.hitPolygon);
  }
});

Crafty.c('Stairs_down_west', {
  init: function () {
    this.requires('Actor, spr_stairs_down_west, ClearLevel')
        .collision(this.hitPolygon);
  }
});

Crafty.c('Treasure1', {
  init: function () {
    this.requires('Actor, spr_treasure1')
  }
});
Crafty.c('Treasure2', {
  init: function () {
    this.requires('Actor, spr_treasure2')
  }
});
Crafty.c('Treasure3', {
  init: function () {
    this.requires('Actor, spr_treasure3')
  }
});

Crafty.c('Mushrooms', {
  init: function () {
    this.requires('Actor, spr_mushrooms')
  }
});
Crafty.c('MushroomsBlue', {
  init: function () {
    this.requires('Actor, spr_mushroomsBlue')
  }
});