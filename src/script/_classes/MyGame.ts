"use strict";
import Game = require("./lib/Game");

import AdventureScene  = require("./scenes/AdventureScene");


/**
 * MyGame class
 */

class MyGame extends Game {
  public scriptVars={}
  
  constructor(container:string|HTMLElement) {
    super(container, 960);
    this.frameRate = 12;
    this.addScene("space", new AdventureScene(this, "./assets/maps/space.json"));
    this.joypad.mode = "gc";
    this.joypad.enable();
    this.startScene("space");
  }

}
export = MyGame;
