/*
 Game is the class that holds the game together.
 Stores variables that are used between levels.
 */

var game;

Game = {
  player: null,                   //Current player
  levelGenerator: null,           //The level generator
  screenWidth: 0,                 //Width of the game area
  screenHeight: 0,                //Height of the game area
  level: 1,                       //Current level number
  levelEntity: null,              //Current level entity
  movables: new Array(),          //List of moving objects
  zoomLevel: 0,                   //Zoom level selected by user
  levelTextShown: false,          //Is level text for the current level already shown?
  textArr: new Array(),           //array with text to display
  textArrIndex: 0,                //which text in the textArr should be displayed
  oldX: 0,                        //previous viewport x
  oldY: 0,                        //previous viewport y
  lastMovementArray: new Array(), //previous player moves
  surfaceTileWidth: 64,           //Width of the surface the player is walking on
  surfaceTileHeight: 32,          //Height of the surface the player is walking on
  heightOffset: 235,              //Height of the controllers at the bottom
  widthOffset: 20,                //Need extra space for padding around the game area
  mobileWidthOffset: 50,          //Mobiles need a bit more space (for some reason)
  updateRate: 20,                 //Number of milliseconds before next movement calculation
  isFinished: false,              //True when the game is cleared

  //Starts the game
  start: function () {
    game = this;
    this.screenWidth = $(window).width() - this.widthOffset;
    this.screenHeight = $(window).height() - this.heightOffset;
    Crafty.init(this.screenWidth, this.screenHeight);
    Crafty.e('ControlOrder');
    Crafty.scene('Loading');
  },

  //Refresh view based on zoom level
  refreshView: function () {
    if (this.zoomLevel == 0) {
      Crafty.viewport.scale(0);
    }
    else if (this.zoomLevel == 1) {
      Crafty.viewport.scale(0);
      Crafty.viewport.scale(1.5);
    }
    else if (this.zoomLevel == 2) {
      Crafty.viewport.scale(0);
      Crafty.viewport.scale(2);
    }
    else if (this.zoomLevel == -1) {
      Crafty.viewport.scale(0);
      Crafty.viewport.scale(0.5)
    }
    else if (this.zoomLevel == -2) {
      Crafty.viewport.scale(0);
      Crafty.viewport.scale(0.25);
    }
  },

  //Store selected positions for next level
  saveOldPos: function () {
    Game.oldX = Crafty.viewport.x;
    Game.oldY = Crafty.viewport.y;
  },

  //Center on stored positions
  centerOnPrevious: function () {
    Crafty.viewport.x = Game.oldX;
    Crafty.viewport.y = Game.oldY;
  },

  //Center the viewport
  center: function () {
    if (Crafty.mobile) {
      Crafty.viewport.x = Math.ceil((Crafty.viewport.width - this.mobileWidthOffset) / 2 - (Crafty.viewport._zoom * this.surfaceTileWidth * Game.levelGenerator.levelWidth() / 2));
      Crafty.viewport.y = Math.ceil((Crafty.viewport.height - this.heightOffset) / 2 - (Crafty.viewport._zoom * this.surfaceTileHeight * Game.levelGenerator.levelHeight() / 2));
    }
    else {
      Crafty.viewport.x = Math.ceil((Crafty.viewport.width) / 2 - (Crafty.viewport._zoom * this.surfaceTileWidth * Game.levelGenerator.levelWidth() / 2));
      Crafty.viewport.y = Math.ceil((Crafty.viewport.height) / 2 - (Crafty.viewport._zoom * this.surfaceTileHeight * Game.levelGenerator.levelHeight() / 2));
    }
  },

  zoomIn: function () {
    if (this.zoomLevel < 2) {
      this.zoomLevel++;
      Crafty.viewport.x = Crafty.viewport.x - (this.surfaceTileWidth * Game.levelGenerator.levelWidth() / 4);
      Crafty.viewport.y = Crafty.viewport.y - (this.surfaceTileHeight * Game.levelGenerator.levelHeight() / 4);
      this.refreshView();
    }
  },

  zoomOut: function () {
    if (this.zoomLevel > -1) {
      this.zoomLevel--;
      Crafty.viewport.x = Crafty.viewport.x + (this.surfaceTileWidth * Game.levelGenerator.levelWidth() / 4);
      Crafty.viewport.y = Crafty.viewport.y + (this.surfaceTileHeight * Game.levelGenerator.levelHeight() / 4);
      this.refreshView();
    }
  },

  copyLastMovements: function () {
    $("#selectedControls").html($("#lastSelectedControls").children().clone());
    this.player.movementArray = this.lastMovementArray.slice();
    this.controls.index = this.player.movementArray.length;
  },

  removeAllMovements: function () {
    this.player.movementArray.length = 0;
    this.controls.index = 0;
    $("#selectedControls").html("");
  },

  removeLastMovement: function () {
    $("#selectedControls img:last-child").remove();
    Game.player.movementArray.pop();
    this.controls.index--;
  },

  //Gives a message similar to an alert
  alert: function (text) {
    if (text.indexOf("<") !== -1) {
      $("#popupContent").text("");
      $("#popupContent").append(text);
    }
    else {
      $("#popupContent").text(text);
    }

    $('#popupDiv').jqmShow();
    $('#popupDiv').center();
    $('#popupClose').show();
    $('#popupNext').hide();
  },

  //Alert box with next-link instead of close
  alertNext: function (textArr) {
    Game.textArr = textArr;
    Game.alert(textArr[0]);
    Game.textArrIndex = 1;
    $('#popupDiv').jqmShow();
    $('#popupDiv').center();
    $('#popupClose').hide();
    $('#popupNext').show();
  },

  //Resize game area on orientation change
  changeOrientation: function () {
    this.screenWidth = $(window).width() - this.widthOffset;
    this.screenHeight = $(window).height() - this.heightOffset;

    $('#cr-stage').css("width", this.screenWidth);
    $('#cr-stage').css("height", this.screenHeight);
  }
};

//Used for centering the popup
jQuery.fn.center = function () {
  var container = $(window);
  var top = -this.height() / 2;
  var left = (-this.width() - 20) / 2;
  return this.css('position', 'absolute').css({
    'margin-left': left + 'px',
    'margin-top': top + 'px',
    'left': '50%',
    'top': '40%'
  });
};

//Configure button clickers
$(document).ready(function () {
  $("#up-arrow").click(function () {
    Crafty.trigger('MovePlayerForward');
  });
  $("#down-arrow").click(function () {
    Crafty.trigger('MovePlayerBackwards');
  });
  $("#left-arrow").click(function () {
    Crafty.trigger('MovePlayerLeft');
  });
  $("#right-arrow").click(function () {
    Crafty.trigger('MovePlayerRight');
  });

  $("#start-moving").click(function () {
    Crafty.trigger('StartMoving');
  });

  $("#start-moving").click(function () {
    Crafty.trigger('StartMoving');
  });

  $("#zoomIn").click(function () {
    Game.zoomIn();
  });
  $("#zoomOut").click(function () {
    Game.zoomOut();
  });

  $("#copy-last").click(function () {
    Game.copyLastMovements();
  });
  $("#remove-all").click(function () {
    Game.removeAllMovements();
  });
  $("#remove-last").click(function () {
    Game.removeLastMovement();
  });

  $('#popupDiv').jqm();

  $(".jqmClose").on("click", function () {
    $('#popupDiv').jqmHide();
  });

  $('#popupNext').on("click", function () {
    var text = Game.textArr[Game.textArrIndex];
    if (Game.textArrIndex < Game.textArr.length - 1) {
      if (text.indexOf("<") !== -1) {
        $("#popupContent").text("");
        $("#popupContent").append(text);
      }
      else {
        $("#popupContent").text(text);
      }
      Game.textArrIndex++;
    }
    else {
      Game.alert(text);
    }
  });

  Game.start();

  //Reload game area on orientation change
  (function () {
    var init = function () {
      var updateOrientation = function () {
        var orientation = window.orientation;

        switch (orientation) {
          case 90:
          case -90:
            Game.changeOrientation();
            break;
          default:
            Game.changeOrientation();
            break
        }

        // set the class on the HTML element (i.e. )
        document.body.parentNode.setAttribute('class', orientation);
      };

      // event triggered every 90 degrees of rotation
      window.addEventListener('orientationchange', updateOrientation, false);

      // initialize the orientation
      updateOrientation();
    };

    window.addEventListener('DOMContentLoaded', init, false);

  })();
});

//http://blackscorp.github.com/tiled2crafty/tests/