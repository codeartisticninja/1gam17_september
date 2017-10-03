"use strict";
import Scene       = require("../lib/scenes/Scene");
import myGame      = require("../MyGame");
import Sprite      = require("../lib/scenes/actors/Sprite");
import Actor       = require("../lib/scenes/actors/Actor");
import MediaPlayer = require("../lib/utils/MediaPlayer");
import Script      = require("../lib/utils/Script");

import ParticleEmitter = require("../lib/scenes/actors/ParticleEmitter");
import Aye             = require("./actors/Aye");
import Emotion         = require("./actors/Emotion");
import Pill            = require("./actors/Pill");

/**
 * AdventureScene class
 */

class AdventureScene extends Scene {
  public game:myGame;
  public script:Script;

  constructor(game:myGame, map:string) {
    super(game, map);
    this.actorTypes["Aye"] = Aye;
    this.actorTypes["ParticleEmitter"] = ParticleEmitter;
    this.actorTypes["Emotion"] = Emotion;
    this.actorTypes["Pill"] = Pill;
    this.dispencePill = this.dispencePill.bind(this);
  }

  reset() {
    super.reset();
    this.game.mediaChannels.music.play("./assets/music/AuditoryCheesecake_Avalon.mp3", true);
    this._pillDispenceTO = this.setAlarm(this.game.frameRate*10, this.dispencePill);
  }


  update() {
    super.update();
    this.onOverlap(this.actorsByType["Aye"], this.actorsByType["Pill"], this.AyeMeetsPill, this);
  }

  dispencePill() {
    this.clearAlarm(this._pillDispenceTO);
    (<ParticleEmitter>this.actorsByName["PillEmitter"]).emit();
    this._pillDispenceTO = this.setAlarm(this.game.frameRate*30, this.dispencePill);
  }

  click(x:number, y:number) {
    super.click(x,y);
    (<Aye>this.actorsByType["Aye"][0]).goTo(this.mouse);
  }

  AyeMeetsPill(aye:Aye, pill:Pill) {
    this.removeActor(pill);
    aye.getPill();
  }


  /*
    _privates
  */

  private _pillDispenceTO:any;

  private _gotoEnter() {
    if (this.script && this.script.storyTree) {
      this.script.goto("#enter");
    } else {
      setTimeout(this._gotoEnter.bind(this), 1024);
    }
  }
}
export = AdventureScene;
